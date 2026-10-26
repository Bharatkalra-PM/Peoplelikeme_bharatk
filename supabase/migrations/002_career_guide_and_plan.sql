-- People Like Me: Migration 002 — Career Guide Applications, 8-Week Sprint Plans, Milestones, Ratings & Demo Mode
-- Adds schema and Row-Level Security (RLS) for every new table and column

-- 1. Extend profiles with Career Guide ratings, guided count, gender, objective, and sample flag
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('woman', 'man', 'non_binary', 'prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS guided_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS objective TEXT CHECK (objective IN ('switch_role', 'restart_after_break', 'become_career_guide')),
  ADD COLUMN IF NOT EXISTS application_status TEXT CHECK (application_status IN ('under_review', 'approved', 'needs_more_info', 'rejected'));

-- 2. Extend move_profiles with industry and optional Career Guide gender preference
ALTER TABLE move_profiles
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS preferred_guide_gender TEXT CHECK (preferred_guide_gender IN ('woman', 'man', 'non_binary', 'no_preference')),
  ADD COLUMN IF NOT EXISTS tried_so_far TEXT,
  ADD COLUMN IF NOT EXISTS holding_back TEXT;

-- 3. Extend pods with target_size and is_sample
ALTER TABLE pods
  ADD COLUMN IF NOT EXISTS target_size INT DEFAULT 4 CHECK (target_size BETWEEN 4 AND 6),
  ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT FALSE;

-- 4. Extend goals with suggested_by_guide flag
ALTER TABLE goals
  ADD COLUMN IF NOT EXISTS suggested_by_guide BOOLEAN DEFAULT FALSE;

-- 5. Sprint Plans Table (Career Guide owns the plan: draft -> finalised)
CREATE TABLE IF NOT EXISTS sprint_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rhythm_id UUID NOT NULL REFERENCES rhythms(id) ON DELETE CASCADE,
  switcher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalised')),
  finalised_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Milestones Table (4 to 6 personal milestones across the 8 weeks)
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES sprint_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_week INT NOT NULL CHECK (target_week BETWEEN 1 AND 8),
  completed BOOLEAN DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Conversation Ratings Table (Private post-conversation rating on two questions)
CREATE TABLE IF NOT EXISTS conversation_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  switcher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week INT NOT NULL CHECK (week BETWEEN 1 AND 8),
  helpful_score INT NOT NULL CHECK (helpful_score BETWEEN 1 AND 5),
  move_match_score INT NOT NULL CHECK (move_match_score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Career Guide Applications Table (Reviewed in /admin)
CREATE TABLE IF NOT EXISTS guide_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  linkedin_connected BOOLEAN DEFAULT FALSE,
  work_email_verified BOOLEAN DEFAULT FALSE,
  cv_file_name TEXT NOT NULL,
  cv_text_summary TEXT NOT NULL,
  from_role TEXT NOT NULL,
  to_role TEXT NOT NULL,
  industry TEXT,
  years_in_earlier_role INT NOT NULL DEFAULT 0,
  years_in_current_role INT NOT NULL DEFAULT 0,
  how_long_it_took TEXT NOT NULL,
  what_do_differently TEXT NOT NULL,
  story_in_words TEXT NOT NULL,
  commitment_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  move_found_check BOOLEAN NOT NULL DEFAULT FALSE,
  mismatch_flags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN ('under_review', 'approved', 'needs_more_info', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security (RLS) on all new tables
ALTER TABLE sprint_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Sprint Plans & Milestones:
-- Both the switcher and their assigned Career Guide can view the plan; Career Guide can update and finalise
CREATE POLICY "Switcher and Career Guide can view sprint plan" ON sprint_plans
  FOR SELECT USING (auth.uid() = switcher_id OR auth.uid() = guide_id);

CREATE POLICY "Career Guide and Switcher can manage sprint plan" ON sprint_plans
  FOR ALL USING (auth.uid() = guide_id OR auth.uid() = switcher_id);

CREATE POLICY "Switcher and Career Guide can view milestones" ON milestones
  FOR SELECT USING (
    plan_id IN (SELECT id FROM sprint_plans WHERE switcher_id = auth.uid() OR guide_id = auth.uid())
  );

CREATE POLICY "Career Guide and Switcher can manage milestones" ON milestones
  FOR ALL USING (
    plan_id IN (SELECT id FROM sprint_plans WHERE switcher_id = auth.uid() OR guide_id = auth.uid())
  );

-- RLS Policies for Conversation Ratings (Strictly private to the switcher and admins; aggregates update profile rating)
CREATE POLICY "Switcher can insert and view own private ratings" ON conversation_ratings
  FOR ALL USING (
    auth.uid() = switcher_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Career Guide Applications (Applicant sees own status; Admin manages queue)
CREATE POLICY "Applicants can view and submit own application" ON guide_applications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Applicants can insert own application" ON guide_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update Career Guide applications" ON guide_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
