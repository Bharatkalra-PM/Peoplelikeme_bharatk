import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Goal,
  GuideCandidate,
  GuideRequest,
  MoveProfile,
  Pod,
  PodMember,
  PodPost,
  Profile,
  ReachOutPrompt,
  Report,
  Rhythm,
  Session,
  StoryAnswer,
} from '../types';
import { DEFAULT_DEMO_SWITCHER, SEED_GUIDES, SEED_POD_MEMBERS, SEED_POD_POSTS, SEED_PODS, SeedGuide } from '../data/seedData';
import { calculateMatchScore, formatMoveLine, rankGuides } from '../lib/matching';
import { generateJitsiUrl } from '../lib/calendar';

interface AppContextType {
  currentUser: Profile | null;
  currentMoveProfile: MoveProfile | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Auth & Role Switching
  login: (email: string, role: 'switcher' | 'guide' | 'admin', name?: string) => void;
  logout: () => void;
  switchUser: (type: 'switcher_priya' | 'new_switcher' | 'guide_arjun' | 'guide_dev' | 'guide_vikram' | 'admin') => void;
  // Onboarding
  storyAnswers: Record<string, StoryAnswer>;
  saveStoryAnswer: (promptKey: string, answer: string, mode: 'text' | 'voice') => void;
  backgroundInfo: { cvText: string; linkedInText: string; cvFileName: string };
  setBackgroundInfo: (info: { cvText: string; linkedInText: string; cvFileName: string }) => void;
  detailChips: { dependants: string; priority: string; availability: string[]; city: string; constraints: string[] };
  setDetailChips: React.Dispatch<React.SetStateAction<{ dependants: string; priority: string; availability: string[]; city: string; constraints: string[] }>>;
  draftedProfile: MoveProfile | null;
  setDraftedProfile: (profile: MoveProfile | null) => void;
  confirmMoveProfile: (profile: MoveProfile) => void;
  // Matching & Requests
  guideCandidates: { matches: GuideCandidate[]; isNoMatch: boolean; closestGuides: GuideCandidate[] };
  activeRequest: GuideRequest | null;
  rematchOffered: boolean;
  rematchReasonNote: string;
  sendGuideRequest: (guideId: string, note: string, matchReason: string) => void;
  acceptGuideRequest: (requestId: string) => void;
  declineGuideRequest: (requestId: string) => void;
  simulate48HourExpiry: () => void;
  // Pod & Rhythm
  currentRhythm: Rhythm | null;
  currentPod: Pod | null;
  podMembers: PodMember[];
  sessions: Session[];
  updateRhythmSchedule: (guideSlot: string, podCallSlot: string, podCheckinSlot: string) => void;
  // Goals
  goals: Goal[];
  updateGoalStatus: (goalId: string, status: 'not_yet' | 'partly' | 'done') => void;
  saveWeeklyGoals: (texts: string[]) => void;
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
  submitReport: (reportedUserId: string, reportedName: string, reason: string, details: string) => void;
  deleteAccount: () => void;
  exportDataJson: () => string;
  // Admin & Guide Management
  guidesList: SeedGuide[];
  pendingGuideApprovals: Profile[];
  approveGuide: (guideId: string) => void;
  reportsList: Report[];
  resolveReport: (reportId: string, action: 'dismiss' | 'pause_user') => void;
  // Landed & Wrap-up
  markLanded: (shareWinWithPod: boolean) => void;
  continueWithPod: () => void;
  startFreshMatch: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'plm_app_state_v1';

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

  // User & Profiles
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => DEFAULT_DEMO_SWITCHER.profile);
  const [currentMoveProfile, setCurrentMoveProfile] = useState<MoveProfile | null>(() => DEFAULT_DEMO_SWITCHER.move_profile);

  // Onboarding state
  const [storyAnswers, setStoryAnswers] = useState<Record<string, StoryAnswer>>({});
  const [backgroundInfo, setBackgroundInfo] = useState({
    cvText: '',
    linkedInText: '',
    cvFileName: '',
  });
  const [detailChips, setDetailChips] = useState({
    dependants: 'None',
    priority: 'Speed to role',
    availability: ['Weekday evenings', 'Weekend mornings'],
    city: 'Bengaluru',
    constraints: ['Self-taught tech knowledge'],
  });
  const [draftedProfile, setDraftedProfile] = useState<MoveProfile | null>(null);

  // Database collections
  const [guidesList, setGuidesList] = useState<SeedGuide[]>(() => SEED_GUIDES);
  const [podsList, setPodsList] = useState<Pod[]>(() => SEED_PODS);
  const [podMembersMap, setPodMembersMap] = useState<Record<string, PodMember[]>>(() => SEED_POD_MEMBERS);
  const [podPosts, setPodPosts] = useState<PodPost[]>(() => SEED_POD_POSTS);
  const [goals, setGoals] = useState<Goal[]>(() => DEFAULT_DEMO_SWITCHER.goals);
  const [guideRequests, setGuideRequests] = useState<GuideRequest[]>([]);
  const [rematchOffered, setRematchOffered] = useState(false);
  const [rematchReasonNote, setRematchReasonNote] = useState('');
  const [reachOutPrompts, setReachOutPrompts] = useState<ReachOutPrompt[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [reportModalUser, setReportModalUser] = useState<{ id: string; name: string } | null>(null);

  // Active Rhythm & Sessions
  const [currentRhythm, setCurrentRhythm] = useState<Rhythm | null>(() => ({
    id: 'rhythm-bharat-1',
    switcher_id: 'user-bharat-k',
    guide_id: 'guide-arjun-k',
    pod_id: 'pod-pm-forming',
    start_date: new Date().toISOString().split('T')[0],
    week: 1,
    status: 'active',
    guide_slot: 'Wednesdays 6:30 PM (6:00 PM – 8:00 PM)',
  }));

  const [sessions, setSessions] = useState<Session[]>(() => [
    {
      id: 'session-g-1',
      rhythm_id: 'rhythm-bharat-1',
      pod_id: null,
      kind: 'guide',
      // Starts in 45 minutes for realistic demo
      starts_at: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      duration_min: 30,
      video_url: generateJitsiUrl('guide', 'g-1'),
      agenda: 'Introductions, validating 3 target roles, setting rhythm',
      held: null,
      title: 'Guide conversation with Arjun K.',
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
      rhythm_id: 'rhythm-priya-1',
      pod_id: 'pod-pm-forming',
      kind: 'pod_checkin',
      starts_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      duration_min: 15,
      video_url: generateJitsiUrl('pod', 'p-2'),
      agenda: '15-minute pod check-in',
      held: null,
      title: 'Pod check-in',
    },
  ]);

  // Save story answer
  const saveStoryAnswer = (promptKey: string, answer: string, mode: 'text' | 'voice') => {
    if (!currentUser) return;
    const item: StoryAnswer = {
      id: `ans-${Date.now()}-${promptKey}`,
      user_id: currentUser.id,
      prompt_key: promptKey as any,
      answer,
      input_mode: mode,
      created_at: new Date().toISOString(),
    };
    setStoryAnswers((prev) => ({ ...prev, [promptKey]: item }));
  };

  // Confirm move profile
  const confirmMoveProfile = (profile: MoveProfile) => {
    const confirmed = { ...profile, confirmed_at: new Date().toISOString() };
    setCurrentMoveProfile(confirmed);
    setDraftedProfile(confirmed);
  };

  // Calculate guide candidates using Section 6.1 formula
  const guideCandidates = React.useMemo(() => {
    const profileToMatch = currentMoveProfile || draftedProfile;
    if (!profileToMatch) {
      return { matches: [], isNoMatch: false, closestGuides: [] };
    }
    return rankGuides(profileToMatch, currentUser?.city || 'Bengaluru', guidesList);
  }, [currentMoveProfile, draftedProfile, currentUser, guidesList]);

  // Active guide request
  const activeRequest = guideRequests.find(
    (r) => r.switcher_id === currentUser?.id && (r.status === 'pending' || r.status === 'accepted')
  ) || null;

  // Send guide request (with 48-hour respond_by)
  const sendGuideRequest = (guideId: string, note: string, matchReason: string) => {
    if (!currentUser) return;
    const now = new Date();
    const respondBy = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

    const newRequest: GuideRequest = {
      id: `req-${Date.now()}`,
      switcher_id: currentUser.id,
      guide_id: guideId,
      note,
      status: 'pending',
      sent_at: now.toISOString(),
      respond_by: respondBy,
      match_reason: matchReason,
    };

    setGuideRequests((prev) => [newRequest, ...prev]);
  };

  // Guide accepts request
  const acceptGuideRequest = (requestId: string) => {
    setGuideRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' as const } : r))
    );

    const req = guideRequests.find((r) => r.id === requestId);
    if (!req) return;

    // Increment guide's active switchers count
    setGuidesList((prev) =>
      prev.map((g) =>
        g.profile.id === req.guide_id
          ? { ...g, active_switchers_count: g.active_switchers_count + 1 }
          : g
      )
    );

    // Create or update rhythm
    const matchedGuide = guidesList.find((g) => g.profile.id === req.guide_id);
    const newRhythm: Rhythm = {
      id: `rhythm-${Date.now()}`,
      switcher_id: req.switcher_id,
      guide_id: req.guide_id,
      pod_id: 'pod-pm-forming',
      start_date: new Date().toISOString().split('T')[0],
      week: 1,
      status: 'active',
      guide_slot: 'Wednesdays 6:30 PM',
    };
    setCurrentRhythm(newRhythm);

    // Create initial weekly session with guide
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
      title: `Guide conversation with ${matchedGuide?.profile.first_name || 'Guide'} ${matchedGuide?.profile.last_initial || ''}`,
      with_name: `${matchedGuide?.profile.first_name || 'Guide'} ${matchedGuide?.profile.last_initial || ''}`,
    };
    setSessions((prev) => [guideSession, ...prev]);
  };

  // Guide declines request
  const declineGuideRequest = (requestId: string) => {
    setGuideRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'declined' as const } : r))
    );
    const req = guideRequests.find((r) => r.id === requestId);
    const guide = guidesList.find((g) => g.profile.id === req?.guide_id);
    setRematchOffered(true);
    setRematchReasonNote(`${guide?.profile.first_name || 'The guide'} couldn't take this on right now. Here's your next best match.`);
  };

  // 48-Hour Expiry Simulation
  const simulate48HourExpiry = () => {
    if (activeRequest) {
      setGuideRequests((prev) =>
        prev.map((r) => (r.id === activeRequest.id ? { ...r, status: 'expired' as const } : r))
      );
      const guide = guidesList.find((g) => g.profile.id === activeRequest.guide_id);
      setRematchOffered(true);
      setRematchReasonNote(`${guide?.profile.first_name || 'Arjun'} couldn't take this on right now. Here's your next best match.`);
    }
  };

  // Pod & Rhythm
  const currentPod = React.useMemo(() => {
    if (!currentRhythm?.pod_id) return podsList[0];
    return podsList.find((p) => p.id === currentRhythm.pod_id) || podsList[0];
  }, [currentRhythm, podsList]);

  const podMembers = React.useMemo(() => {
    if (!currentPod) return [];
    return podMembersMap[currentPod.id] || [];
  }, [currentPod, podMembersMap]);

  const updateRhythmSchedule = (guideSlot: string, podCallSlot: string, podCheckinSlot: string) => {
    if (currentRhythm) {
      setCurrentRhythm({ ...currentRhythm, guide_slot: guideSlot });
    }
    if (currentPod) {
      setPodsList((prev) =>
        prev.map((p) =>
          p.id === currentPod.id ? { ...p, call_slot: podCallSlot, checkin_slot: podCheckinSlot } : p
        )
      );
    }
  };

  // Goals
  const updateGoalStatus = (goalId: string, status: 'not_yet' | 'partly' | 'done') => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, status, updated_at: new Date().toISOString() } : g))
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
        text: text.trim(),
        status: 'not_yet',
        updated_at: new Date().toISOString(),
      }));
    setGoals(newGoals);
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
    const promptId = `prompt-${Date.now()}`;
    const newPrompt: ReachOutPrompt = {
      id: promptId,
      subject_user_id: currentUser?.id || 'switcher-priya-m',
      subject_name: currentUser?.first_name || 'Priya',
      subject_initial: currentUser?.last_initial || 'M.',
      audience: 'guide',
      reason: 'few_goals_two_weeks',
      created_at: new Date().toISOString(),
      resolved_at: null,
      move_line: formatMoveLine(
        currentMoveProfile?.from_role || 'B2B SaaS Sales',
        currentMoveProfile?.to_role || 'Product Manager'
      ),
    };
    setReachOutPrompts((prev) => [newPrompt, ...prev]);
  };

  const simulateWeekAdvance = () => {
    if (!currentRhythm) return;
    const nextWeek = Math.min(8, currentRhythm.week + 1);
    setCurrentRhythm({ ...currentRhythm, week: nextWeek });
  };

  const resolveReachOutPrompt = (promptId: string) => {
    setReachOutPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, resolved_at: new Date().toISOString() } : p))
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

  const submitReport = (reportedUserId: string, reportedName: string, reason: string, details: string) => {
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
    setGoals([]);
    setStoryAnswers({});
  };

  const exportDataJson = () => {
    const exportObject = {
      profile: currentUser,
      move_profile: currentMoveProfile,
      story_answers: storyAnswers,
      goals,
      sessions: sessions.filter((s) => s.rhythm_id === currentRhythm?.id),
      posts: podPosts.filter((p) => p.author_id === currentUser?.id),
      exported_at: new Date().toISOString(),
      format: 'People Like Me User Data Archive',
    };
    return JSON.stringify(exportObject, null, 2);
  };

  // Auth / Role switcher helpers
  const login = (email: string, role: 'switcher' | 'guide' | 'admin', name = 'Demo User') => {
    const names = name.split(' ');
    const first = names[0] || 'User';
    const lastInit = (names[1] ? names[1][0] : 'D') + '.';
    const user: Profile = {
      id: `user-${Date.now()}`,
      role,
      first_name: first,
      last_initial: lastInit,
      full_name: `${first} ${lastInit}`,
      email,
      city: 'London',
      avatar_color: '#102A2E',
      share_contact_with_guide: false,
      share_contact_with_pod: false,
      created_at: new Date().toISOString(),
      status: 'active',
      verified: role === 'guide',
    };
    setCurrentUser(user);
    if (role === 'switcher') {
      setCurrentMoveProfile(null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (type: 'switcher_priya' | 'new_switcher' | 'guide_arjun' | 'guide_dev' | 'guide_vikram' | 'admin') => {
    if (type === 'switcher_priya') {
      setCurrentUser(DEFAULT_DEMO_SWITCHER.profile);
      setCurrentMoveProfile(DEFAULT_DEMO_SWITCHER.move_profile);
      setCurrentRhythm({
        id: 'rhythm-bharat-1',
        switcher_id: 'user-bharat-k',
        guide_id: 'guide-vikram-s',
        pod_id: 'pod-pm-forming',
        start_date: new Date().toISOString().split('T')[0],
        week: 1,
        status: 'active',
        guide_slot: 'Wednesdays 6:30 PM',
      });
      setGoals(DEFAULT_DEMO_SWITCHER.goals);
    } else if (type === 'new_switcher') {
      const freshUser: Profile = {
        id: 'switcher-fresh',
        role: 'switcher',
        first_name: 'Alex',
        last_initial: 'N.',
        full_name: 'Alex N.',
        email: 'alex.n@example.com',
        city: 'Bengaluru',
        avatar_color: '#2D6B8F',
        share_contact_with_guide: false,
        share_contact_with_pod: false,
        created_at: new Date().toISOString(),
        status: 'active',
      };
      setCurrentUser(freshUser);
      setCurrentMoveProfile(null);
      setCurrentRhythm(null);
      setStoryAnswers({});
      setGoals([]);
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
      });
    }
  };

  // Admin Actions
  const pendingGuideApprovals = guidesList
    .filter((g) => g.profile.status === 'pending_approval' || !g.profile.verified)
    .map((g) => g.profile);

  const approveGuide = (guideId: string) => {
    setGuidesList((prev) =>
      prev.map((g) =>
        g.profile.id === guideId
          ? { ...g, profile: { ...g.profile, verified: true, status: 'active' } }
          : g
      )
    );
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'pause_user') => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r))
    );
    if (action === 'pause_user') {
      const rep = reportsList.find((r) => r.id === reportId);
      if (rep) {
        // Pause reported user
        setGuidesList((prev) =>
          prev.map((g) =>
            g.profile.id === rep.reported_user_id ? { ...g, profile: { ...g.profile, status: 'paused' } } : g
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
      addPodPost('I landed my new role! Thank you all for the support and check-ins over these weeks.', true);
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
    setCurrentUser(DEFAULT_DEMO_SWITCHER.profile);
    setCurrentMoveProfile(DEFAULT_DEMO_SWITCHER.move_profile);
    setGoals(DEFAULT_DEMO_SWITCHER.goals);
    setGuidesList(SEED_GUIDES);
    setPodsList(SEED_PODS);
    setPodPosts(SEED_POD_POSTS);
    setGuideRequests([]);
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
        login,
        logout,
        switchUser,
        storyAnswers,
        saveStoryAnswer,
        backgroundInfo,
        setBackgroundInfo,
        detailChips,
        setDetailChips,
        draftedProfile,
        setDraftedProfile,
        confirmMoveProfile,
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
        podMembers,
        sessions,
        updateRhythmSchedule,
        goals,
        updateGoalStatus,
        saveWeeklyGoals,
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
        guidesList,
        pendingGuideApprovals,
        approveGuide,
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
