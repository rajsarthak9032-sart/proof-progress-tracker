export type CategoryType = 'Art' | 'Coding' | 'Music' | 'Writing' | 'Fitness' | 'Language' | 'Other';

export interface Milestone {
  id: string;
  journey_id: string;
  day_number: number;
  title: string;
  description: string;
  reached_at: string;
  is_completed: boolean;
}

export interface Evidence {
  id: string;
  journey_id: string;
  day_number: number;
  image_url: string;
  reflection?: string;
  prompt_spark?: string;
  metrics_tag?: string;
  captured_at: string;
  order_index: number;
}

export interface Journey {
  id: string;
  user_id: string;
  title: string;
  category: CategoryType | string;
  duration_days: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  current_day: number;
  evidence_count: number;
  milestone_count: number;
  latest_evidence?: Evidence;
  evidence?: Evidence[];
  milestones?: Milestone[];
}

export interface AIInsights {
  ai_used: boolean;
  model_name: string;
  journey_title: string;
  grounded_entries_count: number;
  key_shift: string;
  growth_trajectory: string;
  observations: string[];
  sentiment_summary: string;
  generated_at: string;
}

export interface ProofStoryChapter {
  day_number: number;
  title: string;
  image_url: string;
  badge_label: string;
  narrative: string;
}

export interface ProofStory {
  id: string;
  journey_id: string;
  title: string;
  total_days: number;
  hours_invested: number;
  captures_count: number;
  mastery_delta: string;
  chapters: ProofStoryChapter[];
  culmination_quote: string;
  created_at: string;
}

export interface SubscriptionStatus {
  is_pro: boolean;
  entitlement_active: boolean;
  entitlement_id: string;
  expiration_date?: string;
  active_product_id?: string;
  source: string;
}

export interface SubscriptionLimits {
  tier: 'free' | 'pro';
  is_pro: boolean;
  max_active_journeys: number;
  active_journeys_count: number;
  can_create_journey: boolean;
  advanced_time_travel: boolean;
  advanced_before_after: boolean;
  advanced_ai_insights: boolean;
  unlimited_stories: boolean;
  premium_export: boolean;
}
