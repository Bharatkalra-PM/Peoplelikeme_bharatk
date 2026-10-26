export type UserRole = 'switcher' | 'guide' | 'admin';

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
  status?: 'active' | 'paused' | 'pending_approval';
  linkedin_url?: string;
  verified?: boolean;
}

export type PromptKey = 'coming_from' | 'going_to' | 'pushing_change' | 'tried_so_far' | 'holding_back' | 'story';

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
  dependants: string; // 'None' | 'Children' | 'Elderly parents' | 'Partner' | etc.
  priority: string;   // 'Speed to role' | 'Target salary' | 'Domain fit' | 'Work-life balance'
  availability: string[]; // e.g. ['Weekday evenings', 'Weekend mornings']
  constraints: string[];  // e.g. ['Caregiving duties', 'Notice period: 60 days', 'Restricted location']
  went_back: boolean;     // e.g. true for 'Retail sales → Associate PM → back to sales'
  years_since_move: number | null;
  story: string | null;
  confirmed_at: string | null;
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
}

export interface PodMember {
  pod_id: string;
  user_id: string;
  joined_at: string;
  left_at?: string | null;
  profile: Pick<Profile, 'id' | 'first_name' | 'last_initial' | 'city' | 'avatar_color' | 'share_contact_with_pod'> & { email?: string };
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
}

export type GoalStatus = 'not_yet' | 'partly' | 'done';

export interface Goal {
  id: string;
  user_id: string;
  week_start: string; // YYYY-MM-DD
  text: string;
  status: GoalStatus;
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
