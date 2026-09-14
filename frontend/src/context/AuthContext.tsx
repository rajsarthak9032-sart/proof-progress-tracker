import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string; needsVerification?: boolean }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string; needsVerification?: boolean }>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  verifyEmail: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured);

  const setAuthToken = useCallback((token: string | null) => {
    api.setAuthToken(token);
  }, []);

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
        setAuthToken(session.access_token);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        setAuthToken(session.access_token);
      } else {
        setAuthToken(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setAuthToken]);

  const setDemoMode = useCallback((enabled: boolean) => {
    setIsDemoMode(enabled);
    if (enabled) {
      setAuthToken(null);
    } else if (session?.access_token) {
      setAuthToken(session.access_token);
    }
  }, [session, setAuthToken]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Please use Demo Mode or configure your environment variables.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Check if email is verified
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return { error: 'Please verify your email before signing in.', needsVerification: true };
    }

    setIsDemoMode(false);
    return {};
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Please use Demo Mode or configure your environment variables.' };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Use default Supabase flow
      }
    });
    if (error) return { error: error.message };

    // Supabase sends verification email automatically
    // User needs to verify before they can sign in
    return { needsVerification: true };
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) return { error: error.message };
    return {};
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: undefined, // Use default flow
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  }, []);

  const verifyEmail = useCallback(async () => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }
    // This will trigger a refresh of the session
    const { data, error } = await supabase.auth.getSession();
    if (error) return { error: error.message };
    if (data.session?.user && !data.session.user.email_confirmed_at) {
      return { error: 'Email not yet verified. Please check your inbox.' };
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    setAuthToken(null);
  }, [setAuthToken]);

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
        resendVerification,
        resetPassword,
        updatePassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);