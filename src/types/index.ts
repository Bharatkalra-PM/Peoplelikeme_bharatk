export type UserRole = 'switcher' | 'guide' | 'admin';

export type ObjectiveType = 'switch_role' | 'restart_break' | 'become_guide';

export type GenderOption = 'No preference' | 'Female' | 'Male' | 'Non-binary';

export type ApplicationStatus = 'under_review' | 'approved' | 'needs_more' | 'rejected';

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string;
  last_initial: string;
  full_name: string;
  email: string;
  city: string;
  avatar_color: string;
  share_contact_with_guide: boolean;
  share_contact_with_pod: boolean;
  created_at: string;
  status?: 'active' | 'paused' | 'pending_approval' | 'rejected' | 'needs_more';
  linkedin_url?: string;
  verified?: boolean;
  gender?: 'Female' | 'Male' | 'Non-binary';
  is_sample?: boolean;
  objective?: ObjectiveType;
  onboarding_completed?: boolean;
  rating_avg?: number;
  ratings_count?: number;
  guided_count?: number;
  application_status?: ApplicationStatus;
}

export type PromptKey =
  | 'coming_from'
  | 'going_to'
  | 'pushing_change'
  | 'tried_so_far'
  | 'holding_back'
  | 'story';

export interface StoryAnswer {
  id: string;
  user_id: string;
  prompt_key: PromptKey;
  answer: string;
  input_mode: 'text' | 'voice';
  created_at: string;
}

export interface MoveProfile {
  user_id: string;
  from_role: string;
  from_field: string;
  from_company_type: string;
  to_role: string;
  years_experience: number;
  months_since_leaving: number | null;
  dependants: string;
  priority: string;
  availability: string[];
  constraints: string[];
  went_back: boolean;
  years_since_move: number | null;
  story: string | null;
  confirmed_at: string | null;
  preferred_guide_gender?: GenderOption;
  already_done?: string[];
}

export type GuideRequestStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface GuideRequest {
  id: string;
  switcher_id: string;
  guide_id: string;
  note: string;
  status: GuideRequestStatus;
  sent_at: string;
  respond_by: string; // 48 hours from sent_at
  match_reason: string;
}

export type PodStatus = 'forming' | 'active' | 'completed';

export interface Pod {
  id: string;
  name: string;
  created_at: string;
  status: PodStatus;
  target_role: string;
  members_count: number;
  max_members: number;
  call_slot?: string;
  checkin_slot?: string;
  agenda?: string;
  host_name?: string;
  is_sample?: boolean;
}

export interface PodMember {
  pod_id: string;
  user_id: string;
  joined_at: string;
  left_at?: string | null;
  profile: Pick<
    Profile,
    'id' | 'first_name' | 'last_initial' | 'city' | 'avatar_color' | 'share_contact_with_pod' | 'is_sample'
  > & { email?: string };
  move_line: string;
  last_posted_at?: string;
}

export type RhythmStatus = 'active' | 'completed' | 'landed' | 'ended_early';

export interface Rhythm {
  id: string;
  switcher_id: string;
  guide_id: string | null;
  pod_id: string | null;
  start_date: string;
  week: number; // 1 to 8
  status: RhythmStatus;
  experiment_group?: 'standard' | 'guide_only';
  guide_slot?: string;
}

export interface Milestone {
  id: string;
  week: number; // 1 to 8
  title: string;
  description?: string;
  completed?: boolean;
}

export interface SprintPlan {
  id: string;
  switcher_id: string;
  guide_id: string;
  status: 'draft' | 'finalised';
  milestones: Milestone[];
  suggested_goals: Record<number, string[]>;
  updated_at: string;
}

export interface ConversationRating {
  id: string;
  session_id: string;
  switcher_id: string;
  guide_id: string;
  helpful_score: number; // 1 to 5
  move_match_score: number; // 1 to 5
  created_at: string;
}

export interface CareerGuideApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  work_email: string;
  work_email_verified: boolean;
  city: string;
  gender?: 'Female' | 'Male' | 'Non-binary';
  linkedin_url: string;
  linkedin_connected: boolean;
  cv_file_name: string;
  cv_text: string;
  from_role: string;
  from_field: string;
  to_role: string;
  years_in_earlier_role: number;
  years_in_current_role: number;
  years_since_move: number;
  how_long_it_took: string;
  what_would_do_differently: string;
  story: string;
  went_back: boolean;
  commitment_confirmed: boolean;
  checks: {
    linkedin_connected: boolean;
    email_verified: boolean;
    move_found: boolean;
    mismatch_flags: string[];
  };
  status: ApplicationStatus;
  admin_note?: string;
  created_at: string;
}

export type SessionKind = 'guide' | 'pod_call' | 'pod_checkin';

export interface Session {
  id: string;
  rhythm_id: string | null;
  pod_id: string | null;
  kind: SessionKind;
  starts_at: string; // ISO string
  duration_min: number; // 30 min for guide/pod_call, 15 min for checkin
  video_url: string;
  agenda: string | null;
  held: boolean | null;
  title: string;
  with_name?: string;
  rated?: boolean;
}

export type GoalStatus = 'not_yet' | 'partly' | 'done';

export interface Goal {
  id: string;
  user_id: string;
  week_start: string; // YYYY-MM-DD
  week_number?: number;
  text: string;
  status: GoalStatus;
  suggested_by_guide?: boolean;
  updated_at: string;
}

export interface PodPost {
  id: string;
  pod_id: string;
  author_id: string;
  author_name: string;
  author_initial: string;
  body: string;
  is_win: boolean;
  created_at: string;
  cheers_count: number;
  cheered_by_me: boolean;
}

export type ReachOutAudience = 'guide' | 'pod';
export type ReachOutReason = 'few_goals_two_weeks' | 'no_update_7_days';

export interface ReachOutPrompt {
  id: string;
  subject_user_id: string;
  subject_name: string;
  subject_initial: string;
  audience: ReachOutAudience;
  reason: ReachOutReason;
  created_at: string;
  resolved_at: string | null;
  move_line?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reported_name: string;
  reason: string;
  details: string;
  created_at: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface GuideCandidate {
  profile: Profile;
  move_profile: MoveProfile;
  score: number;
  match_reason: string;
  move_line: string;
  diff_notes?: string[];
  diffNotes?: string[];
}
