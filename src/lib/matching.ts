import { GuideCandidate, MoveProfile, Profile } from '../types';

/**
 * Standard move-line format from one single function across the entire app.
 * A guide who went back shows the return ("Retail sales → Associate PM → back to sales").
 */
export function formatMoveLine(
  fromRole: string,
  toRole: string,
  wentBack: boolean = false
): string {
  const cleanFrom = fromRole.trim();
  const cleanTo = toRole.trim();
  if (wentBack) {
    return `${cleanFrom} → ${cleanTo} → back to ${cleanFrom.toLowerCase()}`;
  }
  return `${cleanFrom} → ${cleanTo}`;
}

// Canonical role normalization to catch common abbreviations
export function normalizeRole(role: string): string {
  const lower = role.toLowerCase().trim();
  if (lower.includes('product manager') || lower === 'pm' || lower.includes('associate pm') || lower.includes('apm')) {
    return 'product manager';
  }
  if (lower.includes('software') || lower.includes('engineer') || lower === 'swe' || lower.includes('developer')) {
    return 'software engineer';
  }
  if (lower.includes('product design') || lower.includes('ux') || lower.includes('ui/ux') || lower === 'designer') {
    return 'product designer';
  }
  if (lower.includes('sales') || lower.includes('account executive') || lower.includes('bdr') || lower.includes('business development')) {
    return 'sales';
  }
  if (lower.includes('data') || lower.includes('analyst') || lower.includes('analytics')) {
    return 'data analyst';
  }
  if (lower.includes('consulting') || lower.includes('consultant')) {
    return 'consultant';
  }
  if (lower.includes('marketing') || lower.includes('growth')) {
    return 'growth marketer';
  }
  return lower;
}

/**
 * Matches switcher against guide candidates according to Section 6.1:
 * score = 0.35 * moveSimilarity
 *       + 0.25 * startingPoint
 *       + 0.20 * constraintsOverlap
 *       + 0.10 * sameCityOrRemote
 *       + 0.10 * availabilityOverlap
 */
export function calculateMatchScore(
  switcher: MoveProfile,
  guide: MoveProfile,
  switcherCity: string = '',
  guideCity: string = ''
): { score: number; diffNotes: string[]; defaultReason: string } {
  const normSwitcherFrom = normalizeRole(switcher.from_role);
  const normSwitcherTo = normalizeRole(switcher.to_role);
  const normGuideFrom = normalizeRole(guide.from_role);
  const normGuideTo = normalizeRole(guide.to_role);

  // 1. Move similarity (0.35)
  let moveSimilarity = 0;
  if (normSwitcherFrom === normGuideFrom && normSwitcherTo === normGuideTo) {
    moveSimilarity = 1.0;
  } else if (normSwitcherTo === normGuideTo) {
    moveSimilarity = 0.7;
  } else if (normSwitcherFrom === normGuideFrom) {
    moveSimilarity = 0.5;
  } else if (
    (normSwitcherTo.includes('product') && normGuideTo.includes('product')) ||
    (normSwitcherTo.includes('design') && normGuideTo.includes('design')) ||
    (normSwitcherTo.includes('engineer') && normGuideTo.includes('engineer'))
  ) {
    moveSimilarity = 0.6;
  } else {
    // Transferable career shift baseline
    moveSimilarity = 0.45;
  }

  // 2. Starting point (0.25)
  // 1 - min(|yearsA - yearsB|, 10)/10, +0.2 if company type matches (cap 1)
  const yearsDiff = Math.abs((switcher.years_experience || 0) - (guide.years_experience || 0));
  let startingPoint = 1 - Math.min(yearsDiff, 10) / 10;
  if (
    switcher.from_company_type &&
    guide.from_company_type &&
    switcher.from_company_type.toLowerCase() === guide.from_company_type.toLowerCase()
  ) {
    startingPoint = Math.min(1.0, startingPoint + 0.2);
  }

  // 3. Constraints overlap (0.20)
  // share of dependants, priority and constraints in common
  let totalConstraintsChecks = 0;
  let constraintsMatches = 0;

  if (switcher.dependants && guide.dependants) {
    totalConstraintsChecks += 1;
    if (switcher.dependants.toLowerCase() === guide.dependants.toLowerCase()) {
      constraintsMatches += 1;
    }
  }

  if (switcher.priority && guide.priority) {
    totalConstraintsChecks += 1;
    if (switcher.priority.toLowerCase() === guide.priority.toLowerCase()) {
      constraintsMatches += 1;
    }
  }

  if (switcher.constraints?.length || guide.constraints?.length) {
    totalConstraintsChecks += 1;
    const sSet = new Set((switcher.constraints || []).map((c) => c.toLowerCase()));
    const gSet = new Set((guide.constraints || []).map((c) => c.toLowerCase()));
    const common = [...sSet].filter((x) => gSet.has(x));
    if (common.length > 0) {
      constraintsMatches += 1;
    }
  }

  const constraintsOverlap = totalConstraintsChecks > 0 ? constraintsMatches / totalConstraintsChecks : 0.5;

  // 4. Same city or remote (0.10)
  const isCityMatch =
    switcherCity.toLowerCase() === guideCity.toLowerCase() ||
    switcherCity.toLowerCase().includes('remote') ||
    guideCity.toLowerCase().includes('remote');
  const sameCityOrRemote = isCityMatch ? 1.0 : 0.2;

  // 5. Availability overlap (0.10)
  const sAvail = new Set((switcher.availability || []).map((a) => a.toLowerCase()));
  const gAvail = new Set((guide.availability || []).map((a) => a.toLowerCase()));
  const sharedAvail = [...sAvail].filter((a) => gAvail.has(a));
  const availabilityOverlap =
    sAvail.size === 0 || gAvail.size === 0 ? 0.5 : sharedAvail.length / Math.max(sAvail.size, 1);

  const rawScore =
    0.35 * moveSimilarity +
    0.25 * startingPoint +
    0.20 * constraintsOverlap +
    0.10 * sameCityOrRemote +
    0.10 * availabilityOverlap;

  const score = Math.round(rawScore * 100) / 100;

  // Build differences notes for no-match / comparison state
  const diffNotes: string[] = [];
  if (normSwitcherFrom !== normGuideFrom) {
    diffNotes.push(`Moved from ${guide.from_role} rather than ${switcher.from_role}`);
  }
  if (yearsDiff > 3) {
    diffNotes.push(`${guide.years_experience} years prior experience vs your ${switcher.years_experience}`);
  }
  if (switcher.dependants !== guide.dependants && guide.dependants) {
    diffNotes.push(`Different family setup (${guide.dependants})`);
  }
  if (switcherCity && guideCity && switcherCity.toLowerCase() !== guideCity.toLowerCase()) {
    diffNotes.push(`Based in ${guideCity} vs ${switcherCity}`);
  }

  // Plain 1-sentence under 20 words match reason using only shared profile facts
  let defaultReason = '';
  if (guide.went_back) {
    defaultReason = `Both moved from ${switcher.from_role} into ${guide.to_role}; later returned to ${guide.from_role}.`;
  } else if (normSwitcherFrom === normGuideFrom && normSwitcherTo === normGuideTo) {
    if (switcher.priority && switcher.priority === guide.priority) {
      defaultReason = `Both made this exact move with the same focus on ${guide.priority.toLowerCase()}.`;
    } else {
      defaultReason = `Both moved from ${switcher.from_role} into ${switcher.to_role} with similar background.`;
    }
  } else if (normSwitcherTo === normGuideTo) {
    defaultReason = `Both navigated the transition into ${switcher.to_role} with similar years of experience.`;
  } else {
    defaultReason = `Shared background in ${guide.from_role} and similar work constraints.`;
  }

  // Ensure under 20 words rule strictly
  const words = defaultReason.split(' ');
  if (words.length > 19) {
    defaultReason = words.slice(0, 19).join(' ') + '.';
  }

  return { score, diffNotes, defaultReason };
}

/**
 * Filter & rank guides according to Section 6.1:
 * - Candidates: guides with fewer than 2 active switchers, years_since_move between 1 and 5
 * - Show top three with score >= 0.45
 * - If any guide with went_back = true clears 0.45, include them
 * - If none clear 0.45, return no-match state with up to two closest guides and what differs
 */
export function rankGuides(
  switcher: MoveProfile,
  switcherCity: string,
  guidePool: { profile: Profile; move_profile: MoveProfile; active_switchers_count?: number }[]
): {
  matches: GuideCandidate[];
  isNoMatch: boolean;
  closestGuides: GuideCandidate[];
} {
  // Filter eligible guides: < 2 active switchers, years_since_move between 1 and 5
  const eligible = guidePool.filter((g) => {
    const switchers = g.active_switchers_count ?? 0;
    const yearsSince = g.move_profile.years_since_move ?? 2;
    return switchers < 2 && yearsSince >= 1 && yearsSince <= 5 && g.profile.status !== 'paused';
  });

  const scored: GuideCandidate[] = eligible.map((g) => {
    const { score, diffNotes, defaultReason } = calculateMatchScore(
      switcher,
      g.move_profile,
      switcherCity,
      g.profile.city
    );

    return {
      profile: g.profile,
      move_profile: g.move_profile,
      score,
      match_reason: defaultReason,
      move_line: formatMoveLine(g.move_profile.from_role, g.move_profile.to_role, g.move_profile.went_back),
      diffNotes,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take top candidates
  const qualified = scored.filter((s) => s.score >= 0.45);
  let topMatches = (qualified.length >= 3 ? qualified : scored).slice(0, 3);
  const wentBackGuide = scored.find((g: GuideCandidate) => g.move_profile.went_back);
  if (wentBackGuide && !topMatches.some((g: GuideCandidate) => g.profile.id === wentBackGuide.profile.id)) {
    if (topMatches.length >= 3) {
      topMatches = [topMatches[0], topMatches[1], wentBackGuide];
    } else {
      topMatches.push(wentBackGuide);
    }
  }

  return {
    matches: topMatches,
    isNoMatch: topMatches.length === 0,
    closestGuides: scored.slice(0, 2),
  };
}
