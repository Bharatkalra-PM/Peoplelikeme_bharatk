import assert from 'node:assert/strict';
import {
  calculateMatchScore,
  rankGuides,
  calculateCurrentWeek,
  draftPersonalMilestones,
  isNewGuide,
} from '../../src/lib/matching';
import { SEED_GUIDES } from '../../src/data/seedData';
import { MoveProfile, Profile } from '../../src/types';

function runUnitTests() {
  console.log('Running People Like Me Unit Tests...');

  // 1. Test Matching Score Calculation
  const varunMove: MoveProfile = {
    user_id: 'switcher-varun',
    from_role: 'Regional Sales Manager',
    from_field: 'Consumer goods',
    industry: 'Consumer goods',
    from_company_type: 'Enterprise',
    to_role: 'Product Manager',
    years_experience: 6,
    dependants: 'Partner and one child',
    priority: 'Speed to role',
    availability: ['Weekday evenings', 'Saturday mornings'],
    constraints: ['No pay cut > 15%'],
    preferred_guide_gender: 'no_preference',
    city: 'Bengaluru',
  };

  const arjun = SEED_GUIDES.find((g) => g.profile.id === 'guide-arjun-k')!;
  const farah = SEED_GUIDES.find((g) => g.profile.id === 'guide-farah-a')!;

  const arjunScore = calculateMatchScore(
    varunMove,
    'Bengaluru',
    arjun.move_profile,
    arjun.profile.city,
    arjun.profile
  );
  const farahScore = calculateMatchScore(
    varunMove,
    'Bengaluru',
    farah.move_profile,
    farah.profile.city,
    farah.profile
  );

  assert.ok(
    arjunScore > farahScore,
    `Expected Sales->PM Career Guide Arjun (${arjunScore}) to score higher than Ops->Data Analyst Farah (${farahScore})`
  );
  console.log('✓ Test 1 passed: Matching score ranks same-move Career Guides higher');

  // 2. Test "At most one New guide" rule (< 3 ratings)
  const rankedForVarun = rankGuides(varunMove, 'Bengaluru', SEED_GUIDES, {
    demoMode: false,
  });

  assert.ok(
    rankedForVarun.length >= 3 && rankedForVarun.length <= 5,
    `Expected between 3 and 5 recommended Career Guides, got ${rankedForVarun.length}`
  );

  const newGuidesInSet = rankedForVarun.filter((g) => isNewGuide(g.profile));
  assert.ok(
    newGuidesInSet.length <= 1,
    `Expected at most 1 "New" Career Guide (< 3 ratings) in recommended set, got ${newGuidesInSet.length}`
  );
  console.log('✓ Test 2 passed: At most one "New" Career Guide (<3 ratings) per recommended set');

  // 3. Test Sample Separation in rankGuides
  const realSetHasSample = rankedForVarun.some((g) => Boolean(g.profile.is_sample));
  assert.equal(realSetHasSample, false, 'Real mode must never include sample profiles');
  console.log('✓ Test 3 passed: Sample profiles are never mixed with real profiles');

  // 4. Test Week Rollover (automatic every 7 days from start_date, bounded 1..8)
  const nowMs = new Date('2026-10-26T12:00:00Z').getTime();
  assert.equal(calculateCurrentWeek('2026-10-26T00:00:00Z', nowMs), 1, 'Day 0 should be Week 1');
  assert.equal(calculateCurrentWeek('2026-10-20T00:00:00Z', nowMs), 1, 'Day 6 should still be Week 1');
  assert.equal(calculateCurrentWeek('2026-10-19T00:00:00Z', nowMs), 2, 'Day 7 should roll over to Week 2');
  assert.equal(calculateCurrentWeek('2026-09-28T00:00:00Z', nowMs), 5, 'Day 28 should be Week 5');
  assert.equal(calculateCurrentWeek('2026-07-01T00:00:00Z', nowMs), 8, 'After 8 weeks, caps at Week 8');
  console.log('✓ Test 4 passed: Week rollover increments every 7 days from start_date');

  // 5. Test Personal Milestones Drafting (skips CV milestone if CV already rewritten)
  const milestonesWithCVAlreadyDone = draftPersonalMilestones({
    ...varunMove,
    tried_so_far: 'I have already rewritten my CV and resume for product roles.',
  });
  const hasCvMilestone = milestonesWithCVAlreadyDone.some((m) =>
    m.title.toLowerCase().includes('rewrite cv')
  );
  assert.equal(
    hasCvMilestone,
    false,
    'Expected draftPersonalMilestones to skip the CV milestone when the user already rewrote their CV'
  );
  assert.ok(
    milestonesWithCVAlreadyDone.length >= 4 && milestonesWithCVAlreadyDone.length <= 6,
    `Expected 4 to 6 personal milestones, got ${milestonesWithCVAlreadyDone.length}`
  );
  console.log('✓ Test 5 passed: Personal milestones skip already-done CV step and stay within 4–6 milestones');

  console.log('All unit tests passed!');
}

runUnitTests();
