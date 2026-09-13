-- ====================================================================
-- PROOF DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Target: Supabase Postgres
-- Designed for RevenueCat Shipaton 2026
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Journeys Table
CREATE TABLE IF NOT EXISTS public.journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON public.journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_created_at ON public.journeys(created_at DESC);

-- 3. Evidence Table
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    reflection TEXT,
    prompt_spark VARCHAR(100),
    metrics_tag VARCHAR(50),
    order_index INTEGER NOT NULL DEFAULT 1,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_journey_day ON public.evidence(journey_id, day_number ASC);
CREATE INDEX IF NOT EXISTS idx_evidence_user_id ON public.evidence(user_id);

-- 4. Milestones Table
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    reached_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_journey_id ON public.milestones(journey_id);

-- 5. Proof Stories Table
CREATE TABLE IF NOT EXISTS public.proof_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    total_days INTEGER NOT NULL,
    hours_invested NUMERIC(5, 1) NOT NULL DEFAULT 0.0,
    captures_count INTEGER NOT NULL DEFAULT 0,
    mastery_delta VARCHAR(20),
    story_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Subscriptions Table (RevenueCat sync)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_pro BOOLEAN NOT NULL DEFAULT FALSE,
    entitlement_active BOOLEAN NOT NULL DEFAULT FALSE,
    entitlement_id VARCHAR(50) DEFAULT 'proof_pro',
    active_product_id VARCHAR(100),
    expiration_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY POLICIES (RLS)
-- Enforce absolute isolation: users can ONLY access their own records
-- ====================================================================

ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Journeys RLS
CREATE POLICY "Journeys select own" ON public.journeys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Journeys insert own" ON public.journeys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Journeys update own" ON public.journeys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Journeys delete own" ON public.journeys
    FOR DELETE USING (auth.uid() = user_id);

-- Evidence RLS
CREATE POLICY "Evidence select own" ON public.evidence
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Evidence insert own" ON public.evidence
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Evidence update own" ON public.evidence
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Evidence delete own" ON public.evidence
    FOR DELETE USING (auth.uid() = user_id);

-- Milestones RLS
CREATE POLICY "Milestones select own" ON public.milestones
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Milestones insert own" ON public.milestones
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Proof Stories RLS
CREATE POLICY "Stories select own" ON public.proof_stories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Stories insert own" ON public.proof_stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions RLS
CREATE POLICY "Subscriptions select own" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- ====================================================================
-- SUPABASE STORAGE BUCKET POLICIES
-- Bucket: evidence-media (Private)
-- ====================================================================

-- Insert into storage.buckets (evidence-media)
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence-media', 'evidence-media', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can upload only to their own folder path (user_id/...)
CREATE POLICY "Evidence Storage Insert" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'evidence-media' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Evidence Storage Select" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'evidence-media' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
