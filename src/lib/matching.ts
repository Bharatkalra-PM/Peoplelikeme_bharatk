import { GuideCandidate, Milestone, MoveProfile, Profile } from '../types';

/**
 * Standard move-line format from one single function across the entire app.
 * Supports "Sales, consumer goods → Product manager · 2 years ago"
 * and a guide who went back ("Retail sales → Associate PM → back to sales").
 */
export function formatMoveLine(
  fromRole: string,
  toRole: string,
  wentBack: boolean = false,
  fromField?: string,
  yearsSinceMove?: number | null
): string {
  const cleanFrom = fromRole.trim();
  const cleanTo = toRole.trim();
  const fieldPart =
    fromField &&
    fromField.trim() &&
    !cleanFrom.toLowerCase().includes(fromField.trim().toLowerCase())
      ? `${cleanFrom}, ${fromField.trim().toLowerCase()}`
      : cleanFrom;

  let base = `${fieldPart} → ${cleanTo}`;
  if (wentBack) {
    base = `${cleanFrom} → ${cleanTo} → back to ${cleanFrom.toLowerCase()}`;
  }
  if (yearsSinceMove && yearsSinceMove > 0) {
    return `${base} · ${yearsSinceMove} ${yearsSinceMove === 1 ? 'year' : 'years'} ago`;
  }
  return base;
}

/**
 * Returns true if a Career Guide has fewer than 3 ratings ("New" badge instead of stars).
 */
export function isNewGuide(profile: Pick<Profile, 'ratings_count'>): boolean {
  return (profile.ratings_count ?? 0) < 3;
}

/**
 * Calculates the current pilot week (1 to 4) rolling over automatically every 7 days from start_date.
 */
export function calculateCurrentWeek(startDateIso: string, nowMs: number = Date.now()): number {
  const parsed = new Date(startDateIso).getTime();
  if (Number.isNaN(parsed)) return 1;
  const diffMs = Math.max(0, nowMs - parsed);
  const weeksElapsed = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.min(4, Math.max(1, weeksElapsed + 1));
}

// Canonical role normalization to catch common abbreviations
export function normalizeRole(role: string): string {
  const lower = (role || '').toLowerCase().trim();
  if (
    lower.includes('product manager') ||
    lower === 'pm' ||
    lower.includes('associate pm') ||
    lower.includes('apm')
  ) {
    return 'product manager';
  }
  if (
    lower.includes('software') ||
    lower.includes('engineer') ||
    lower === 'swe' ||
    lower.includes('developer')
  ) {
    return 'software engineer';
  }
  if (
    lower.includes('product design') ||
    lower.includes('ux') ||
    lower.includes('ui/ux') ||
    lower === 'designer'
  ) {
    return 'product designer';
  }
  if (
    lower.includes('sales') ||
    lower.includes('account executive') ||
    lower.includes('bdr') ||
    lower.includes('business development')
  ) {
    return 'sales';
  }
  if (
    lower.includes('business analyst') ||
    lower.includes('data') ||
    lower.includes('analyst') ||
    lower.includes('analytics')
  ) {
    return 'data analyst';
  }
  if (lower.includes('consulting') || lower.includes('consultant')) {
    return 'consultant';
  }
  if (lower.includes('marketing') || lower.includes('growth')) {
    return 'growth marketer';
  }
  if (
    lower.includes('operations') ||
    lower.includes('strategy') ||
    lower.includes('ops') ||
    lower.includes('customer success')
  ) {
    return 'operations';
  }
  return lower;
}

/**
 * Matches career changer against Career Guide candidates on industry, role, experience,
 * starting point, city, availability, constraints and (only if the user chose it) gender.
 */
export function calculateMatchScore(
  changer: MoveProfile,
  guide: MoveProfile,
  changerCity: string = '',
  guideCity: string = '',
  guideGender?: 'Female' | 'Male' | 'Non-binary'
): { score: number; diffNotes: string[]; defaultReason: string } {
  const normChangerFrom = normalizeRole(changer.from_role);
  const normChangerTo = normalizeRole(changer.to_role);
  const normGuideFrom = normalizeRole(guide.from_role);
  const normGuideTo = normalizeRole(guide.to_role);

  // 1. Role & Industry Move similarity (0.35)
  let moveSimilarity = 0;
  if (normChangerFrom === normGuideFrom && normChangerTo === normGuideTo) {
    moveSimilarity = 1.0;
  } else if (normChangerTo === normGuideTo) {
    moveSimilarity = 0.72;
  } else if (normChangerFrom === normGuideFrom) {
    moveSimilarity = 0.55;
  } else if (
    (normChangerTo.includes('product') && normGuideTo.includes('product')) ||
    (normChangerTo.includes('design') && normGuideTo.includes('design')) ||
    (normChangerTo.includes('engineer') && normGuideTo.includes('engineer')) ||
    (normChangerTo.includes('analyst') && normGuideTo.includes('product'))
  ) {
    moveSimilarity = 0.6;
  } else {
    moveSimilarity = 0.25;
  }

  // Industry bonus if from_field matches
  if (
    changer.from_field &&
    guide.from_field &&
    changer.from_field.toLowerCase().trim() === guide.from_field.toLowerCase().trim()
  ) {
    moveSimilarity = Math.min(1.0, moveSimilarity + 0.15);
  }

  // 2. Starting point & experience (0.25)
  const yearsDiff = Math.abs((changer.years_experience || 0) - (guide.years_experience || 0));
  let startingPoint = 1 - Math.min(yearsDiff, 10) / 10;
  if (
    changer.from_company_type &&
    guide.from_company_type &&
    changer.from_company_type.toLowerCase() === guide.from_company_type.toLowerCase()
  ) {
    startingPoint = Math.min(1.0, startingPoint + 0.2);
  }

  // 3. Constraints & priority overlap (0.20)
  let totalConstraintsChecks = 0;
  let constraintsMatches = 0;

  if (changer.dependants && guide.dependants) {
    totalConstraintsChecks += 1;
    if (changer.dependants.toLowerCase() === guide.dependants.toLowerCase()) {
      constraintsMatches += 1;
    }
  }

  if (changer.priority && guide.priority) {
    totalConstraintsChecks += 1;
    const sPrio = changer.priority.toLowerCase().split('(')[0].trim();
    const gPrio = guide.priority.toLowerCase().split('(')[0].trim();
    if (
      sPrio === gPrio ||
      changer.priority.toLowerCase().includes(gPrio) ||
      guide.priority.toLowerCase().includes(sPrio)
    ) {
      constraintsMatches += 1;
    }
  }

  if (changer.constraints?.length || guide.constraints?.length) {
    totalConstraintsChecks += 1;
    const sSet = new Set((changer.constraints || []).map((c) => c.toLowerCase()));
    const gSet = new Set((guide.constraints || []).map((c) => c.toLowerCase()));
    const common = [...sSet].filter((x) => gSet.has(x));
    if (common.length > 0) {
      constraintsMatches += 1;
    }
  }

  const constraintsOverlap =
    totalConstraintsChecks > 0 ? constraintsMatches / totalConstraintsChecks : 0.5;

  // 4. Same city or remote (0.10)
  const isCityMatch =
    Boolean(changerCity && guideCity) &&
    (changerCity.toLowerCase() === guideCity.toLowerCase() ||
      changerCity.toLowerCase().includes('remote') ||
      guideCity.toLowerCase().includes('remote'));
  const sameCityOrRemote = isCityMatch ? 1.0 : 0.2;

  // 5. Availability overlap (0.10)
  const normalizeSlot = (s: string) => s.toLowerCase().split('(')[0].trim();
  const sAvail = new Set((changer.availability || []).map(normalizeSlot));
  const gAvail = new Set((guide.availability || []).map(normalizeSlot));
  const sharedAvail = [...sAvail].filter((a) => gAvail.has(a));
  const availabilityOverlap =
    sAvail.size === 0 || gAvail.size === 0 ? 0.5 : sharedAvail.length / Math.max(sAvail.size, 1);

  let rawScore =
    0.35 * moveSimilarity +
    0.25 * startingPoint +
    0.20 * constraintsOverlap +
    0.10 * sameCityOrRemote +
    0.10 * availabilityOverlap;

  // 6. Optional Gender preference (only if the user chose it)
  if (
    changer.preferred_guide_gender &&
    changer.preferred_guide_gender !== 'No preference' &&
    guideGender
  ) {
    if (changer.preferred_guide_gender === guideGender) {
      rawScore = Math.min(1.0, rawScore + 0.08);
    } else {
      rawScore = Math.max(0, rawScore - 0.15);
    }
  }

  const score = Math.round(rawScore * 100) / 100;

  // Build differences notes for comparison state
  const diffNotes: string[] = [];
  if (normChangerFrom !== normGuideFrom) {
    diffNotes.push(`Moved from ${guide.from_role} rather than ${changer.from_role}`);
  }
  if (yearsDiff > 3) {
    diffNotes.push(
      `${guide.years_experience} years prior experience vs your ${changer.years_experience}`
    );
  }
  if (changer.dependants !== guide.dependants && guide.dependants) {
    diffNotes.push(`Different family setup (${guide.dependants})`);
  }
  if (changerCity && guideCity && changerCity.toLowerCase() !== guideCity.toLowerCase()) {
    diffNotes.push(`Based in ${guideCity} vs ${changerCity}`);
  }

  // Plain 1-sentence under 20 words match reason using only shared profile facts
  let defaultReason = '';
  if (guide.went_back) {
    defaultReason = `Both moved from ${changer.from_role} into ${guide.to_role}; later returned to ${guide.from_role}.`;
  } else if (normChangerFrom === normGuideFrom && normChangerTo === normGuideTo) {
    const cleanPrio = (guide.priority || 'speed to role').split('(')[0].trim().toLowerCase();
    if (changer.priority && changer.priority.toLowerCase().includes(cleanPrio)) {
      defaultReason = `Both made this exact move with the same focus on ${cleanPrio}.`;
    } else {
      defaultReason = `Both moved from ${changer.from_role} into ${changer.to_role} with similar background.`;
    }
  } else if (normChangerTo === normGuideTo) {
    defaultReason = `Both navigated the transition into ${changer.to_role} with similar years of experience.`;
  } else {
    defaultReason = `Shared background in ${guide.from_role} and similar work constraints.`;
  }

  // Ensure strictly under 20 words
  const words = defaultReason.split(/\s+/);
  if (words.length > 19) {
    defaultReason = words.slice(0, 19).join(' ') + '.';
  }

  return { score, diffNotes, defaultReason };
}

/**
 * Filter & rank Career Guides:
 * - Only approved Career Guides (verified, active, < 2 active career changers, years_since_move 1-5)
 * - Show 3 to 5 approved Career Guides (never more than 5)
 * - At most one "New" guide (fewer than 3 ratings) per set
 */
export function rankGuides(
  changer: MoveProfile,
  changerCity: string,
  guidePool: { profile: Profile; move_profile: MoveProfile; active_switchers_count?: number }[],
  options?: {
    demoMode?: boolean;
    excludeGuideIds?: string[];
    maxResults?: number;
  }
): {
  matches: GuideCandidate[];
  isNoMatch: boolean;
  closestGuides: GuideCandidate[];
} {
  const maxResults = Math.min(5, Math.max(3, options?.maxResults ?? 5));
  const excludeSet = new Set(options?.excludeGuideIds || []);

  // Filter eligible approved Career Guides (strictly < 2 active career changers)
  const eligible = guidePool.filter((g) => {
    if (excludeSet.has(g.profile.id)) return false;
    const isApproved =
      g.profile.verified !== false &&
      g.profile.status === 'active' &&
      (!g.profile.application_status || g.profile.application_status === 'approved');
    if (!isApproved) return false;

    if (typeof options?.demoMode === 'boolean') {
      const isSample = Boolean(g.profile.is_sample);
      if (options.demoMode !== isSample) return false;
    }

    const activeChangersCount = g.active_switchers_count ?? 0;
    const yearsSince = g.move_profile.years_since_move ?? 2;
    return activeChangersCount < 2 && yearsSince >= 1 && yearsSince <= 5;
  });

  // Check if user has a strict gender filter that can be satisfied
  let poolToScore = eligible;
  if (
    changer.preferred_guide_gender &&
    changer.preferred_guide_gender !== 'No preference'
  ) {
    const genderFiltered = eligible.filter(
      (g) => g.profile.gender === changer.preferred_guide_gender
    );
    if (genderFiltered.length > 0) {
      poolToScore = genderFiltered;
    }
  }

  const scored: GuideCandidate[] = poolToScore.map((g) => {
    const { score, diffNotes, defaultReason } = calculateMatchScore(
      changer,
      g.move_profile,
      changerCity,
      g.profile.city,
      g.profile.gender
    );

    return {
      profile: g.profile,
      move_profile: g.move_profile,
      score,
      match_reason: defaultReason,
      move_line: formatMoveLine(
        g.move_profile.from_role,
        g.move_profile.to_role,
        g.move_profile.went_back,
        g.move_profile.from_field,
        g.move_profile.years_since_move
      ),
      diffNotes,
    };
  });

  // Sort descending by score, then by rating_avg
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.profile.rating_avg ?? 4.8) - (a.profile.rating_avg ?? 4.8);
  });

  const normTarget = normalizeRole(changer.to_role);
  const knownTargets = [
    'product manager',
    'software engineer',
    'product designer',
    'sales',
    'data analyst',
    'consultant',
    'growth marketer',
    'operations',
  ];
  const isKnownOrMatchedTarget =
    knownTargets.some((k) => normTarget.includes(k)) ||
    scored.some((c) => normalizeRole(c.move_profile.to_role) === normTarget);

  if (!isKnownOrMatchedTarget) {
    return {
      matches: [],
      isNoMatch: true,
      closestGuides: scored.slice(0, 2),
    };
  }

  const qualified = scored.filter((s) => s.score >= 0.45);
  if (qualified.length === 0) {
    return {
      matches: [],
      isNoMatch: true,
      closestGuides: scored.slice(0, 2),
    };
  }

  const selected: GuideCandidate[] = [];
  let newGuideIncluded = false;

  for (const candidate of qualified) {
    if (selected.length >= maxResults) break;
    const candidateIsNew = isNewGuide(candidate.profile);
    if (candidateIsNew) {
      if (newGuideIncluded) continue;
      newGuideIncluded = true;
    }
    selected.push(candidate);
  }

  return {
    matches: selected.slice(0, 5),
    isNoMatch: selected.length === 0,
    closestGuides: scored.slice(0, 2),
  };
}

/**
 * Drafts 3 to 5 personal milestones across the 4-week pilot from the user's profile,
 * skipping anything already done (e.g. if CV is already rewritten, skip CV milestone).
 */
export function draftPersonalMilestones(
  moveProfile: MoveProfile,
  options?: { triedSoFar?: string; cvText?: string }
): Milestone[] {
  const combinedHistory = [
    ...(moveProfile.already_done || []),
    options?.triedSoFar || '',
    moveProfile.story || '',
  ]
    .join(' ')
    .toLowerCase();

  const cvAlreadyRewritten =
    combinedHistory.includes('cv rewritten') ||
    combinedHistory.includes('rewrote cv') ||
    combinedHistory.includes('rewritten my cv') ||
    combinedHistory.includes('updated cv') ||
    combinedHistory.includes('rewrote resume') ||
    combinedHistory.includes('resume rewritten');

  const portfolioAlreadyBuilt =
    combinedHistory.includes('portfolio done') ||
    combinedHistory.includes('built portfolio');

  const targetRole = moveProfile.to_role || 'Product Manager';
  const fromRole = moveProfile.from_role || 'current role';

  const milestones: Milestone[] = [
    {
      id: 'ms-1',
      week: 1,
      title: `Validate target ${targetRole} roles & map transferable strengths from ${fromRole}`,
      description: 'Align with your Career Guide on target company stages and 4-week focus.',
      completed: false,
    },
  ];

  if (!cvAlreadyRewritten) {
    milestones.push({
      id: 'ms-2',
      week: 2,
      title: `Reframe CV & LinkedIn narrative for ${targetRole} hiring managers`,
      description: `Translate ${fromRole} achievements into ${targetRole} outcomes and metrics.`,
      completed: false,
    });
  } else {
    milestones.push({
      id: 'ms-2-alt',
      week: 2,
      title: `Shortlist 15 high-fit companies hiring ${targetRole}s with domain overlap`,
      description: 'Focus outreach on teams where your prior industry context is an unfair advantage.',
      completed: false,
    });
  }

  if (!portfolioAlreadyBuilt) {
    milestones.push({
      id: 'ms-3',
      week: 3,
      title: `Complete 1 practical ${targetRole} case study / teardown & warm outreach`,
      description: 'Build tangible proof-of-work to share in warm outreach and interviews.',
      completed: false,
    });
  } else {
    milestones.push({
      id: 'ms-3-alt',
      week: 3,
      title: 'Run 5 warm informational conversations & referral requests',
      description: 'Speak with hiring peers and alumni who transitioned from similar backgrounds.',
      completed: false,
    });
  }

  milestones.push({
    id: 'ms-4',
    week: 4,
    title: `Mock interview & live ${targetRole} story drill with your Career Guide`,
    description: 'Practice behavioural storytelling, structured problem solving, and next-step readiness.',
    completed: false,
  });

  return milestones.slice(0, 5);
}
