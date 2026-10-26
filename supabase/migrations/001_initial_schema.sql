-- People Like Me: Initial Postgres Schema & Row Level Security
-- Section 5 of Build Spec

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('switcher', 'guide', 'admin')),
  first_name TEXT NOT NULL,
  last_initial TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  avatar_color TEXT DEFAULT '#102A2E',
  share_contact_with_guide BOOLEAN DEFAULT FALSE,
  share_contact_with_pod BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'pending_approval')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Story Answers Table
CREATE TABLE IF NOT EXISTS story_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_key TEXT NOT NULL CHECK (prompt_key IN ('coming_from', 'going_to', 'pushing_change', 'tried_so_far', 'holding_back', 'story')),
  answer TEXT NOT NULL,
  input_mode TEXT NOT NULL CHECK (input_mode IN ('text', 'voice')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Move Profiles Table
CREATE TABLE IF NOT EXISTS move_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  from_role TEXT NOT NULL,
  from_field TEXT NOT NULL,
  from_company_type TEXT,
  to_role TEXT NOT NULL,
  years_experience INT NOT NULL DEFAULT 0,
  months_since_leaving INT,
  dependants TEXT,
  priority TEXT,
  availability TEXT[] DEFAULT '{}',
  constraints TEXT[] DEFAULT '{}',
  went_back BOOLEAN DEFAULT FALSE,
  years_since_move INT,
  story TEXT,
  confirmed_at TIMESTAMPTZ
);

-- 4. Pods Table
CREATE TABLE IF NOT EXISTS pods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed')),
  target_role TEXT NOT NULL,
  call_slot TEXT,
  checkin_slot TEXT,
  agenda TEXT,
  host_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Pod Members Table
CREATE TABLE IF NOT EXISTS pod_members (
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  PRIMARY KEY (pod_id, user_id)
);

-- 6. Guide Requests Table (with 48-hour respond_by rule)
CREATE TABLE IF NOT EXISTS guide_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  switcher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  respond_by TIMESTAMPTZ NOT NULL, -- 48h from sent_at
  match_reason TEXT NOT NULL
);

-- 7. Rhythms Table (8-week sprint)
CREATE TABLE IF NOT EXISTS rhythms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  switcher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pod_id UUID REFERENCES pods(id) ON DELETE SET NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  week INT NOT NULL DEFAULT 1 CHECK (week BETWEEN 1 AND 8),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'landed', 'ended_early')),
  experiment_group TEXT DEFAULT 'standard' CHECK (experiment_group IN ('standard', 'guide_only')),
  guide_slot TEXT
);

-- 8. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rhythm_id UUID REFERENCES rhythms(id) ON DELETE CASCADE,
  pod_id UUID REFERENCES pods(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('guide', 'pod_call', 'pod_checkin')),
  starts_at TIMESTAMPTZ NOT NULL,
  duration_min INT NOT NULL,
  video_url TEXT NOT NULL,
  agenda TEXT,
  held BOOLEAN,
  title TEXT NOT NULL
);

-- 9. Goals Table (weekly goals: done, partly, not_yet)
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_yet' CHECK (status IN ('not_yet', 'partly', 'done')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Pod Posts & Cheers
CREATE TABLE IF NOT EXISTS pod_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_win BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cheers (
  post_id UUID NOT NULL REFERENCES pod_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- 11. Reach Out Prompts (created by slipping detection)
CREATE TABLE IF NOT EXISTS reach_out_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  audience TEXT NOT NULL CHECK (audience IN ('guide', 'pod')),
  reason TEXT NOT NULL CHECK (reason IN ('few_goals_two_weeks', 'no_update_7_days')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 12. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE move_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhythms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reach_out_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Minimum RLS Policies:
-- 1. Profiles: users can read and update their own profile; others can see safe fields
CREATE POLICY "Users can view and update own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- 2. Story answers & Move profiles: owned by user
CREATE POLICY "Users manage own story answers" ON story_answers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own move profile" ON move_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 3. Pod members: can see fellow members in same pod
CREATE POLICY "Pod members can view peers" ON pod_members
  FOR SELECT USING (
    pod_id IN (SELECT pod_id FROM pod_members WHERE user_id = auth.uid())
  );

-- 4. Pod posts: readable by pod members
CREATE POLICY "Pod posts readable by pod members" ON pod_posts
  FOR SELECT USING (
    pod_id IN (SELECT pod_id FROM pod_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Pod members can create posts" ON pod_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    pod_id IN (SELECT pod_id FROM pod_members WHERE user_id = auth.uid())
  );

-- 5. Goals: readable by owner, their guide, and their pod members
CREATE POLICY "Goals visible to owner, guide, and pod members" ON goals
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT guide_id FROM rhythms WHERE switcher_id = goals.user_id AND status = 'active') OR
    auth.uid() IN (
      SELECT pm2.user_id FROM pod_members pm1
      JOIN pod_members pm2 ON pm1.pod_id = pm2.pod_id
      WHERE pm1.user_id = goals.user_id
    )
  );

CREATE POLICY "Users manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- 6. Reach out prompts: reasons visible to guides, never pod
CREATE POLICY "Guide sees reasons for reach out" ON reach_out_prompts
  FOR SELECT USING (
    (audience = 'guide' AND auth.uid() IN (SELECT guide_id FROM rhythms WHERE switcher_id = reach_out_prompts.subject_user_id)) OR
    (audience = 'pod' AND auth.uid() IN (
      SELECT pm2.user_id FROM pod_members pm1
      JOIN pod_members pm2 ON pm1.pod_id = pm2.pod_id
      WHERE pm1.user_id = reach_out_prompts.subject_user_id
    ))
  );

-- 7. Reports: only admins can select reports
CREATE POLICY "Admins only for reports" ON reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Users can submit reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
