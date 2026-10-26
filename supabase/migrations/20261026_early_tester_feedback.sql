-- Migration: Early tester feedback updates (Charu, Astha, Arjun, Karthik)
ALTER TABLE move_profiles
  ADD COLUMN IF NOT EXISTS story_options JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS pod_intro TEXT DEFAULT '';

-- Ensure Row-Level Security keeps private contact details hidden unless share_contact_with_pod or share_contact_with_guide is enabled
COMMENT ON COLUMN move_profiles.pod_intro IS 'Optional two-line intro shared with pod peers; private contact and employer details remain hidden by default.';
