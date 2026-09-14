import { Journey, Evidence, AIInsights, ProofStory, SubscriptionLimits } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

class ApiService {
  private token: string | null = null;

  setAuthToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
      }

      return res.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw err;
    }
  }

  // Health
  async checkHealth() {
    return this.request<{ status: string; app: string }>('/health');
  }

  // Journeys
  async getJourneys(): Promise<Journey[]> {
    return this.request<Journey[]>('/api/journeys');
  }

  async getJourneyDetail(journeyId: string): Promise<Journey> {
    return this.request<Journey>(`/api/journeys/${journeyId}`);
  }

  async createJourney(data: { title: string; category: string; duration_days: number; description?: string }): Promise<Journey> {
    return this.request<Journey>('/api/journeys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteJourney(journeyId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/journeys/${journeyId}`, {
      method: 'DELETE',
    });
  }

  // Evidence
  async addEvidence(data: {
    journey_id: string;
    day_number: number;
    image_url: string;
    reflection?: string;
    prompt_spark?: string;
    metrics_tag?: string;
  }): Promise<Evidence> {
    return this.request<Evidence>('/api/evidence', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTimeline(journeyId: string): Promise<Evidence[]> {
    return this.request<Evidence[]>(`/api/evidence/journey/${journeyId}`);
  }

  // AI Insights
  async getAIInsights(data: {
    journey_id: string;
    journey_title: string;
    category: string;
    duration_days: number;
    entries: { day_number: number; reflection: string; metrics_tag?: string }[];
  }): Promise<AIInsights> {
    return this.request<AIInsights>('/api/ai/insights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Stories
  async synthesizeStory(journeyId: string): Promise<ProofStory> {
    return this.request<ProofStory>('/api/stories/synthesize', {
      method: 'POST',
      body: JSON.stringify({ journey_id: journeyId }),
    });
  }

  // Subscriptions & Limits
  async getTierLimits(): Promise<SubscriptionLimits> {
    return this.request<SubscriptionLimits>('/api/subscriptions/limits');
  }
}

export const api = new ApiService();