import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CareerGuideApplication,
  ConversationRating,
  GenderOption,
  Goal,
  GuideCandidate,
  GuideRequest,
  Milestone,
  MoveProfile,
  ObjectiveType,
  Pod,
  PodMember,
  PodPost,
  Profile,
  ReachOutPrompt,
  Report,
  Rhythm,
  Session,
  SprintPlan,
  StoryAnswer,
} from '../types';
import {
  DEFAULT_DEMO_SWITCHER,
  DEMO_SAMPLE_GUIDES,
  DEMO_SAMPLE_PODS,
  SEED_GUIDE_APPLICATIONS,
  SEED_GUIDES,
  SEED_POD_MEMBERS,
  SEED_POD_POSTS,
  SEED_PODS,
  SeedGuide,
} from '../data/seedData';
import {
  calculateCurrentWeek,
  draftPersonalMilestones,
  formatMoveLine,
  rankGuides,
} from '../lib/matching';
import { generateJitsiUrl } from '../lib/calendar';

export interface DetailChipsState {
  from_role: string;
  from_field: string;
  to_role: string;
  years_experience: number;
  dependants: string;
  priority: string;
  availability: string[];
  city: string;
  constraints: string[];
  preferred_guide_gender: GenderOption;
}

interface AppContextType {
  currentUser: Profile | null;
  currentMoveProfile: MoveProfile | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  // Auth & Role Switching
  login: (
    email: string,
    role: 'switcher' | 'guide' | 'admin',
    name?: string,
    isNewUser?: boolean
  ) => { isReturning: boolean; targetRoute: string };
  logout: () => void;
  switchUser: (
    type:
      | 'switcher_priya'
      | 'new_switcher'
      | 'guide_arjun'
      | 'guide_dev'
      | 'guide_vikram'
      | 'admin'
  ) => void;
  setUserObjective: (objective: ObjectiveType) => void;
  // Onboarding
  storyAnswers: Record<string, StoryAnswer>;
  saveStoryAnswer: (promptKey: string, answer: string, mode: 'text' | 'voice') => void;
  backgroundInfo: {
    cvText: string;
    linkedInText: string;
    cvFileName: string;
    manualRole?: string;
    manualIndustry?: string;
    manualYears?: string;
    manualSummary?: string;
  };
  setBackgroundInfo: (info: {
    cvText: string;
    linkedInText: string;
    cvFileName: string;
    manualRole?: string;
    manualIndustry?: string;
    manualYears?: string;
    manualSummary?: string;
  }) => void;
  detailChips: DetailChipsState;
  setDetailChips: React.Dispatch<React.SetStateAction<DetailChipsState>>;
  draftedProfile: MoveProfile | null;
  setDraftedProfile: (profile: MoveProfile | null) => void;
  confirmMoveProfile: (profile: MoveProfile) => void;
  updateMatchingParameters: (
    updates: Partial<MoveProfile> & { city?: string }
  ) => void;
  // Matching & Requests
  guideCandidates: {
    matches: GuideCandidate[];
    isNoMatch: boolean;
    closestGuides: GuideCandidate[];
  };
  activeRequest: GuideRequest | null;
  rematchOffered: boolean;
  rematchReasonNote: string;
  sendGuideRequest: (guideId: string, note: string, matchReason: string, autoAccept?: boolean) => void;
  acceptGuideRequest: (requestId: string) => void;
  declineGuideRequest: (requestId: string) => void;
  simulate48HourExpiry: () => void;
  // Pod & Rhythm & Sprint Plan
  currentRhythm: Rhythm | null;
  currentPod: Pod | null;
  userPod: (Pod & { members: PodMember[]; target_size: number }) | null;
  podMembers: PodMember[];
  podReadyNotification: string | null;
  dismissPodNotification: () => void;
  simulatePodReady: () => void;
  sessions: Session[];
  updateRhythmSchedule: (
    guideSlot: string,
    podCallSlot: string,
    podCheckinSlot: string
  ) => void;
  sprintPlan: SprintPlan | null;
  addMilestone: (weekOrTitle: number | string, titleOrWeek?: string | number, description?: string) => void;
  updateMilestone: (id: string, updates: Partial<Milestone> & { target_week?: number }) => void;
  toggleMilestoneComplete: (id: string) => void;
  removeMilestone: (id: string) => void;
  reorderMilestone: (id: string, direction: 'up' | 'down') => void;
  finalisePlan: () => void;
  finaliseSprintPlan: () => void;
  suggestedGoals: { id: string; text: string }[];
  suggestWeeklyGoal: (goalText: string, week?: number) => void;
  acceptSuggestedGoal: (goalIdOrText: string, editedText?: string) => void;
  dismissSuggestedGoal: (goalIdOrText: string) => void;
  // Post-Conversation Rating
  conversationRatings: ConversationRating[];
  rateConversation: (
    sessionIdOrGuideId: string,
    helpfulScoreOrWeek: number,
    moveMatchScoreOrHelpful: number,
    maybeMoveMatchScore?: number
  ) => void;
  // Guide Direct Messages
  guideMessages: { id: string; sender: 'switcher' | 'guide'; senderName: string; text: string; createdAt: string }[];
  sendGuideMessage: (text: string) => void;
  // Demo Toast Banner
  demoToast: { title: string; message: string; linkTo?: string; linkLabel?: string } | null;
  setDemoToast: (toast: { title: string; message: string; linkTo?: string; linkLabel?: string } | null) => void;
  // Goals
  goals: Goal[];
  updateGoalStatus: (goalId: string, status: 'not_yet' | 'partly' | 'done') => void;
  saveWeeklyGoals: (texts: string[]) => void;
  replaceGoal: (goalId: string, newText: string) => void;
  // Pod Posts
  podPosts: PodPost[];
  addPodPost: (body: string, isWin: boolean) => void;
  toggleCheer: (postId: string) => void;
  // Reach out prompts & Slip
  reachOutPrompts: ReachOutPrompt[];
  resolveReachOutPrompt: (promptId: string) => void;
  sendPersonalReachOut: (promptId: string, message: string) => void;
  simulateSlip: () => void;
  simulateWeekAdvance: () => void;
  // Settings & Safety
  updateContactSettings: (shareGuide: boolean, sharePod: boolean) => void;
  reportModalUser: { id: string; name: string } | null;
  setReportModalUser: (user: { id: string; name: string } | null) => void;
  submitReport: (
    reportedUserId: string,
    reportedName: string,
    reason: string,
    details: string
  ) => void;
  deleteAccount: () => void;
  exportDataJson: () => string;
  // Admin & Career Guide Applications
  guidesList: SeedGuide[];
  pendingGuideApprovals: Profile[];
  approveGuide: (guideId: string) => void;
  guideApplications: CareerGuideApplication[];
  submitGuideApplication: (
    appData: Omit<
      CareerGuideApplication,
      'id' | 'created_at' | 'status' | 'checks'
    >
  ) => CareerGuideApplication;
  approveGuideApplication: (appId: string) => void;
  rejectGuideApplication: (appId: string, note?: string) => void;
  askMoreGuideApplication: (appId: string, note?: string) => void;
  reportsList: Report[];
  resolveReport: (reportId: string, action: 'dismiss' | 'pause_user') => void;
  // Landed & Wrap-up
  markLanded: (shareWinWithPod: boolean) => void;
  continueWithPod: () => void;
  startFreshMatch: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'plm_app_state_v4';

function loadSavedState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed[key] !== undefined ? parsed[key] : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('plm_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('plm_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // DEMO_MODE (default false unless VITE_DEMO_MODE === 'true')
  const [demoMode, setDemoModeState] = useState<boolean>(() =>
    loadSavedState('demoMode', import.meta.env.VITE_DEMO_MODE === 'true')
  );

  // User & Profiles
  const [currentUser, setCurrentUser] = useState<Profile | null>(() =>
    loadSavedState('currentUser', DEFAULT_DEMO_SWITCHER.profile)
  );
  const [currentMoveProfile, setCurrentMoveProfile] = useState<MoveProfile | null>(() =>
    loadSavedState('currentMoveProfile', DEFAULT_DEMO_SWITCHER.move_profile)
  );

  // Onboarding state (persisted across refreshes)
  const [storyAnswers, setStoryAnswers] = useState<Record<string, StoryAnswer>>(() =>
    loadSavedState('storyAnswers', {})
  );
  const [backgroundInfo, setBackgroundInfo] = useState(() =>
    loadSavedState('backgroundInfo', {
      cvText: '',
      linkedInText: '',
      cvFileName: '',
      manualRole: '',
      manualIndustry: '',
      manualYears: '',
      manualSummary: '',
    })
  );
  const [detailChips, setDetailChips] = useState<DetailChipsState>(() =>
    loadSavedState('detailChips', {
      from_role: 'B2B Sales Lead',
      from_field: 'Sales',
      to_role: 'Product Manager',
      years_experience: 5,
      dependants: 'None',
      priority: 'Speed to role',
      availability: [
        'Weekday evenings (6:00 PM â€“ 8:00 PM)',
        'Weekend mornings (9:00 AM â€“ 12:00 PM)',
      ],
      city: 'Bengaluru',
      constraints: ['Self-taught tech knowledge'],
      preferred_guide_gender: 'No preference',
    })
  );
  const [draftedProfile, setDraftedProfile] = useState<MoveProfile | null>(() =>
    loadSavedState('draftedProfile', null)
  );

  // Database collections
  const [guidesList, setGuidesList] = useState<SeedGuide[]>(() =>
    loadSavedState('guidesList', SEED_GUIDES)
  );
  const [podsList, setPodsList] = useState<Pod[]>(() =>
    loadSavedState('podsList', SEED_PODS)
  );
  const [podMembersMap, setPodMembersMap] = useState<Record<string, PodMember[]>>(() =>
    loadSavedState('podMembersMap', SEED_POD_MEMBERS)
  );
  const [podPosts, setPodPosts] = useState<PodPost[]>(() =>
    loadSavedState('podPosts', SEED_POD_POSTS)
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadSavedState('goals', DEFAULT_DEMO_SWITCHER.goals)
  );
  const [guideRequests, setGuideRequests] = useState<GuideRequest[]>(() =>
    loadSavedState('guideRequests', [])
  );
  const [declinedGuideIds, setDeclinedGuideIds] = useState<string[]>(() =>
    loadSavedState('declinedGuideIds', [])
  );
  const [rematchOffered, setRematchOffered] = useState<boolean>(() =>
    loadSavedState('rematchOffered', false)
  );
  const [rematchReasonNote, setRematchReasonNote] = useState<string>(() =>
    loadSavedState('rematchReasonNote', '')
  );
  const [reachOutPrompts, setReachOutPrompts] = useState<ReachOutPrompt[]>(() =>
    loadSavedState('reachOutPrompts', [])
  );
  const [reportsList, setReportsList] = useState<Report[]>(() =>
    loadSavedState('reportsList', [])
  );
  const [reportModalUser, setReportModalUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [podReadyNotification, setPodReadyNotification] = useState<string | null>(null);
  const [demoToast, setDemoToast] = useState<{
    title: string;
    message: string;
    linkTo?: string;
    linkLabel?: string;
  } | null>(null);

  const [guideMessages, setGuideMessages] = useState<
    { id: string; sender: 'switcher' | 'guide'; senderName: string; text: string; createdAt: string }[]
  >(() =>
    loadSavedState('guideMessages', [
      {
        id: 'gmsg-1',
        sender: 'guide',
        senderName: 'Arjun K.', sender_name: 'Arjun K.',
        text: 'Hi! Excited to be your Career Guide for this 8-week sprint. I have reviewed your story and drafted 5 milestones for us. Letâ€™s review them in our first 30-min call!',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ])
  );

  const sendGuideMessage = (text: string) => {
    if (!text.trim()) return;
    const switcherMsg = {
      id: `gmsg-${Date.now()}`,
      sender: 'switcher' as const,
      senderName: currentUser?.first_name || 'You', sender_name: currentUser?.first_name || 'You',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const matchedGuide =
      combinedGuidesList.find((g) => g.profile.id === currentRhythm?.guide_id) ||
      combinedGuidesList[0];
    const guideName = `${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`;
    const autoReply = {
      id: `gmsg-${Date.now() + 1}`,
      sender: 'guide' as const,
      senderName: guideName, sender_name: guideName,
      text: `Thanks for sharing that! I've noted it for our 1:1 session and updated your Week ${
        currentRhythm?.week || 1
      } focus areas.`,
      createdAt: new Date(Date.now() + 1000).toISOString(),
    };
    setGuideMessages((prev) => [...prev, switcherMsg, autoReply]);
  };

  // Career Guide Applications & Ratings
  const [guideApplications, setGuideApplications] = useState<CareerGuideApplication[]>(
    () => loadSavedState('guideApplications', SEED_GUIDE_APPLICATIONS)
  );
  const [conversationRatings, setConversationRatings] = useState<ConversationRating[]>(
    () => loadSavedState('conversationRatings', [])
  );

  // Active Rhythm & Sprint Plan
  const [currentRhythm, setCurrentRhythm] = useState<Rhythm | null>(() =>
    loadSavedState('currentRhythm', {
      id: 'rhythm-bharat-1',
      switcher_id: 'user-bharat-k',
      guide_id: 'guide-arjun-k',
      pod_id: 'pod-pm-forming',
      start_date: new Date().toISOString().split('T')[0],
      week: 1,
      status: 'active',
      guide_slot: 'Wednesdays 6:30 PM (6:00 PM â€“ 8:00 PM)',
    })
  );

  const [sprintPlan, setSprintPlan] = useState<SprintPlan | null>(() =>
    loadSavedState('sprintPlan', {
      id: 'plan-default-1',
      switcher_id: 'user-bharat-k',
      guide_id: 'guide-arjun-k',
      status: 'draft',
      milestones: draftPersonalMilestones(DEFAULT_DEMO_SWITCHER.move_profile),
      suggested_goals: {
        1: [
          'Confirm the first Career Guide conversation',
          'Set this weekâ€™s goals',
          'Introduce yourself to your pod',
        ],
      },
      updated_at: new Date().toISOString(),
    })
  );

  const [sessions, setSessions] = useState<Session[]>(() =>
    loadSavedState('sessions', [
      {
        id: 'session-g-1',
        rhythm_id: 'rhythm-bharat-1',
        pod_id: null,
        kind: 'guide',
        // Starts within 5 minutes so Join button is active by default for immediate testing
        starts_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        duration_min: 30,
        video_url: generateJitsiUrl('guide', 'g-1'),
        agenda: 'Introductions, validating target roles, finalising your 8-week plan',
        held: null,
        title: 'Career Guide conversation with Arjun K.',
        with_name: 'Arjun K.',
      },
      {
        id: 'session-p-1',
        rhythm_id: 'rhythm-bharat-1',
        pod_id: 'pod-pm-forming',
        kind: 'pod_call',
        starts_at: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        duration_min: 30,
        video_url: generateJitsiUrl('pod', 'p-1'),
        agenda: 'Pod call: Target company profiles and resume tear-downs',
        held: null,
        title: 'Pod call',
      },
      {
        id: 'session-p-2',
        rhythm_id: 'rhythm-bharat-1',
        pod_id: 'pod-pm-forming',
        kind: 'pod_checkin',
        starts_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        duration_min: 15,
        video_url: generateJitsiUrl('pod', 'p-2'),
        agenda: '15-minute pod check-in',
        held: null,
        title: 'Pod check-in',
      },
    ])
  );

  // Persist state to localStorage on every update so refresh never loses state
  useEffect(() => {
    try {
      const stateToSave = {
        demoMode,
        currentUser,
        currentMoveProfile,
        storyAnswers,
        backgroundInfo,
        detailChips,
        draftedProfile,
        guidesList,
        podsList,
        podMembersMap,
        podPosts,
        goals,
        guideRequests,
        declinedGuideIds,
        rematchOffered,
        rematchReasonNote,
        reachOutPrompts,
        reportsList,
        guideApplications,
        conversationRatings,
        currentRhythm,
        sprintPlan,
        sessions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not persist state:', e);
    }
  }, [
    demoMode,
    currentUser,
    currentMoveProfile,
    storyAnswers,
    backgroundInfo,
    detailChips,
    draftedProfile,
    guidesList,
    podsList,
    podMembersMap,
    podPosts,
    goals,
    guideRequests,
    declinedGuideIds,
    rematchOffered,
    rematchReasonNote,
    reachOutPrompts,
    reportsList,
    guideApplications,
    conversationRatings,
    currentRhythm,
    sprintPlan,
    sessions,
  ]);

  // Automatic week rollover check from start_date
  useEffect(() => {
    if (currentRhythm && currentRhythm.start_date) {
      const computedWeek = calculateCurrentWeek(currentRhythm.start_date);
      if (computedWeek > currentRhythm.week) {
        setCurrentRhythm((prev) => (prev ? { ...prev, week: computedWeek } : prev));
      }
    }
  }, [currentRhythm?.start_date]);

  // Automatic 48-hour expiry check on pending requests
  useEffect(() => {
    const pendingReq = guideRequests.find(
      (r) => r.switcher_id === currentUser?.id && r.status === 'pending'
    );
    if (pendingReq) {
      const respondByMs = new Date(pendingReq.respond_by).getTime();
      if (Date.now() > respondByMs) {
        simulate48HourExpiry();
      }
    }
  }, [guideRequests, currentUser?.id]);

  const setDemoMode = (enabled: boolean) => {
    setDemoModeState(enabled);
  };

  // Pool of guides active based on DEMO_MODE (never mix sample people with real ones)
  const activeGuidesPool = React.useMemo(() => {
    if (demoMode) {
      return DEMO_SAMPLE_GUIDES;
    }
    return guidesList.filter((g) => !g.profile.is_sample);
  }, [demoMode, guidesList]);

  // Combined list of all real + sample guides so lookups by ID on /guides/:id NEVER fail
  const combinedGuidesList = React.useMemo(() => {
    const map = new Map<string, SeedGuide>();
    for (const g of guidesList) map.set(g.profile.id, g);
    for (const sg of DEMO_SAMPLE_GUIDES) map.set(sg.profile.id, sg);
    return Array.from(map.values());
  }, [guidesList]);

  const setUserObjective = (objective: ObjectiveType) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      objective,
      role: objective === 'become_guide' ? 'guide' : 'switcher',
    });
  };

  // Save story answer
  const saveStoryAnswer = (
    promptKey: string,
    answer: string,
    mode: 'text' | 'voice'
  ) => {
    const item: StoryAnswer = {
      id: `ans-${Date.now()}-${promptKey}`,
      user_id: currentUser?.id || 'anon',
      prompt_key: promptKey as any,
      answer,
      input_mode: mode,
      created_at: new Date().toISOString(),
    };
    setStoryAnswers((prev) => ({ ...prev, [promptKey]: item }));
  };

  // Confirm move profile (Step 3.4 -> Step 4 Dashboard before matching)
  const confirmMoveProfile = (profile: MoveProfile) => {
    const confirmed: MoveProfile = {
      ...profile,
      preferred_guide_gender:
        profile.preferred_guide_gender || detailChips.preferred_guide_gender || 'No preference',
      confirmed_at: new Date().toISOString(),
    };
    setCurrentMoveProfile(confirmed);
    setDraftedProfile(confirmed);
    if (currentUser) {
      recordUserDatabaseEvent(currentUser, 'Confirmed Move Profile', "${confirmed.from_role} -> ${confirmed.to_role} (${confirmed.years_experience} yrs exp)", false, confirmed);
      setCurrentUser({
        ...currentUser,
        city: detailChips.city || currentUser.city,
        onboarding_completed: true,
      });
    }
  };

  // Adjust what matters (Step 5: live parameter adjustment on Recommended Career Guides)
  const updateMatchingParameters = (
    updates: Partial<MoveProfile> & { city?: string }
  ) => {
    const base = currentMoveProfile ||
      draftedProfile || {
        user_id: currentUser?.id || 'switcher-varun',
        from_role: detailChips.from_role || 'Sales',
        from_field: detailChips.from_field || 'Sales',
        from_company_type: 'Tech company',
        to_role: detailChips.to_role || 'Product Manager',
        years_experience: detailChips.years_experience || 5,
        months_since_leaving: null,
        dependants: detailChips.dependants || 'None',
        priority: detailChips.priority || 'Speed to role',
        availability: detailChips.availability || ['Weekday evenings (6:00 PM â€“ 8:00 PM)'],
        constraints: detailChips.constraints || [],
        went_back: false,
        years_since_move: null,
        story: '',
        confirmed_at: new Date().toISOString(),
        preferred_guide_gender: detailChips.preferred_guide_gender || 'No preference',
      };

    const updatedProfile: MoveProfile = {
      ...base,
      ...updates,
    };
    setCurrentMoveProfile(updatedProfile);
    setDraftedProfile(updatedProfile);

    if (updates.city && currentUser) {
      setCurrentUser({ ...currentUser, city: updates.city });
      setDetailChips((prev) => ({ ...prev, city: updates.city! }));
    }
  };

  // Calculate Career Guide candidates (3 to 5 matches, at most one "New" guide)
  const guideCandidates = React.useMemo(() => {
    const profileToMatch = currentMoveProfile || draftedProfile;
    if (!profileToMatch) {
      return { matches: [], isNoMatch: false, closestGuides: [] };
    }
    return rankGuides(
      profileToMatch,
      currentUser?.city || detailChips.city || 'Bengaluru',
      activeGuidesPool,
      {
        demoMode,
        excludeGuideIds: declinedGuideIds,
        maxResults: 5,
      }
    );
  }, [
    currentMoveProfile,
    draftedProfile,
    currentUser?.city,
    detailChips.city,
    activeGuidesPool,
    demoMode,
    declinedGuideIds,
  ]);

  // Active Career Guide request
  const activeRequest =
    guideRequests.find(
      (r) =>
        r.switcher_id === currentUser?.id &&
        (r.status === 'pending' || r.status === 'accepted')
    ) || null;

  // Send guide request (with automatic demo acceptance)
  const sendGuideRequest = (guideId: string, note: string, matchReason: string, autoAccept: boolean = true) => {
    if (!currentUser) return;
    const now = new Date();
    const respondBy = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

    const newRequest: GuideRequest = {
      id: `req-${Date.now()}`,
      switcher_id: currentUser.id,
      guide_id: guideId,
      note,
      status: autoAccept ? 'accepted' : 'pending',
      sent_at: now.toISOString(),
      respond_by: respondBy,
      match_reason: matchReason,
    };

    setGuideRequests((prev) => [newRequest, ...prev]);
    setRematchOffered(false);

    if (autoAccept) {
      const gMatch = combinedGuidesList.find((g) => g.profile.id === guideId) || guidesList[0];
      recordUserDatabaseEvent(currentUser, 'Connected with Career Guide', "${gMatch.profile.first_name} ${gMatch.profile.last_initial}", false, undefined, "${gMatch.profile.first_name} ${gMatch.profile.last_initial}");
      const matchedGuide = combinedGuidesList.find((g) => g.profile.id === guideId) || guidesList[0];

      setGuidesList((prev) =>
        prev.map((g) =>
          g.profile.id === guideId
            ? { ...g, active_switchers_count: g.active_switchers_count + 1 }
            : g
        )
      );

      const newRhythm: Rhythm = {
        id: `rhythm-${Date.now()}`,
        switcher_id: currentUser.id,
        guide_id: guideId,
        pod_id: 'pod-pm-forming',
        start_date: new Date().toISOString().split('T')[0],
        week: 1,
        status: 'active',
        guide_slot: 'Wednesdays 6:30 PM (6:00 PM – 8:00 PM)',
      };
      setCurrentRhythm(newRhythm);

      const moveProf =
        currentMoveProfile || draftedProfile || DEFAULT_DEMO_SWITCHER.move_profile;
      const triedText = storyAnswers?.tried_so_far?.answer || backgroundInfo.cvText || '';
      const milestones = draftPersonalMilestones(moveProf, { triedSoFar: triedText });
      const week1Goals = [
        'Confirm the first Career Guide conversation',
        'Set this week’s goals',
        'Introduce yourself to your pod',
      ];
      setSprintPlan({
        id: `plan-${Date.now()}`,
        switcher_id: currentUser.id,
        guide_id: guideId,
        status: 'draft',
        milestones,
        suggested_goals: {
          1: week1Goals,
          2: [
            `Audit top 10 target ${moveProf.to_role} job descriptions`,
            'Identify 3 transferable metric stories from your current role',
          ],
        },
        updated_at: new Date().toISOString(),
      });

      const guideSession: Session = {
        id: `sess-guide-${Date.now()}`,
        rhythm_id: newRhythm.id,
        pod_id: null,
        kind: 'guide',
        starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration_min: 30,
        video_url: generateJitsiUrl('guide', Date.now().toString()),
        agenda: 'Kickoff: Understand move timeline and first week priorities',
        held: null,
        title: `Guide conversation with ${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
        with_name: `${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
      };
      setSessions((prev) => [guideSession, ...prev]);
    }
  };

  // Guide accepts request
  const acceptGuideRequest = (requestId: string) => {
    let guideId = requestId;
    const req = guideRequests.find((r) => r.id === requestId) || activeRequest;
    if (req) {
      guideId = req.guide_id;
    }

    setGuideRequests((prev) =>
      prev.map((r) => (r.id === requestId || r.guide_id === guideId ? { ...r, status: 'accepted' as const } : r))
    );

    const matchedGuide = combinedGuidesList.find((g) => g.profile.id === guideId) || guidesList[0];

    setGuidesList((prev) =>
      prev.map((g) =>
        g.profile.id === matchedGuide.profile.id
          ? { ...g, active_switchers_count: g.active_switchers_count + 1 }
          : g
      )
    );

    const switcherId = currentUser?.id || 'user-bharat-k';

    const newRhythm: Rhythm = {
      id: `rhythm-${Date.now()}`,
      switcher_id: switcherId,
      guide_id: matchedGuide.profile.id,
      pod_id: 'pod-pm-forming',
      start_date: new Date().toISOString().split('T')[0],
      week: 1,
      status: 'active',
      guide_slot: 'Wednesdays 6:30 PM (6:00 PM – 8:00 PM)',
    };
    setCurrentRhythm(newRhythm);

    const guideSession: Session = {
      id: `sess-guide-${Date.now()}`,
      rhythm_id: newRhythm.id,
      pod_id: null,
      kind: 'guide',
      starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 30,
      video_url: generateJitsiUrl('guide', Date.now().toString()),
      agenda: 'Kickoff: Understand move timeline and first week priorities',
      held: null,
      title: `Guide conversation with ${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
      with_name: `${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
    };
    setSessions((prev) => [guideSession, ...prev]);
  };

  // Career Guide declines request -> automatically offer next best match
  const declineGuideRequest = (requestId: string) => {
    const req = guideRequests.find((r) => r.id === requestId) || activeRequest;
    const declinedGuideId = req?.guide_id;
    setGuideRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'declined' as const } : r))
    );
    if (declinedGuideId) {
      setDeclinedGuideIds((prev) =>
        prev.includes(declinedGuideId) ? prev : [...prev, declinedGuideId]
      );
    }
    const guide = activeGuidesPool.find((g) => g.profile.id === declinedGuideId);
    setRematchOffered(true);
    setRematchReasonNote(
      `${
        guide?.profile.first_name || 'Arjun'
      } couldn't take this on right now. We've offered your next best Career Guide match automatically.`
    );
  };

  // 48-Hour Expiry Simulation
  const simulate48HourExpiry = () => {
    setRematchOffered(true);
    setRematchReasonNote("Your previous guide request reached the 48-hour response limit. We've automatically refreshed your alternative guide matches so you can keep moving forward.");
    setGuideRequests((prev) =>
      prev.map((r) => ({ ...r, status: 'expired' as const }))
    );
  };

  // Pod & Rhythm
  const activePodsPool = demoMode ? DEMO_SAMPLE_PODS : podsList;
  const currentPod = React.useMemo(() => {
    if (!currentRhythm?.pod_id) return activePodsPool[0];
    return (
      activePodsPool.find((p) => p.id === currentRhythm.pod_id) || activePodsPool[0]
    );
  }, [currentRhythm, activePodsPool]);

  const podMembers = React.useMemo(() => {
    if (!currentPod) return [];
    const baseKey = currentPod.id.replace(/^sample-/, '');
    const members = podMembersMap[currentPod.id] || podMembersMap[baseKey] || [];
    if (demoMode) {
      return members.map((m) => ({
        ...m,
        profile: { ...m.profile, is_sample: true },
      }));
    }
    return members;
  }, [currentPod, podMembersMap, demoMode]);

  const dismissPodNotification = () => setPodReadyNotification(null);

  const userPod = React.useMemo(() => {
    if (!currentPod) return null;
    return {
      ...currentPod,
      members: podMembers,
      target_size: currentPod.max_members || 4,
    };
  }, [currentPod, podMembers]);

  const suggestedGoals = React.useMemo(() => {
    if (!sprintPlan) return [];
    const wk = currentRhythm?.week || 1;
    const list = sprintPlan.suggested_goals[wk] || sprintPlan.suggested_goals[1] || [];
    return list.map((text, idx) => ({ id: `sg-${wk}-${idx}`, text }));
  }, [sprintPlan, currentRhythm?.week]);

  const toggleMilestoneComplete = (id: string) => {
    if (!sprintPlan) return;
    setSprintPlan({
      ...sprintPlan,
      milestones: sprintPlan.milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
      updated_at: new Date().toISOString(),
    });
  };

  const simulatePodReady = () => {
    const podId = currentPod?.id || 'pod-pm-forming';
    const baseKey = podId.replace(/^sample-/, '');
    const additionalMembers: PodMember[] = [
      {
        pod_id: baseKey,
        user_id: 'user-claire',
        joined_at: new Date().toISOString(),
        profile: {
          id: 'user-claire',
          first_name: 'Claire',
          last_initial: 'W.',
          city: 'London',
          avatar_color: '#2D6B8F',
          share_contact_with_pod: true,
        },
        move_line: 'B2B Sales â†’ Product Manager',
      },
      {
        pod_id: baseKey,
        user_id: 'user-rohit',
        joined_at: new Date().toISOString(),
        profile: {
          id: 'user-rohit',
          first_name: 'Rohit',
          last_initial: 'V.',
          city: 'Bengaluru',
          avatar_color: '#8A5A00',
          share_contact_with_pod: false,
        },
        move_line: 'Account Management â†’ Product Manager',
      },
    ];

    setPodMembersMap((prev) => {
      const existing = prev[baseKey] || [];
      const merged = [
        ...existing,
        ...additionalMembers.filter(
          (am) => !existing.some((e) => e.user_id === am.user_id)
        ),
      ];
      return { ...prev, [baseKey]: merged };
    });

    setPodsList((prev) =>
      prev.map((p) =>
        p.id === baseKey ? { ...p, status: 'active', members_count: 4 } : p
      )
    );
    setPodReadyNotification(
      'Your pod is ready! 4 of 4 members have joined and your weekly pod sessions are now active.'
    );
  };

  const updateRhythmSchedule = (
    guideSlot: string,
    podCallSlot: string,
    podCheckinSlot: string
  ) => {
    if (currentRhythm) {
      setCurrentRhythm({ ...currentRhythm, guide_slot: guideSlot });
    }
    if (currentPod) {
      setPodsList((prev) =>
        prev.map((p) =>
          p.id === currentPod.id
            ? { ...p, call_slot: podCallSlot, checkin_slot: podCheckinSlot }
            : p
        )
      );
    }
  };

  // Sprint Plan & Milestones (Career Guide owns the plan)
  const addMilestone = (
    weekOrTitle: number | string,
    titleOrWeek?: string | number,
    description?: string
  ) => {
    if (!sprintPlan) return;
    const week =
      typeof weekOrTitle === 'number'
        ? weekOrTitle
        : typeof titleOrWeek === 'number'
        ? titleOrWeek
        : 4;
    const title =
      typeof weekOrTitle === 'string'
        ? weekOrTitle
        : typeof titleOrWeek === 'string'
        ? titleOrWeek
        : 'Milestone';
    const newMs: Milestone = {
      id: `ms-${Date.now()}`,
      week: Math.min(8, Math.max(1, week)),
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
    };
    setSprintPlan({
      ...sprintPlan,
      milestones: [...sprintPlan.milestones, newMs].sort((a, b) => a.week - b.week),
      updated_at: new Date().toISOString(),
    });
  };

  const updateMilestone = (
    id: string,
    updates: Partial<Milestone> & { target_week?: number }
  ) => {
    if (!sprintPlan) return;
    setSprintPlan({
      ...sprintPlan,
      milestones: sprintPlan.milestones.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updates,
              week: updates.week ?? updates.target_week ?? m.week,
            }
          : m
      ),
      updated_at: new Date().toISOString(),
    });
  };

  const removeMilestone = (id: string) => {
    if (!sprintPlan) return;
    setSprintPlan({
      ...sprintPlan,
      milestones: sprintPlan.milestones.filter((m) => m.id !== id),
      updated_at: new Date().toISOString(),
    });
  };

  const reorderMilestone = (id: string, direction: 'up' | 'down') => {
    if (!sprintPlan) return;
    const idx = sprintPlan.milestones.findIndex((m) => m.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sprintPlan.milestones.length) return;
    const copy = [...sprintPlan.milestones];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    setSprintPlan({
      ...sprintPlan,
      milestones: copy,
      updated_at: new Date().toISOString(),
    });
  };

  const finalisePlan = () => {
    if (!sprintPlan) return;
    setSprintPlan({
      ...sprintPlan,
      status: 'finalised',
      updated_at: new Date().toISOString(),
    });
  };

  const suggestWeeklyGoal = (goalText: string, week?: number) => {
    if (!sprintPlan || !goalText.trim()) return;
    const targetWeek = week || currentRhythm?.week || 1;
    const existing = sprintPlan.suggested_goals[targetWeek] || [];
    if (existing.includes(goalText.trim())) return;
    setSprintPlan({
      ...sprintPlan,
      suggested_goals: {
        ...sprintPlan.suggested_goals,
        [targetWeek]: [...existing, goalText.trim()],
      },
      updated_at: new Date().toISOString(),
    });
  };

  const acceptSuggestedGoal = (goalIdOrText: string, editedText?: string) => {
    const matchedObj = suggestedGoals.find((sg) => sg.id === goalIdOrText);
    const rawText = matchedObj ? matchedObj.text : goalIdOrText;
    const finalText = (editedText || rawText).trim();
    if (!finalText) return;
    const today = new Date().toISOString().split('T')[0];
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      user_id: currentUser?.id || 'user-varun',
      week_start: today,
      week_number: currentRhythm?.week || 1,
      text: finalText,
      status: 'not_yet',
      suggested_by_guide: true,
      updated_at: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    dismissSuggestedGoal(rawText);
  };

  const dismissSuggestedGoal = (goalIdOrText: string) => {
    if (!sprintPlan) return;
    const matchedObj = suggestedGoals.find((sg) => sg.id === goalIdOrText);
    const textToDismiss = matchedObj ? matchedObj.text : goalIdOrText;
    const targetWeek = currentRhythm?.week || 1;
    const existing = sprintPlan.suggested_goals[targetWeek] || sprintPlan.suggested_goals[1] || [];
    setSprintPlan({
      ...sprintPlan,
      suggested_goals: {
        ...sprintPlan.suggested_goals,
        [targetWeek]: existing.filter((g) => g !== textToDismiss),
        1: (sprintPlan.suggested_goals[1] || []).filter((g) => g !== textToDismiss),
      },
    });
  };

  // Post-Conversation Private Rating (updates guide rating & ranking)
  const rateConversation = (
    sessionIdOrGuideId: string,
    helpfulScoreOrWeek: number,
    moveMatchScoreOrHelpful: number,
    maybeMoveMatchScore?: number
  ) => {
    const guideId = currentRhythm?.guide_id || sessionIdOrGuideId || 'guide-arjun-k';
    const helpfulScore =
      maybeMoveMatchScore !== undefined ? moveMatchScoreOrHelpful : helpfulScoreOrWeek;
    const moveMatchScore =
      maybeMoveMatchScore !== undefined ? maybeMoveMatchScore : moveMatchScoreOrHelpful;
    const newRating: ConversationRating = {
      id: `rating-${Date.now()}`,
      session_id: sessionIdOrGuideId,
      switcher_id: currentUser?.id || 'user-varun',
      guide_id: guideId,
      helpful_score: helpfulScore,
      move_match_score: moveMatchScore,
      created_at: new Date().toISOString(),
    };
    setConversationRatings((prev) => [newRating, ...prev]);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionIdOrGuideId ? { ...s, held: true, rated: true } : s))
    );

    const avgSessionScore = (helpfulScore + moveMatchScore) / 2;
    setGuidesList((prev) =>
      prev.map((g) => {
        if (g.profile.id === guideId.replace(/^sample-/, '')) {
          const prevCount = g.profile.ratings_count ?? 0;
          const prevAvg = g.profile.rating_avg ?? 4.8;
          const nextCount = prevCount + 1;
          const nextAvg =
            Math.round(((prevAvg * prevCount + avgSessionScore) / nextCount) * 10) / 10;
          return {
            ...g,
            profile: {
              ...g.profile,
              ratings_count: nextCount,
              rating_avg: nextAvg,
            },
          };
        }
        return g;
      })
    );
  };

  // Goals
  const updateGoalStatus = (goalId: string, status: 'not_yet' | 'partly' | 'done') => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, status, updated_at: new Date().toISOString() } : g
      )
    );
  };

  const saveWeeklyGoals = (texts: string[]) => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const newGoals: Goal[] = texts
      .filter((t) => t.trim().length > 0)
      .slice(0, 3)
      .map((text, idx) => ({
        id: `goal-${Date.now()}-${idx}`,
        user_id: currentUser.id,
        week_start: today,
        week_number: currentRhythm?.week || 1,
        text: text.trim(),
        status: 'not_yet',
        updated_at: new Date().toISOString(),
      }));
    setGoals(newGoals);
  };

  const replaceGoal = (goalId: string, newText: string) => {
    if (!newText.trim()) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, text: newText.trim(), updated_at: new Date().toISOString() }
          : g
      )
    );
  };

  // Pod Posts
  const addPodPost = (body: string, isWin: boolean) => {
    if (!currentUser || !currentPod) return;
    const newPost: PodPost = {
      id: `post-${Date.now()}`,
      pod_id: currentPod.id,
      author_id: currentUser.id,
      author_name: currentUser.first_name,
      author_initial: currentUser.last_initial,
      body: body.trim(),
      is_win: isWin,
      created_at: new Date().toISOString(),
      cheers_count: 0,
      cheered_by_me: false,
    };
    setPodPosts((prev) => [newPost, ...prev]);
  };

  const toggleCheer = (postId: string) => {
    setPodPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const cheered = !p.cheered_by_me;
          return {
            ...p,
            cheered_by_me: cheered,
            cheers_count: cheered ? p.cheers_count + 1 : Math.max(0, p.cheers_count - 1),
          };
        }
        return p;
      })
    );
  };

  // Slip simulation & Reach-out prompts
  const simulateSlip = () => {
    const guidePromptId = 'prompt-demo-slip';
    const podPromptId = 'prompt-demo-pod-slip';
    const moveLineStr = formatMoveLine(
      currentMoveProfile?.from_role || 'B2B SaaS Sales',
      currentMoveProfile?.to_role || 'Product Manager'
    );
    const guidePrompt: ReachOutPrompt = {
      id: guidePromptId,
      subject_user_id: currentUser?.id || 'user-varun',
      subject_name: currentUser?.first_name || 'Varun',
      subject_initial: currentUser?.last_initial || 'S.',
      audience: 'guide',
      reason: 'few_goals_two_weeks',
      created_at: new Date().toISOString(),
      resolved_at: null,
      move_line: moveLineStr,
    };
    const podPrompt: ReachOutPrompt = {
      id: podPromptId,
      subject_user_id: 'user-rohan',
      subject_name: 'Rohan',
      subject_initial: 'D.',
      audience: 'pod',
      reason: 'no_update_7_days',
      created_at: new Date().toISOString(),
      resolved_at: null,
      move_line: moveLineStr,
    };
    setReachOutPrompts((prev) => [
      guidePrompt,
      podPrompt,
      ...prev.filter((p) => p.id !== guidePromptId && p.id !== podPromptId),
    ]);
    setDemoToast({
      title: 'Check-In Nudge ("Slip") Triggered',
      message:
        'When a switcher misses weekly goals or goes quiet for 7 days, their Career Guide and Pod get a gentle human check-in prompt (never an automated bot message).',
      linkTo: '/guide-home/reach-out/prompt-demo-slip',
      linkLabel: 'Open Career Guide Check-in Screen',
    });
  };

  const simulateWeekAdvance = () => {
    if (!currentRhythm) {
      const fallbackRhythm: Rhythm = {
        id: `rhythm-${Date.now()}`,
        switcher_id: currentUser?.id || 'user-bharat-k',
        guide_id: 'guide-arjun-k',
        pod_id: 'pod-pm-forming',
        start_date: new Date().toISOString().split('T')[0],
        week: 2,
        status: 'active',
        guide_slot: 'Wednesdays 6:30 PM',
      };
      setCurrentRhythm(fallbackRhythm);
      setDemoToast({
        title: 'Advanced Sprint to Week 2 of 8',
        message: 'Your 8-week sprint is now in Week 2 of 8.',
        linkTo: '/home',
        linkLabel: 'Go to Week 2 Dashboard',
      });
      return;
    }
    const nextWeek = Math.min(8, currentRhythm.week + 1);
    setCurrentRhythm({ ...currentRhythm, week: nextWeek });
    setDemoToast({
      title: `Advanced Sprint to Week ${nextWeek} of 8`,
      message:
        nextWeek === 8
          ? 'You have reached Week 8 of 8! You can now complete the 8-Week Wrap-up or mark your role as landed.'
          : `Your sprint timeline and weekly goals have rolled forward to Week ${nextWeek} of 8.`,
      linkTo: nextWeek === 8 ? '/wrap-up' : '/home',
      linkLabel: nextWeek === 8 ? 'Open 8-Week Wrap-Up' : `View Week ${nextWeek} Plan`,
    });
  };

  const resolveReachOutPrompt = (promptId: string) => {
    setReachOutPrompts((prev) =>
      prev.map((p) =>
        p.id === promptId ? { ...p, resolved_at: new Date().toISOString() } : p
      )
    );
  };

  const sendPersonalReachOut = (promptId: string, _message: string) => {
    resolveReachOutPrompt(promptId);
  };

  // Safety & Settings
  const updateContactSettings = (shareGuide: boolean, sharePod: boolean) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      share_contact_with_guide: shareGuide,
      share_contact_with_pod: sharePod,
    });
  };

  const submitReport = (
    reportedUserId: string,
    reportedName: string,
    reason: string,
    details: string
  ) => {
    if (!currentUser) return;
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporter_id: currentUser.id,
      reported_user_id: reportedUserId,
      reported_name: reportedName,
      reason,
      details,
      created_at: new Date().toISOString(),
      status: 'pending',
    };
    setReportsList((prev) => [newReport, ...prev]);
    setReportModalUser(null);
  };

  const deleteAccount = () => {
    setCurrentUser(null);
    setCurrentMoveProfile(null);
    setCurrentRhythm(null);
    setSprintPlan(null);
    setGoals([]);
    setStoryAnswers({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportDataJson = () => {
    const exportObject = {
      profile: currentUser,
      move_profile: currentMoveProfile,
      story_answers: storyAnswers,
      sprint_plan: sprintPlan,
      goals,
      sessions: sessions.filter((s) => s.rhythm_id === currentRhythm?.id),
      posts: podPosts.filter((p) => p.author_id === currentUser?.id),
      exported_at: new Date().toISOString(),
      format: 'People Like Me User Data Archive',
    };
    return JSON.stringify(exportObject, null, 2);
  };

  // Sync user record & activity log to both localStorage DB and Server DB (/api/db/sync)
  const recordUserDatabaseEvent = (
    userObj: Profile,
    action: string,
    details: string,
    incrementLogin = false,
    moveOverride?: MoveProfile | null,
    guideNameOverride?: string
  ) => {
    try {
      const cleanEmail = userObj.email.trim().toLowerCase();
      const now = new Date().toISOString();
      const moveProf = moveOverride !== undefined ? moveOverride : currentMoveProfile || draftedProfile;
      const matchedG =
        guideNameOverride ||
        (currentRhythm?.guide_id
          ? combinedGuidesList.find((g) => g.profile.id === currentRhythm.guide_id)?.profile
              .first_name +
            ' ' +
            (combinedGuidesList.find((g) => g.profile.id === currentRhythm.guide_id)?.profile
              .last_initial || '')
          : 'Not connected yet');

      const rawRecords = localStorage.getItem('plm_database_records_v1');
      const recordsMap: Record<string, any> = rawRecords ? JSON.parse(rawRecords) : {};
      const existing = recordsMap[cleanEmail];

      const actionEntry = { timestamp: now, action, details };
      const updatedRecord = {
        user_id: userObj.id,
        full_name: userObj.full_name || `${userObj.first_name} ${userObj.last_initial}`.trim(),
        email: cleanEmail,
        role: userObj.role,
        city: userObj.city || detailChips.city || 'Bengaluru',
        created_at: existing?.created_at || userObj.created_at || now,
        last_login_at: incrementLogin ? now : existing?.last_login_at || now,
        login_count: existing ? (existing.login_count || 1) + (incrementLogin ? 1 : 0) : 1,
        onboarding_completed: Boolean(userObj.onboarding_completed || moveProf),
        from_role: moveProf?.from_role || detailChips.from_role || existing?.from_role || '',
        to_role: moveProf?.to_role || detailChips.to_role || existing?.to_role || '',
        from_field: moveProf?.from_field || detailChips.from_field || existing?.from_field || '',
        years_experience:
          moveProf?.years_experience ?? detailChips.years_experience ?? existing?.years_experience ?? 3,
        priority: moveProf?.priority || detailChips.priority || existing?.priority || 'Speed to role',
        matched_guide:
          matchedG && matchedG !== 'Not connected yet'
            ? matchedG
            : existing?.matched_guide || 'Not connected yet',
        goals_count: goals.length || existing?.goals_count || 0,
        latest_action: `${action}${details ? ` — ${details}` : ''}`,
        actions_history: [actionEntry, ...(existing?.actions_history || []).slice(0, 49)],
      };

      recordsMap[cleanEmail] = updatedRecord;
      localStorage.setItem('plm_database_records_v1', JSON.stringify(recordsMap));

      const rawLogs = localStorage.getItem('plm_activity_logs_v1');
      const logsArr: any[] = rawLogs ? JSON.parse(rawLogs) : [];
      const newLog = {
        log_id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        user_id: updatedRecord.user_id,
        full_name: updatedRecord.full_name,
        email: cleanEmail,
        role: updatedRecord.role,
        action,
        details,
      };
      localStorage.setItem('plm_activity_logs_v1', JSON.stringify([newLog, ...logsArr.slice(0, 299)]));

      // Push to backend database asynchronously so all logins across devices are stored centrally
      fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedRecord,
          action,
          details,
          increment_login: incrementLogin,
        }),
      }).catch(() => {});
    } catch {
      // ignore errors
    }
  };

  // Persist per-user state in localStorage so any user who signs up or logs in has their own data stored
  useEffect(() => {
    if (!currentUser?.email) return;
    try {
      const cleanEmail = currentUser.email.trim().toLowerCase();
      const allUsersRaw = localStorage.getItem('plm_users_data_v1');
      const allUsers: Record<string, any> = allUsersRaw ? JSON.parse(allUsersRaw) : {};
      allUsers[cleanEmail] = {
        profile: currentUser,
        moveProfile: currentMoveProfile,
        storyAnswers,
        backgroundInfo,
        detailChips,
        draftedProfile,
        currentRhythm,
        sprintPlan,
        goals,
        guideRequests,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('plm_users_data_v1', JSON.stringify(allUsers));
    } catch {
      // ignore storage errors
    }
  }, [
    currentUser,
    currentMoveProfile,
    storyAnswers,
    backgroundInfo,
    detailChips,
    draftedProfile,
    currentRhythm,
    sprintPlan,
    goals,
    guideRequests,
  ]);

  // Auth / Login (stores and restores data per email so anyone can create an account or sign in)
  const login = (
    email: string,
    role: 'switcher' | 'guide' | 'admin',
    name = 'User',
    isNewUser?: boolean
  ): { isReturning: boolean; targetRoute: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const existingGuide = guidesList.find(
      (g) => g.profile.email.toLowerCase() === cleanEmail
    );
    const isReturningBharat =
      !isNewUser && cleanEmail === 'bharatk6325@gmail.com' && role === 'switcher';

    if (role === 'admin' || cleanEmail === 'admin@peoplelikeme.app' || cleanEmail === 'admin@1234' || cleanEmail === 'admin@peoplelikeme.in') {
      const adminUser: Profile = {
        id: 'admin-1',
        role: 'admin',
        first_name: 'Admin',
        last_initial: 'A.',
        full_name: 'Platform Admin',
        email: cleanEmail,
        city: 'London',
        avatar_color: '#102A2E',
        share_contact_with_guide: true,
        share_contact_with_pod: true,
        created_at: new Date().toISOString(),
        status: 'active',
        onboarding_completed: true,
      };
      setCurrentUser(adminUser);
      recordUserDatabaseEvent(adminUser, 'Admin Signed In', 'Accessed Admin & User Database Hub', true);
      return { isReturning: true, targetRoute: '/admin' };
    }

    if (!isNewUser && existingGuide) {
      setCurrentUser(existingGuide.profile);
      recordUserDatabaseEvent(existingGuide.profile, 'Career Guide Signed In', 'Opened Career Guide Dashboard', true);
      return { isReturning: true, targetRoute: '/guide-home' };
    }

    if (isReturningBharat) {
      setCurrentUser(DEFAULT_DEMO_SWITCHER.profile);
      setCurrentMoveProfile(DEFAULT_DEMO_SWITCHER.move_profile);
      setDetailChips({
        from_role: 'B2B Sales Lead',
        from_field: 'Sales',
        to_role: 'Product Manager',
        years_experience: 5,
        dependants: 'None',
        priority: 'Speed to role',
        availability: [
          'Weekday evenings (6:00 PM – 8:00 PM)',
          'Weekend mornings (9:00 AM – 12:00 PM)',
        ],
        city: 'Bengaluru',
        constraints: ['Self-taught tech knowledge'],
        preferred_guide_gender: 'No preference',
      });
      recordUserDatabaseEvent(DEFAULT_DEMO_SWITCHER.profile, 'User Signed In', 'Authenticated & opened Week 1 Sprint Dashboard', true, DEFAULT_DEMO_SWITCHER.move_profile, 'Arjun K.');
      return { isReturning: true, targetRoute: '/home' };
    }

    // Check if this user already has saved account data in localStorage (and isn't forcing a fresh reset)
    if (!isNewUser && cleanEmail !== 'varunk6325@gmail.com') {
      try {
        const allUsersRaw = localStorage.getItem('plm_users_data_v1');
        const allUsers: Record<string, any> = allUsersRaw ? JSON.parse(allUsersRaw) : {};
        const savedUser = allUsers[cleanEmail];
        if (savedUser && savedUser.profile) {
          setCurrentUser(savedUser.profile);
          setCurrentMoveProfile(savedUser.moveProfile || null);
          setStoryAnswers(savedUser.storyAnswers || {});
          setBackgroundInfo(
            savedUser.backgroundInfo || {
              cvText: '',
              linkedInText: '',
              cvFileName: '',
              manualRole: '',
              manualIndustry: '',
              manualYears: '',
              manualSummary: '',
            }
          );
          if (savedUser.detailChips) setDetailChips(savedUser.detailChips);
          setDraftedProfile(savedUser.draftedProfile || null);
          setCurrentRhythm(savedUser.currentRhythm || null);
          setSprintPlan(savedUser.sprintPlan || null);
          setGoals(savedUser.goals || []);
          setGuideRequests(savedUser.guideRequests || []);
          const completed = Boolean(
            savedUser.profile.onboarding_completed || savedUser.moveProfile
          );
          recordUserDatabaseEvent(savedUser.profile, 'Returning User Signed In', completed ? 'Restored saved move profile & dashboard' : 'Resumed onboarding flow', true, savedUser.moveProfile);
          return {
            isReturning: completed,
            targetRoute:
              savedUser.profile.role === 'guide'
                ? '/guide-home'
                : completed
                ? '/home'
                : '/onboarding/objective',
          };
        }
      } catch {
        // ignore storage errors
      }
    }

    // Brand new user journey -> clean slate with zero prefilled Bharat data
    const names = name.trim().split(/\s+/);
    const first = names[0] || 'User';
    const lastInit =
      names.length > 1 && names[1]
        ? names[1][0].toUpperCase() + '.'
        : '';

    const newUser: Profile = {
      id: `user-${Date.now()}`,
      role,
      first_name: first,
      last_initial: lastInit,
      full_name: lastInit ? `${first} ${lastInit}` : first,
      email: cleanEmail,
      city: 'Bengaluru',
      avatar_color: '#102A2E',
      share_contact_with_guide: false,
      share_contact_with_pod: false,
      created_at: new Date().toISOString(),
      status: 'active',
      verified: false,
      onboarding_completed: false,
    };

    const emptyChips: DetailChipsState = {
      from_role: '',
      from_field: '',
      to_role: '',
      years_experience: 3,
      dependants: 'None',
      priority: 'Speed to role',
      availability: ['Weekday evenings (6:00 PM – 8:00 PM)'],
      city: 'Bengaluru',
      constraints: [],
      preferred_guide_gender: 'No preference',
    };

    const emptyBg = {
      cvText: '',
      linkedInText: '',
      cvFileName: '',
      manualRole: '',
      manualIndustry: '',
      manualYears: '',
      manualSummary: '',
    };

    setCurrentUser(newUser);
    setCurrentMoveProfile(null);
    setDraftedProfile(null);
    setCurrentRhythm(null);
    setSprintPlan(null);
    setGuideRequests([]);
    setDeclinedGuideIds([]);
    setRematchOffered(false);
    setStoryAnswers({});
    setBackgroundInfo(emptyBg);
    setDetailChips(emptyChips);
    setGoals([]);
    recordUserDatabaseEvent(newUser, isNewUser ? 'Account Created' : 'User Signed In', "${newUser.full_name} (${cleanEmail}) joined as ${role}", true, null, 'Not connected yet');

    return {
      isReturning: false,
      targetRoute: role === 'guide' ? '/become-a-guide' : '/onboarding/objective',
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (
    type:
      | 'switcher_priya'
      | 'new_switcher'
      | 'guide_arjun'
      | 'guide_dev'
      | 'guide_vikram'
      | 'admin'
  ) => {
    if (type === 'switcher_priya') {
      setCurrentUser(DEFAULT_DEMO_SWITCHER.profile);
      setCurrentMoveProfile(DEFAULT_DEMO_SWITCHER.move_profile);
      setCurrentRhythm({
        id: 'rhythm-bharat-1',
        switcher_id: 'user-bharat-k',
        guide_id: 'guide-arjun-k',
        pod_id: 'pod-pm-forming',
        start_date: new Date().toISOString().split('T')[0],
        week: 1,
        status: 'active',
        guide_slot: 'Wednesdays 6:30 PM',
      });
      setGoals(DEFAULT_DEMO_SWITCHER.goals);
    } else if (type === 'new_switcher') {
      login('varunk6325@gmail.com', 'switcher', 'Varun K.', true);
    } else if (type === 'guide_vikram') {
      const vikram = guidesList.find((g) => g.profile.id === 'guide-vikram-s')?.profile;
      if (vikram) setCurrentUser(vikram);
    } else if (type === 'guide_arjun') {
      const arjun = guidesList.find((g) => g.profile.id === 'guide-arjun-k')?.profile;
      if (arjun) setCurrentUser(arjun);
    } else if (type === 'guide_dev') {
      const dev = guidesList.find((g) => g.profile.id === 'guide-dev-m')?.profile;
      if (dev) setCurrentUser(dev);
    } else if (type === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        role: 'admin',
        first_name: 'Admin',
        last_initial: 'A.',
        full_name: 'Platform Admin',
        email: 'admin@peoplelikeme.app',
        city: 'London',
        avatar_color: '#102A2E',
        share_contact_with_guide: true,
        share_contact_with_pod: true,
        created_at: new Date().toISOString(),
        status: 'active',
        onboarding_completed: true,
      });
    }
  };

  // Career Guide Applications & Admin Queue (Section 4)
  const submitGuideApplication = (
    appData: Omit<
      CareerGuideApplication,
      'id' | 'created_at' | 'status' | 'checks'
    >
  ): CareerGuideApplication => {
    const mismatchFlags: string[] = [];
    if (appData.years_in_earlier_role < 2) {
      mismatchFlags.push(
        `Earlier role (${appData.years_in_earlier_role}y) is less than required 2 years.`
      );
    }
    if (appData.years_in_current_role < 1) {
      mismatchFlags.push(
        `Current role (${appData.years_in_current_role}y) is less than required 1 year.`
      );
    }
    if (!appData.linkedin_connected) {
      mismatchFlags.push('LinkedIn profile not yet connected.');
    }
    if (!appData.work_email_verified) {
      mismatchFlags.push('Work email not yet verified.');
    }

    const moveFound =
      appData.years_in_earlier_role >= 2 && appData.years_in_current_role >= 1;

    const newApp: CareerGuideApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      checks: {
        linkedin_connected: appData.linkedin_connected,
        email_verified: appData.work_email_verified,
        move_found: moveFound,
        mismatch_flags: mismatchFlags,
      },
      status: 'under_review',
      created_at: new Date().toISOString(),
    };

    setGuideApplications((prev) => [newApp, ...prev]);

    const names = appData.full_name.trim().split(/\s+/);
    const first = names[0] || 'Guide';
    const lastInit = names[1] ? `${names[1][0].toUpperCase()}.` : 'G.';
    const guideProfile: Profile = {
      id: appData.user_id || `guide-${Date.now()}`,
      role: 'guide',
      first_name: first,
      last_initial: lastInit,
      full_name: `${first} ${lastInit}`,
      email: appData.email,
      city: appData.city || 'Bengaluru',
      gender: appData.gender || 'Female',
      avatar_color: '#102A2E',
      share_contact_with_guide: true,
      share_contact_with_pod: true,
      created_at: new Date().toISOString(),
      status: 'pending_approval',
      verified: false,
      application_status: 'under_review',
      linkedin_url: appData.linkedin_url,
      ratings_count: 0,
      guided_count: 0,
    };

    setCurrentUser(guideProfile);
    return newApp;
  };

  const approveGuideApplication = (appId: string) => {
    const app = guideApplications.find((a) => a.id === appId);
    setGuideApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'approved' } : a))
    );

    if (app) {
      const names = app.full_name.trim().split(/\s+/);
      const first = names[0] || 'Guide';
      const lastInit = names[1] ? `${names[1][0].toUpperCase()}.` : 'G.';

      const approvedSeedGuide: SeedGuide = {
        profile: {
          id: app.user_id,
          role: 'guide',
          first_name: first,
          last_initial: lastInit,
          full_name: `${first} ${lastInit}`,
          email: app.email,
          city: app.city || 'Bengaluru',
          gender: app.gender || 'Female',
          avatar_color: '#2F7D5B',
          share_contact_with_guide: true,
          share_contact_with_pod: true,
          created_at: app.created_at,
          verified: true,
          status: 'active',
          application_status: 'approved',
          linkedin_url: app.linkedin_url,
          rating_avg: 5.0,
          ratings_count: 0,
          guided_count: 0,
          is_sample: false,
        },
        move_profile: {
          user_id: app.user_id,
          from_role: app.from_role,
          from_field: app.from_field || 'Sales',
          from_company_type: 'Tech company',
          to_role: app.to_role,
          years_experience: app.years_in_earlier_role,
          months_since_leaving: null,
          dependants: 'None',
          priority: 'Speed to role',
          availability: [
            'Weekday evenings (6:00 PM â€“ 8:00 PM)',
            'Weekend mornings (9:00 AM â€“ 12:00 PM)',
          ],
          constraints: [],
          went_back: app.went_back,
          years_since_move: app.years_since_move || 2,
          story: app.story,
          confirmed_at: new Date().toISOString(),
        },
        active_switchers_count: 0,
      };

      setGuidesList((prev) => {
        const exists = prev.some((g) => g.profile.id === app.user_id);
        if (exists) {
          return prev.map((g) =>
            g.profile.id === app.user_id ? approvedSeedGuide : g
          );
        }
        return [approvedSeedGuide, ...prev];
      });

      if (currentUser?.id === app.user_id) {
        setCurrentUser({
          ...currentUser,
          verified: true,
          status: 'active',
          application_status: 'approved',
        });
      }
    }
  };

  const rejectGuideApplication = (appId: string, note?: string) => {
    const app = guideApplications.find((a) => a.id === appId);
    setGuideApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: 'rejected', admin_note: note } : a
      )
    );
    if (app && currentUser?.id === app.user_id) {
      setCurrentUser({
        ...currentUser,
        status: 'rejected',
        application_status: 'rejected',
      });
    }
  };

  const askMoreGuideApplication = (appId: string, note?: string) => {
    const app = guideApplications.find((a) => a.id === appId);
    setGuideApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'needs_more',
              admin_note:
                note ||
                'Please share a bit more detail on your transition timeline and CV work history.',
            }
          : a
      )
    );
    if (app && currentUser?.id === app.user_id) {
      setCurrentUser({
        ...currentUser,
        status: 'needs_more',
        application_status: 'needs_more',
      });
    }
  };

  // Legacy Admin Actions
  const pendingGuideApprovals = guidesList
    .filter((g) => g.profile.status === 'pending_approval' || !g.profile.verified)
    .map((g) => g.profile);

  const approveGuide = (guideId: string) => {
    setGuidesList((prev) =>
      prev.map((g) =>
        g.profile.id === guideId
          ? {
              ...g,
              profile: {
                ...g.profile,
                verified: true,
                status: 'active',
                application_status: 'approved',
              },
            }
          : g
      )
    );
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'pause_user') => {
    setReportsList((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' }
          : r
      )
    );
    if (action === 'pause_user') {
      const rep = reportsList.find((r) => r.id === reportId);
      if (rep) {
        setGuidesList((prev) =>
          prev.map((g) =>
            g.profile.id === rep.reported_user_id
              ? { ...g, profile: { ...g.profile, status: 'paused' } }
              : g
          )
        );
      }
    }
  };

  // Landed & Wrap-up
  const markLanded = (shareWinWithPod: boolean) => {
    if (currentRhythm) {
      setCurrentRhythm({ ...currentRhythm, status: 'landed' });
    }
    if (shareWinWithPod && currentPod && currentUser) {
      addPodPost(
        'I landed my new role! Thank you all for the support and check-ins over these weeks.',
        true
      );
    }
  };

  const continueWithPod = () => {
    if (currentRhythm) {
      setCurrentRhythm({ ...currentRhythm, status: 'completed' });
    }
  };

  const startFreshMatch = () => {
    setCurrentRhythm(null);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(DEFAULT_DEMO_SWITCHER.profile);
    setCurrentMoveProfile(DEFAULT_DEMO_SWITCHER.move_profile);
    setGoals(DEFAULT_DEMO_SWITCHER.goals);
    setGuidesList(SEED_GUIDES);
    setPodsList(SEED_PODS);
    setPodPosts(SEED_POD_POSTS);
    setGuideRequests([]);
    setDeclinedGuideIds([]);
    setGuideApplications(SEED_GUIDE_APPLICATIONS);
    setReachOutPrompts([]);
    setRematchOffered(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentMoveProfile,
        theme,
        toggleTheme,
        demoMode,
        setDemoMode,
        login,
        logout,
        switchUser,
        setUserObjective,
        storyAnswers,
        saveStoryAnswer,
        backgroundInfo,
        setBackgroundInfo,
        detailChips,
        setDetailChips,
        draftedProfile,
        setDraftedProfile,
        confirmMoveProfile,
        updateMatchingParameters,
        guideCandidates,
        activeRequest,
        rematchOffered,
        rematchReasonNote,
        sendGuideRequest,
        acceptGuideRequest,
        declineGuideRequest,
        simulate48HourExpiry,
        currentRhythm,
        currentPod,
        userPod,
        podMembers,
        podReadyNotification,
        dismissPodNotification,
        simulatePodReady,
        sessions,
        updateRhythmSchedule,
        sprintPlan,
        addMilestone,
        updateMilestone,
        toggleMilestoneComplete,
        removeMilestone,
        reorderMilestone,
        finalisePlan,
        finaliseSprintPlan: finalisePlan,
        suggestedGoals,
        suggestWeeklyGoal,
        acceptSuggestedGoal,
        dismissSuggestedGoal,
        conversationRatings,
        rateConversation,
        guideMessages,
        sendGuideMessage,
        demoToast,
        setDemoToast,
        goals,
        updateGoalStatus,
        saveWeeklyGoals,
        replaceGoal,
        podPosts,
        addPodPost,
        toggleCheer,
        reachOutPrompts,
        resolveReachOutPrompt,
        sendPersonalReachOut,
        simulateSlip,
        simulateWeekAdvance,
        updateContactSettings,
        reportModalUser,
        setReportModalUser,
        submitReport,
        deleteAccount,
        exportDataJson,
        guidesList: combinedGuidesList,
        pendingGuideApprovals,
        approveGuide,
        guideApplications,
        submitGuideApplication,
        approveGuideApplication,
        rejectGuideApplication,
        askMoreGuideApplication,
        reportsList,
        resolveReport,
        markLanded,
        continueWithPod,
        startFreshMatch,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

