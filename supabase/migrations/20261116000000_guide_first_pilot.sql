-- Migration: Guide-First 4-Week Pilot, Pilot Moves, Waitlist, Call Attendance,
-- Weekly & End-of-Pilot Ratings, Month 2 Price Test Offer, and Pilot Settings

-- 1. Pilot Moves (Admin-managed list of active pilot transitions)
CREATE TABLE IF NOT EXISTS public.pilot_moves (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  from_keywords TEXT[] NOT NULL DEFAULT '{}',
  to_keywords TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Non-Pilot Move Waitlist
CREATE TABLE IF NOT EXISTS public.pilot_waitlist (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bengaluru',
  from_role TEXT NOT NULL,
  to_role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Call Attendance & Guide Capacity on Rhythms / Sessions
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS max_active_changers INTEGER NOT NULL DEFAULT 2;

ALTER TABLE IF EXISTS public.sessions
  ADD COLUMN IF NOT EXISTS attendance_status TEXT CHECK (attendance_status IN ('attended', 'missed', 'scheduled')) DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS confirmed_by_guide_at TIMESTAMPTZ;

-- 4. Weekly Call Helpfulness Ratings & End-of-Pilot Answers
CREATE TABLE IF NOT EXISTS public.call_ratings (
  id TEXT PRIMARY KEY,
  changer_id TEXT NOT NULL,
  guide_id TEXT NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4),
  helpful_score INTEGER NOT NULL CHECK (helpful_score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.end_of_pilot_surveys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('changer', 'guide')),
  overall_guide_rating INTEGER CHECK (overall_guide_rating BETWEEN 1 AND 5),
  finished_all_four_weeks BOOLEAN,
  would_guide_again BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Week 4 Month 2 Offer & Price Test Assignment (50/50 split: INR 499 vs INR 699, plus INR 199 fallback)
CREATE TABLE IF NOT EXISTS public.month2_offers (
  user_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  assigned_price_inr INTEGER NOT NULL CHECK (assigned_price_inr IN (499, 699)),
  offer_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  primary_response TEXT CHECK (primary_response IN ('yes', 'not_now')),
  primary_responded_at TIMESTAMPTZ,
  fallback_199_response TEXT CHECK (fallback_199_response IN ('yes', 'no')),
  fallback_responded_at TIMESTAMPTZ,
  worth_it_feedback TEXT,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_marked_at TIMESTAMPTZ
);

-- 6. Admin Pilot Go/No-Go Threshold Settings
CREATE TABLE IF NOT EXISTS public.pilot_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  calls_attended_threshold INTEGER NOT NULL DEFAULT 7,
  calls_attended_total INTEGER NOT NULL DEFAULT 10,
  goals_met_threshold INTEGER NOT NULL DEFAULT 6,
  goals_met_total INTEGER NOT NULL DEFAULT 10,
  high_rating_threshold INTEGER NOT NULL DEFAULT 7,
  high_rating_total INTEGER NOT NULL DEFAULT 10,
  paid_month2_threshold INTEGER NOT NULL DEFAULT 3,
  paid_month2_total INTEGER NOT NULL DEFAULT 10,
  guides_again_threshold INTEGER NOT NULL DEFAULT 4,
  guides_again_total INTEGER NOT NULL DEFAULT 5,
  pods_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security (RLS)
ALTER TABLE public.pilot_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.end_of_pilot_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.month2_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_settings ENABLE ROW LEVEL SECURITY;
