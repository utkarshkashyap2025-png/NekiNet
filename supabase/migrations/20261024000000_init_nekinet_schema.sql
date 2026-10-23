-- ============================================================
-- NekiNet Database Schema & Row Level Security (RLS) Migration
-- Version: 1.0 (Phase 3 Backend Foundation)
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('requester', 'volunteer', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_category AS ENUM (
        'elderly_care',
        'pharmacy_runs',
        'groceries_errands',
        'tech_support',
        'emergency_respite',
        'pet_care',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('open', 'matched', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'requester',
    full_name TEXT NOT NULL,
    phone TEXT,
    bio TEXT DEFAULT '',
    approx_location TEXT DEFAULT 'Greenwood Sector (~400m zone)',
    lat DOUBLE PRECISION DEFAULT 28.4595,
    lng DOUBLE PRECISION DEFAULT 77.0266,
    radius_km INTEGER DEFAULT 5 CHECK (radius_km IN (1, 3, 5, 10, 15)),
    is_available BOOLEAN DEFAULT true,
    completed_tasks_count INTEGER DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Volunteer Skills Table
CREATE TABLE IF NOT EXISTS public.volunteer_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (profile_id, skill_name)
);

-- 5. Help Requests Table
CREATE TABLE IF NOT EXISTS public.help_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category request_category NOT NULL DEFAULT 'other',
    urgency urgency_level NOT NULL DEFAULT 'medium',
    approx_location TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status request_status NOT NULL DEFAULT 'open',
    required_skills TEXT[] DEFAULT '{}',
    ai_suggested BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Request Feedback Table
CREATE TABLE IF NOT EXISTS public.request_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    volunteer_gratitude TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------
-- Publicly readable basic info so volunteers & requesters can verify each other
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile (cannot change system IDs)
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- VOLUNTEER SKILLS POLICIES
-- ------------------------------------------------------------
CREATE POLICY "Skills are viewable by authenticated users"
ON public.volunteer_skills FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Volunteers can insert their own skills"
ON public.volunteer_skills FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Volunteers can delete their own skills"
ON public.volunteer_skills FOR DELETE
TO authenticated
USING (auth.uid() = profile_id);

-- ------------------------------------------------------------
-- HELP REQUESTS POLICIES
-- ------------------------------------------------------------
-- Any authenticated user can view open requests or requests they participate in
CREATE POLICY "Users can view open or involved requests"
ON public.help_requests FOR SELECT
TO authenticated
USING (
    status = 'open' 
    OR requester_id = auth.uid() 
    OR volunteer_id = auth.uid()
);

-- Requesters can only insert requests where they are the requester
CREATE POLICY "Users can create requests as requester"
ON public.help_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requester_id);

-- Requesters can update/cancel their own requests
CREATE POLICY "Requesters can update their own requests"
ON public.help_requests FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id)
WITH CHECK (auth.uid() = requester_id);

-- Volunteers can accept open requests or update status of assigned requests
CREATE POLICY "Volunteers can claim or update assigned requests"
ON public.help_requests FOR UPDATE
TO authenticated
USING (
    (status = 'open' AND volunteer_id IS NULL)
    OR (volunteer_id = auth.uid())
)
WITH CHECK (
    (volunteer_id = auth.uid())
);

-- ------------------------------------------------------------
-- REQUEST FEEDBACK POLICIES
-- ------------------------------------------------------------
CREATE POLICY "Feedback is viewable by authenticated users"
ON public.request_feedback FOR SELECT
TO authenticated
USING (true);

-- Only requester of a completed request can post feedback
CREATE POLICY "Requesters can insert feedback on completed requests"
ON public.request_feedback FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = requester_id
    AND EXISTS (
        SELECT 1 FROM public.help_requests
        WHERE id = request_id
        AND requester_id = auth.uid()
        AND status = 'completed'
    )
);

-- ------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ------------------------------------------------------------
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================
-- Automatic User Profile Creation on Signup Trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, approx_location)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'requester'::user_role),
        COALESCE(new.raw_user_meta_data->>'approx_location', 'Greenwood Sector (~400m zone)')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
