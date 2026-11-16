// Central Pilot Configuration, Feature Flag (PODS_ENABLED), Pilot Moves, Waitlist,
// Month 2 Price Test Assignment, Call Attendance, Ratings, and Go/No-Go Cohort Metrics.

export function isPodsEnabled(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const override = localStorage.getItem('plm_pods_enabled');
      if (override === 'true') return true;
      if (override === 'false') return false;
    }
    const envVal =
      (import.meta as any).env?.VITE_PODS_ENABLED ??
      (import.meta as any).env?.PODS_ENABLED;
    return envVal === 'true';
  } catch {
    return false;
  }
}

export interface PilotMove {
  id: string;
  label: string;
  fromKeywords: string[];
  toKeywords: string[];
  active: boolean;
}

export const DEFAULT_PILOT_MOVES: PilotMove[] = [
  {
    id: 'pilot-sales-product',
    label: 'Sales to Product',
    fromKeywords: [
      'sales',
      'account executive',
      'business development',
      'bdr',
      'sdr',
      'commercial',
      'client',
      'account manager',
      'retail',
    ],
    toKeywords: [
      'product',
      'pm',
      'associate pm',
      'apm',
      'product manager',
    ],
    active: true,
  },
  {
    id: 'pilot-dev-product',
    label: 'Developer to Product',
    fromKeywords: [
      'developer',
      'engineer',
      'software',
      'frontend',
      'backend',
      'full stack',
      'swe',
      'engineering',
      'qa',
      'architect',
    ],
    toKeywords: [
      'product',
      'pm',
      'technical product',
      'tpm',
      'product manager',
      'engineering management',
    ],
    active: true,
  },
  {
    id: 'pilot-ops-product',
    label: 'Operations to Product',
    fromKeywords: [
      'operations',
      'strategy',
      'ops',
      'customer success',
      'delivery',
      'project',
      'program',
      'consultant',
      'consulting',
      'marketing',
      'brand',
    ],
    toKeywords: [
      'product',
      'pm',
      'product manager',
      'product designer',
      'designer',
      'ux',
      'growth',
    ],
    active: true,
  },
  {
    id: 'pilot-ops-ba',
    label: 'Operations to Business Analyst',
    fromKeywords: [
      'operations',
      'ops',
      'finance',
      'sales',
      'marketing',
      'strategy',
      'support',
      'supply chain',
      'logistics',
      'analyst',
      'consulting',
    ],
    toKeywords: [
      'business analyst',
      'data analyst',
      'analyst',
      'analytics',
      'data',
      'bi',
      'strategy',
    ],
    active: true,
  },
];

const PILOT_MOVES_KEY = 'plm_pilot_moves_v1';
const WAITLIST_KEY = 'plm_pilot_waitlist_v1';
const MONTH2_OFFERS_KEY = 'plm_month2_offers_v1';
const PILOT_THRESHOLDS_KEY = 'plm_pilot_thresholds_v1';
const PILOT_COHORT_KEY = 'plm_pilot_cohort_v1';

export function loadPilotMoves(): PilotMove[] {
  try {
    const raw = localStorage.getItem(PILOT_MOVES_KEY);
    if (!raw) return DEFAULT_PILOT_MOVES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PILOT_MOVES;
  } catch {
    return DEFAULT_PILOT_MOVES;
  }
}

export function savePilotMoves(moves: PilotMove[]): void {
  try {
    localStorage.setItem(PILOT_MOVES_KEY, JSON.stringify(moves));
  } catch {
    // ignore storage errors
  }
}

export function matchesPilotMove(
  fromRole: string,
  toRole: string,
  pilotMoves: PilotMove[] = loadPilotMoves()
): { matched: boolean; matchedMove?: PilotMove } {
  const cleanFrom = (fromRole || '').toLowerCase().trim();
  const cleanTo = (toRole || '').toLowerCase().trim();

  if (!cleanFrom || !cleanTo) {
    return { matched: true, matchedMove: pilotMoves[0] };
  }

  for (const pm of pilotMoves) {
    if (!pm.active) continue;
    const labelParts = pm.label.toLowerCase().split(' to ');
    const labelFrom = labelParts[0]?.trim() || '';
    const labelTo = labelParts[1]?.trim() || '';

    const fromMatch =
      pm.fromKeywords.some((kw) => cleanFrom.includes(kw.toLowerCase())) ||
      (labelFrom && cleanFrom.includes(labelFrom));
    const toMatch =
      pm.toKeywords.some((kw) => cleanTo.includes(kw.toLowerCase())) ||
      (labelTo && cleanTo.includes(labelTo));

    if (fromMatch && toMatch) {
      return { matched: true, matchedMove: pm };
    }
  }

  return { matched: false };
}

export interface WaitlistEntry {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  city: string;
  from_role: string;
  to_role: string;
  created_at: string;
}

const DEFAULT_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl-seed-1',
    user_id: 'user-wl-1',
    full_name: 'Riya Sharma',
    email: 'riya.s@example.com',
    city: 'Mumbai',
    from_role: 'High School Teacher',
    to_role: 'Instructional Designer',
    created_at: '2025-03-07T10:15:00Z',
  },
  {
    id: 'wl-seed-2',
    user_id: 'user-wl-2',
    full_name: 'Karan Mehta',
    email: 'karan.m@example.com',
    city: 'Delhi NCR',
    from_role: 'Civil Site Engineer',
    to_role: 'Sustainability Consultant',
    created_at: '2025-03-08T14:20:00Z',
  },
];

export function loadWaitlist(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(WAITLIST_KEY);
    if (!raw) return DEFAULT_WAITLIST;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_WAITLIST;
  } catch {
    return DEFAULT_WAITLIST;
  }
}

export function addToWaitlist(entry: Omit<WaitlistEntry, 'id' | 'created_at'>): WaitlistEntry {
  const existing = loadWaitlist();
  const duplicate = existing.find(
    (e) =>
      e.email.toLowerCase() === entry.email.toLowerCase() &&
      e.from_role.toLowerCase() === entry.from_role.toLowerCase() &&
      e.to_role.toLowerCase() === entry.to_role.toLowerCase()
  );
  if (duplicate) return duplicate;

  const created: WaitlistEntry = {
    ...entry,
    id: `wl-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updated = [created, ...existing];
  try {
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return created;
}

export interface Month2OfferRecord {
  user_id: string;
  full_name: string;
  email: string;
  assigned_price_inr: 499 | 699;
  offer_seen_at: string;
  primary_response?: 'yes' | 'not_now';
  primary_responded_at?: string;
  fallback_199_response?: 'yes' | 'no';
  fallback_responded_at?: string;
  worth_it_feedback?: string;
  paid: boolean;
  paid_marked_at?: string;
}

const DEFAULT_MONTH2_OFFERS: Record<string, Month2OfferRecord> = {
  'changer-1': {
    user_id: 'changer-1',
    full_name: 'Anand T.',
    email: 'anand.t@example.com',
    assigned_price_inr: 499,
    offer_seen_at: '2025-03-05T11:00:00Z',
    primary_response: 'yes',
    primary_responded_at: '2025-03-05T11:02:00Z',
    paid: true,
    paid_marked_at: '2025-03-06T09:00:00Z',
  },
  'changer-2': {
    user_id: 'changer-2',
    full_name: 'Claire W.',
    email: 'claire.w@example.com',
    assigned_price_inr: 699,
    offer_seen_at: '2025-03-05T14:00:00Z',
    primary_response: 'yes',
    primary_responded_at: '2025-03-05T14:05:00Z',
    paid: true,
    paid_marked_at: '2025-03-06T12:00:00Z',
  },
  'changer-3': {
    user_id: 'changer-3',
    full_name: 'Rohit V.',
    email: 'rohit.v@example.com',
    assigned_price_inr: 499,
    offer_seen_at: '2025-03-06T10:00:00Z',
    primary_response: 'yes',
    primary_responded_at: '2025-03-06T10:03:00Z',
    paid: true,
    paid_marked_at: '2025-03-07T08:30:00Z',
  },
  'changer-4': {
    user_id: 'changer-4',
    full_name: 'Priya S.',
    email: 'priya.s@example.com',
    assigned_price_inr: 699,
    offer_seen_at: '2025-03-06T16:00:00Z',
    primary_response: 'not_now',
    primary_responded_at: '2025-03-06T16:01:00Z',
    fallback_199_response: 'yes',
    fallback_responded_at: '2025-03-06T16:02:00Z',
    worth_it_feedback: 'Two mock interviews in month 2 would make it an instant yes.',
    paid: false,
  },
  'changer-5': {
    user_id: 'changer-5',
    full_name: 'Mira N.',
    email: 'mira.n@example.com',
    assigned_price_inr: 499,
    offer_seen_at: '2025-03-07T09:00:00Z',
    primary_response: 'not_now',
    primary_responded_at: '2025-03-07T09:04:00Z',
    fallback_199_response: 'no',
    fallback_responded_at: '2025-03-07T09:05:00Z',
    worth_it_feedback: 'Already in final rounds so pausing until I hear back.',
    paid: false,
  },
};

export function loadMonth2Offers(): Record<string, Month2OfferRecord> {
  try {
    const raw = localStorage.getItem(MONTH2_OFFERS_KEY);
    if (!raw) return DEFAULT_MONTH2_OFFERS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MONTH2_OFFERS, ...parsed };
  } catch {
    return DEFAULT_MONTH2_OFFERS;
  }
}

export function saveMonth2Offers(records: Record<string, Month2OfferRecord>): void {
  try {
    localStorage.setItem(MONTH2_OFFERS_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export function getOrAssignMonth2Offer(
  userId: string,
  fullName: string,
  email: string
): Month2OfferRecord {
  const all = loadMonth2Offers();
  if (all[userId]) {
    return all[userId];
  }
  const assignedPrice: 499 | 699 = Math.random() < 0.5 ? 499 : 699;
  const created: Month2OfferRecord = {
    user_id: userId,
    full_name: fullName || 'Career Changer',
    email: email || 'changer@example.com',
    assigned_price_inr: assignedPrice,
    offer_seen_at: new Date().toISOString(),
    paid: false,
  };
  all[userId] = created;
  saveMonth2Offers(all);
  return created;
}

export function recordMonth2PrimaryChoice(
  userId: string,
  fullName: string,
  email: string,
  choice: 'yes' | 'not_now'
): Month2OfferRecord {
  const all = loadMonth2Offers();
  const current = all[userId] || getOrAssignMonth2Offer(userId, fullName, email);
  const updated: Month2OfferRecord = {
    ...current,
    primary_response: choice,
    primary_responded_at: new Date().toISOString(),
  };
  all[userId] = updated;
  saveMonth2Offers(all);
  return updated;
}

export function recordMonth2Fallback199(
  userId: string,
  choice: 'yes' | 'no',
  worthItFeedback?: string
): Month2OfferRecord | null {
  const all = loadMonth2Offers();
  const current = all[userId];
  if (!current) return null;
  const updated: Month2OfferRecord = {
    ...current,
    fallback_199_response: choice,
    fallback_responded_at: new Date().toISOString(),
    worth_it_feedback: worthItFeedback?.trim() || current.worth_it_feedback,
  };
  all[userId] = updated;
  saveMonth2Offers(all);
  return updated;
}

export function toggleMonth2PaidByAdmin(userId: string): Record<string, Month2OfferRecord> {
  const all = loadMonth2Offers();
  if (all[userId]) {
    const nextPaid = !all[userId].paid;
    all[userId] = {
      ...all[userId],
      paid: nextPaid,
      paid_marked_at: nextPaid ? new Date().toISOString() : undefined,
    };
    saveMonth2Offers(all);
  }
  return all;
}

export interface PilotThresholds {
  callsAttendedThreshold: number;
  callsAttendedTotal: number;
  goalsMetThreshold: number;
  goalsMetTotal: number;
  highRatingThreshold: number;
  highRatingTotal: number;
  paidMonth2Threshold: number;
  paidMonth2Total: number;
  guidesAgainThreshold: number;
  guidesAgainTotal: number;
}

export const DEFAULT_PILOT_THRESHOLDS: PilotThresholds = {
  callsAttendedThreshold: 7,
  callsAttendedTotal: 10,
  goalsMetThreshold: 6,
  goalsMetTotal: 10,
  highRatingThreshold: 7,
  highRatingTotal: 10,
  paidMonth2Threshold: 3,
  paidMonth2Total: 10,
  guidesAgainThreshold: 4,
  guidesAgainTotal: 5,
};

export function loadPilotThresholds(): PilotThresholds {
  try {
    const raw = localStorage.getItem(PILOT_THRESHOLDS_KEY);
    if (!raw) return DEFAULT_PILOT_THRESHOLDS;
    return { ...DEFAULT_PILOT_THRESHOLDS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PILOT_THRESHOLDS;
  }
}

export function savePilotThresholds(t: PilotThresholds): void {
  try {
    localStorage.setItem(PILOT_THRESHOLDS_KEY, JSON.stringify(t));
  } catch {
    // ignore
  }
}

export interface PilotCohortParticipant {
  id: string;
  name: string;
  move: string;
  guideName: string;
  callsAttendedOf4: number;
  attendedWeek3Call: boolean;
  metHalfWeeklyGoals: boolean;
  overallGuideRating: number; // 1 to 5
  weeklyRatings: { week: number; score: number; comment?: string }[];
}

export interface PilotCohortGuide {
  id: string;
  name: string;
  finishedAllFourWeeks: boolean;
  wouldGuideAgain: boolean;
}

export interface PilotCohortData {
  changers: PilotCohortParticipant[];
  guides: PilotCohortGuide[];
}

export const DEFAULT_PILOT_COHORT: PilotCohortData = {
  changers: [
    {
      id: 'user-bharat-k',
      name: 'Bharat K.',
      move: 'Operations & Strategy → Product Manager',
      guideName: 'Arjun K.',
      callsAttendedOf4: 4,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 5,
      weeklyRatings: [{ week: 1, score: 5, comment: 'Clear positioning feedback on CV' }],
    },
    {
      id: 'changer-1',
      name: 'Anand T.',
      move: 'Enterprise Sales → Product Manager',
      guideName: 'Arjun K.',
      callsAttendedOf4: 4,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 5,
      weeklyRatings: [{ week: 1, score: 5 }],
    },
    {
      id: 'changer-2',
      name: 'Claire W.',
      move: 'B2B Account Executive → Product Manager',
      guideName: 'Sarah M.',
      callsAttendedOf4: 3,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 5,
      weeklyRatings: [{ week: 1, score: 5 }],
    },
    {
      id: 'changer-3',
      name: 'Rohit V.',
      move: 'Operations Lead → Product Manager',
      guideName: 'Vikram S.',
      callsAttendedOf4: 4,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 4,
      weeklyRatings: [{ week: 1, score: 4 }],
    },
    {
      id: 'changer-4',
      name: 'Priya S.',
      move: 'Customer Success → Product Manager',
      guideName: 'Vikram S.',
      callsAttendedOf4: 3,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 5,
      weeklyRatings: [{ week: 1, score: 5 }],
    },
    {
      id: 'changer-5',
      name: 'Mira N.',
      move: 'Strategy Consultant → Product Designer',
      guideName: 'Meera B.',
      callsAttendedOf4: 3,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 4,
      weeklyRatings: [{ week: 1, score: 4 }],
    },
    {
      id: 'changer-6',
      name: 'James P.',
      move: 'Operations Analyst → Business Analyst',
      guideName: 'Marcus T.',
      callsAttendedOf4: 3,
      attendedWeek3Call: true,
      metHalfWeeklyGoals: true,
      overallGuideRating: 4,
      weeklyRatings: [{ week: 1, score: 4 }],
    },
    {
      id: 'changer-7',
      name: 'Simran K.',
      move: 'Frontend Developer → Product Manager',
      guideName: 'Ananya R.',
      callsAttendedOf4: 3,
      attendedWeek3Call: false,
      metHalfWeeklyGoals: false,
      overallGuideRating: 5,
      weeklyRatings: [{ week: 1, score: 5 }],
    },
    {
      id: 'changer-8',
      name: 'David L.',
      move: 'Project Manager → Product Manager',
      guideName: 'Ananya R.',
      callsAttendedOf4: 2,
      attendedWeek3Call: false,
      metHalfWeeklyGoals: false,
      overallGuideRating: 3,
      weeklyRatings: [{ week: 1, score: 3 }],
    },
    {
      id: 'changer-9',
      name: 'Astha G.',
      move: 'Sales Manager → Product Manager',
      guideName: 'Sarah M.',
      callsAttendedOf4: 2,
      attendedWeek3Call: false,
      metHalfWeeklyGoals: false,
      overallGuideRating: 4,
      weeklyRatings: [{ week: 1, score: 4 }],
    },
  ],
  guides: [
    { id: 'guide-arjun-k', name: 'Arjun K.', finishedAllFourWeeks: true, wouldGuideAgain: true },
    { id: 'guide-vikram-s', name: 'Vikram S.', finishedAllFourWeeks: true, wouldGuideAgain: true },
    { id: 'guide-sarah-m', name: 'Sarah M.', finishedAllFourWeeks: true, wouldGuideAgain: true },
    { id: 'guide-ananya-r', name: 'Ananya R.', finishedAllFourWeeks: true, wouldGuideAgain: true },
    { id: 'guide-meera-b', name: 'Meera B.', finishedAllFourWeeks: true, wouldGuideAgain: false },
  ],
};

export function loadPilotCohort(): PilotCohortData {
  try {
    const raw = localStorage.getItem(PILOT_COHORT_KEY);
    if (!raw) return DEFAULT_PILOT_COHORT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PILOT_COHORT;
  }
}

export function savePilotCohort(data: PilotCohortData): void {
  try {
    localStorage.setItem(PILOT_COHORT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
