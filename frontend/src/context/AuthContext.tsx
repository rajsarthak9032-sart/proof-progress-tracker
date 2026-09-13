import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        api.setAuthToken(session.access_token);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        api.setAuthToken(session.access_token);
      } else {
        api.setAuthToken(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    if (enabled) {
      // Clear token when entering demo mode to strictly isolate demo activity
      api.setAuthToken(null);
    } else if (session?.access_token) {
      api.setAuthToken(session.access_token);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet. Please use Demo Mode or configure .env.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { error: error.message };
    setIsDemoMode(false);
    return {};
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet. Please use Demo Mode or configure .env.' };
    }
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) return { error: error.message };
    setIsDemoMode(false);
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    api.setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isDemoMode,
        setDemoMode,
        loading,
        signOut,
        signInWithEmail,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
