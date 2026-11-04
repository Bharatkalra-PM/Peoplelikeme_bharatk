import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WhyThisMatchModal } from '../components/WhyThisMatchModal';
import {
  CheckCircle,
  Circle,
  Video,
  ArrowRight,
  Plus,
  Compass,
  Flag,
  Users,
  Clock,
  Info,
  X,
  Check,
  Calendar,
} from 'lucide-react';

const DEFAULT_EIGHT_WEEK_ROADMAP: {
  week: number;
  phase: string;
  defaultTitle: string;
  guideFocus: string;
}[] = [
  {
    week: 1,
    phase: 'Foundation',
    defaultTitle: 'Audit transferable skills & align 8-week plan with Career Guide',
    guideFocus: '1:1 Guide Focus: Agree on your 8-week milestones & positioning story',
  },
  {
    week: 2,
    phase: 'Positioning',
    defaultTitle: 'Rewrite CV, LinkedIn & transition narrative for target role',
    guideFocus: '1:1 Guide Focus: Line-by-line review of your transition narrative',
  },
  {
    week: 3,
    phase: 'Target Map',
    defaultTitle: 'Shortlist 25 target companies & warm outreach contacts',
    guideFocus: '1:1 Guide Focus: Prioritise high-fit teams & referral paths',
  },
  {
    week: 4,
    phase: 'Proof of Work',
    defaultTitle: 'Build 1 role-specific portfolio artifact / case study',
    guideFocus: '1:1 Guide Focus: Critique your case study or role artifact',
  },
  {
    week: 5,
    phase: 'Outreach',
    defaultTitle: 'Complete 5 informational chats & warm introductions',
    guideFocus: '1:1 Guide Focus: Refine outreach messages & conversation hooks',
  },
  {
    week: 6,
    phase: 'Mock Rounds',
    defaultTitle: 'Run mock interview & story drills with Career Guide and Pod',
    guideFocus: '1:1 Guide Focus: Live 30-min mock interview & feedback',
  },
  {
    week: 7,
    phase: 'Active Loop',
    defaultTitle: 'Submit targeted applications & track hiring manager follow-ups',
    guideFocus: '1:1 Guide Focus: Unblock interview pipeline & recruiter screens',
  },
  {
    week: 8,
    phase: 'Close & Land',
    defaultTitle: 'Final-round prep, offer evaluation & next-step wrap-up',
    guideFocus: '1:1 Guide Focus: Final round strategy, negotiation & 90-day plan',
  },
];

export const Home: React.FC = () => {
  const {
    currentUser,
    currentMoveProfile,
    currentRhythm,
    activeRequest,
    guidesList,
    sprintPlan,
    toggleMilestoneComplete,
    sessions,
    goals,
    updateGoalStatus,
    userPod,
    updateRhythmSchedule,
  } = useApp();

  const [whyMatchOpen, setWhyMatchOpen] = useState(false);
  const [whyMatchMode, setWhyMatchMode] = useState<'guide' | 'pod' | 'both'>('both');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleSlot, setRescheduleSlot] = useState(
    currentRhythm?.guide_slot || 'Wednesdays 6:30 PM'
  );
  const [activeMetricInfo, setActiveMetricInfo] = useState<
    'milestones' | 'goals' | 'sessions' | null
  >(null);
  const [selectedWeekCard, setSelectedWeekCard] = useState<number>(
    currentRhythm?.week || 1
  );
  const [goalsConfirmed, setGoalsConfirmed] = useState(false);

  // Before matching: single focused "Your next step" card
  if (!currentRhythm && (!activeRequest || activeRequest.status !== 'pending')) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div className="pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Home
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Your move profile is ready.
          </p>
        </div>

        <div
          data-testid="next-step-choose-guide-card"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Your next step</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              Choose your Career Guide
            </h2>
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              We have matched your profile against people who have already made the move you are working toward. Review your closest matches and ask one to guide your 8-week sprint.
            </p>
          </div>

          <Link
            to="/guides"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Choose your Career Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Waiting on Career Guide reply state
  if (!currentRhythm && activeRequest?.status === 'pending') {
    const requestedGuide =
      guidesList.find((g) => g.profile.id === activeRequest.guide_id) || guidesList[0];
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Career Guide reply</span>
          </div>
          <h1 className="font-heading text-2xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Request sent. {requestedGuide.profile.first_name} will reply within 48 hours.
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            If they can't, we'll offer your next best match automatically.
          </p>
          <Link
            to="/request-sent"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
          >
            <span>View request & pod status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Personal Progress Dashboard
  const currentWeek = currentRhythm?.week || 1;
  const matchedGuideEntry =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id) || guidesList[0];
  const matchedGuide = matchedGuideEntry.profile;

  const existingMilestones = sprintPlan?.milestones || [];
  // Build all 8 week cards by pairing each week (1..8) with any user milestone for that week or the structured 8-week roadmap default
  const allEightWeekCards = DEFAULT_EIGHT_WEEK_ROADMAP.map((item) => {
    const matchedMilestone = existingMilestones.find(
      (m) => (m.week ?? (m as any).target_week ?? 1) === item.week
    );
    const isCompleted = matchedMilestone
      ? Boolean(matchedMilestone.completed)
      : item.week < currentWeek;
    return {
      week: item.week,
      phase: item.phase,
      milestoneId: matchedMilestone?.id || null,
      title: matchedMilestone?.title || item.defaultTitle,
      guideFocus: item.guideFocus,
      completed: isCompleted,
      isCurrent: item.week === currentWeek,
    };
  });

  const totalMilestones = existingMilestones.length || 6;
  const completedMilestones =
    existingMilestones.filter((m) => m.completed).length ||
    (currentWeek > 1 ? 2 : 1);

  const doneGoalsCount = goals.filter((g) => g.status === 'done').length;

  // Sessions breakdown: 1:1 Career Guide calls vs Pod sessions
  const heldSessions = sessions.filter((s) => s.held === true);
  const attendedSessionsCount =
    heldSessions.length || Math.max(1, (currentWeek - 1) * 3 + 1);
  const guideSessionsAttended =
    heldSessions.filter((s) => s.kind === 'guide').length || Math.max(1, currentWeek);
  const podSessionsAttended = Math.max(0, attendedSessionsCount - guideSessionsAttended);

  const activeWeekObj =
    allEightWeekCards.find((c) => c.week === selectedWeekCard) || allEightWeekCards[0];

  const nextSession = sessions[0];
  const nextSessionGuidingNote =
    nextSession?.kind === 'guide'
      ? 'Career Guide conversation: review your plan and next steps'
      : nextSession?.kind === 'pod_checkin'
      ? 'Pod check-in: 15 minutes, update your goals'
      : 'Pod call: share one win and one struggle';

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateRhythmSchedule(rescheduleSlot, 'Thursdays 7:00 PM', 'Mondays 6:30 PM');
    setShowRescheduleModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" data-testid="personal-progress-dashboard">
      {/* Header: Week N of 8 + Why this match button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            Your Personal Progress Dashboard
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Week {currentWeek} of 8
          </h1>
          <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Career Guide: {matchedGuide.first_name} {matchedGuide.last_initial} • {userPod?.name || 'Your Pod'}
          </p>
        </div>

        <button
          type="button"
          data-testid="dashboard-why-this-match-btn"
          onClick={() => {
            setWhyMatchMode('both');
            setWhyMatchOpen(true);
          }}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2D6B8F] dark:text-[#7FB6D6]" />
          <span>Why this match</span>
        </button>
      </div>

      {/* 3 Progress Metrics with Clear Descriptions & Info Icon Popovers */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Metric 1: Milestones Reached */}
          <div
            data-testid="metric-milestones-reached"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Milestones reached
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMetricInfo(
                      activeMetricInfo === 'milestones' ? null : 'milestones'
                    )
                  }
                  aria-label="What does Milestones reached mean?"
                  title="Milestones are set basis your 1:1 discussion with your Career Guide"
                  className="p-1 rounded-full hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-[#2D6B8F] dark:text-[#7FB6D6] cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
                {completedMilestones} of {totalMilestones}
              </p>
            </div>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-2 leading-snug">
              Basis your 1:1 discussion with Career Guide {matchedGuide.first_name} across your 8-week plan
            </p>
          </div>

          {/* Metric 2: Goals Done This Week */}
          <div
            data-testid="metric-goals-done"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Goals done this week
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMetricInfo(activeMetricInfo === 'goals' ? null : 'goals')
                  }
                  aria-label="What does Goals done this week mean?"
                  title="Weekly goals selected for your current week"
                  className="p-1 rounded-full hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-[#2D6B8F] dark:text-[#7FB6D6] cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
                {doneGoalsCount} of {goals.length || 3}
              </p>
            </div>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-2 leading-snug">
              Selected weekly action items for Week {currentWeek} (shared with your Guide &amp; Pod)
            </p>
          </div>

          {/* Metric 3: Sessions Attended */}
          <div
            data-testid="metric-sessions-attended"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Sessions attended
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMetricInfo(
                      activeMetricInfo === 'sessions' ? null : 'sessions'
                    )
                  }
                  aria-label="Which sessions are counted in Sessions attended?"
                  title="Includes both 1:1 Career Guide sessions and Pod sessions"
                  className="p-1 rounded-full hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-[#2D6B8F] dark:text-[#7FB6D6] cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
                {attendedSessionsCount} so far
              </p>
            </div>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-2 leading-snug">
              1:1 Guide + Pod sessions ({guideSessionsAttended} Guide 1:1 • {podSessionsAttended} Pod calls)
            </p>
          </div>
        </div>

        {/* Expandable Info Explanation Box when user clicks any Info icon */}
        {activeMetricInfo && (
          <div
            data-testid="metric-info-popover"
            className="p-4 rounded-xl bg-[#2D6B8F]/10 border border-[#2D6B8F]/30 text-xs text-[#13231F] dark:text-[#E6EEEA] flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#2D6B8F] dark:text-[#7FB6D6] shrink-0 mt-0.5" />
              {activeMetricInfo === 'milestones' && (
                <div>
                  <p className="font-semibold">What &ldquo;Milestones reached&rdquo; means:</p>
                  <p className="text-[#55665F] dark:text-[#A6B8B0] mt-0.5 leading-relaxed">
                    Milestones are your key 8-week transition checkpoints drafted and agreed based on your 1:1 discussion with your Career Guide ({matchedGuide.first_name}). Each week has a target milestone that you and your Career Guide review together.
                  </p>
                </div>
              )}
              {activeMetricInfo === 'goals' && (
                <div>
                  <p className="font-semibold">What &ldquo;Goals done this week&rdquo; means:</p>
                  <p className="text-[#55665F] dark:text-[#A6B8B0] mt-0.5 leading-relaxed">
                    Weekly goals are the 2–3 concrete actions you select for the current week (either from your Career Guide&apos;s suggestions or your own focus). Mark them as Done, Partly, or Not yet and confirm them below.
                  </p>
                </div>
              )}
              {activeMetricInfo === 'sessions' && (
                <div>
                  <p className="font-semibold">Which sessions are counted in &ldquo;Sessions attended&rdquo;:</p>
                  <p className="text-[#55665F] dark:text-[#A6B8B0] mt-0.5 leading-relaxed">
                    This counts both your <strong>1:1 Career Guide sessions</strong> (30-min weekly call with {matchedGuide.first_name}) and your <strong>Peer Pod sessions</strong> (30-min weekly Pod Call + 15-min mid-week Pod Check-in). Currently: <strong>{guideSessionsAttended} Career Guide 1:1</strong> and <strong>{podSessionsAttended} Pod session(s)</strong> attended.
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveMetricInfo(null)}
              className="p-1 text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
              aria-label="Close explanation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* All 8 Week Cards Available on Dashboard (Week 1 to Week 8) */}
      <section
        data-testid="dashboard-all-week-cards"
        className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F2B134]" />
              <span>Your 8-Week Sprint Plan — All 8 Week Cards</span>
            </h2>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              Click any week card (Week 1 – Week 8) to view its milestone &amp; 1:1 Career Guide focus.
            </p>
          </div>
          <Link
            to="/plan"
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium shrink-0"
          >
            Open full plan &amp; calendar →
          </Link>
        </div>

        {/* Grid of all 8 Week Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {allEightWeekCards.map((wkCard) => {
            const isSelected = wkCard.week === selectedWeekCard;
            return (
              <button
                key={wkCard.week}
                type="button"
                data-testid={`dashboard-week-card-${wkCard.week}`}
                onClick={() => setSelectedWeekCard(wkCard.week)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#102A2E] dark:border-[#F2B134] bg-[#F2B134]/15 shadow-2xs ring-1 ring-[#102A2E]/20 dark:ring-[#F2B134]/40'
                    : wkCard.isCurrent
                    ? 'border-[#F2B134] bg-[#F2B134]/10'
                    : wkCard.completed
                    ? 'border-[#2F7D5B]/40 bg-[#2F7D5B]/5 hover:border-[#2F7D5B]'
                    : 'border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 hover:border-[#102A2E]/40 dark:hover:border-[#F2B134]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-xs font-bold text-[#13231F] dark:text-[#E6EEEA]">
                    Week {wkCard.week}
                  </span>
                  {wkCard.completed ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]">
                      <Check className="w-2.5 h-2.5" />
                      Done
                    </span>
                  ) : wkCard.isCurrent ? (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#F2B134]/25 text-[#8A5A00] dark:text-[#F2B134]">
                      Current
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
                      {wkCard.phase}
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-medium text-[#13231F] dark:text-[#E6EEEA] line-clamp-2 leading-snug">
                  {wkCard.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Week Card Detail Panel */}
        {activeWeekObj && (
          <div
            data-testid="selected-week-card-detail"
            className="p-4 rounded-xl bg-[#F1F5F2]/70 dark:bg-[#122523]/70 border border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]">
                  Week {activeWeekObj.week} of 8 • {activeWeekObj.phase}
                </span>
                <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                  {activeWeekObj.guideFocus}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] pt-0.5">
                Milestone: {activeWeekObj.title}
              </p>
            </div>

            {activeWeekObj.milestoneId && (
              <button
                type="button"
                onClick={() => toggleMilestoneComplete(activeWeekObj.milestoneId!)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                  activeWeekObj.completed
                    ? 'bg-[#2F7D5B] text-white'
                    : 'border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {activeWeekObj.completed ? 'Milestone Reached' : 'Mark Milestone Reached'}
                </span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Next Session Card (with guiding note, Join active from 10m before, and Reschedule) */}
      {nextSession && (
        <section
          data-testid="next-session-card"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]">
                Next session ({nextSession.kind === 'guide' ? '1:1 Career Guide' : 'Peer Pod'})
              </span>
              <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                {new Date(nextSession.starts_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              {nextSessionGuidingNote}
            </h2>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              {nextSession.title} ({nextSession.duration_min} mins)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRescheduleModal(true)}
              className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] cursor-pointer"
            >
              Reschedule
            </button>
            <a
              href={nextSession.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join</span>
            </a>
          </div>
        </section>
      )}

      {/* This Week's Goals (with direct status selection AND Confirm button) */}
      <section className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
              This week&apos;s goals (Selected basis your Career Guide plan)
            </h2>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              Select what you have Done, Partly done, or Not yet done, then click Confirm Goals.
            </p>
          </div>
          <Link
            to="/goals"
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium shrink-0"
          >
            Edit or select goals →
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="py-4 text-center space-y-2.5" data-testid="day-one-empty-goals">
            <p className="text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              Welcome to week 1. Start by setting this week&apos;s goals.
            </p>
            <Link
              to="/goals"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set this week&apos;s goals</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              {goals.map((goal) => {
                const isDone = goal.status === 'done';
                const isPartly = goal.status === 'partly';
                return (
                  <div
                    key={goal.id}
                    className="p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F1F5F2]/30 dark:hover:bg-[#122523]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus =
                            goal.status === 'not_yet'
                              ? 'partly'
                              : goal.status === 'partly'
                              ? 'done'
                              : 'not_yet';
                          updateGoalStatus(goal.id, nextStatus);
                          setGoalsConfirmed(false);
                        }}
                        className="shrink-0 cursor-pointer"
                        aria-label={`Toggle goal status from ${goal.status}`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-[#2F7D5B] dark:text-[#5FBF8F]" />
                        ) : isPartly ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#F2B134] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#F2B134]" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-[#55665F] dark:text-[#A6B8B0]" />
                        )}
                      </button>
                      <span className="text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                        {goal.text}
                      </span>
                    </div>

                    <div className="inline-flex items-center rounded-full p-0.5 bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          updateGoalStatus(goal.id, 'not_yet');
                          setGoalsConfirmed(false);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                          goal.status === 'not_yet'
                            ? 'bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] shadow-2xs'
                            : 'text-[#55665F] dark:text-[#A6B8B0]'
                        }`}
                      >
                        Not yet
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateGoalStatus(goal.id, 'partly');
                          setGoalsConfirmed(false);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                          isPartly
                            ? 'bg-[#F2B134] text-[#102A2E] font-semibold shadow-2xs'
                            : 'text-[#55665F] dark:text-[#A6B8B0]'
                        }`}
                      >
                        Partly
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateGoalStatus(goal.id, 'done');
                          setGoalsConfirmed(false);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-[#2F7D5B] text-white font-semibold shadow-2xs'
                            : 'text-[#55665F] dark:text-[#A6B8B0]'
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {goalsConfirmed ? (
                <span className="text-xs font-semibold text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Weekly goals confirmed &amp; saved to your progress!</span>
                </span>
              ) : (
                <span className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                  Confirm your selected goal statuses for Week {currentWeek}.
                </span>
              )}

              <button
                type="button"
                data-testid="dashboard-confirm-goals-btn"
                onClick={() => setGoalsConfirmed(true)}
                className="px-4 py-2 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{goalsConfirmed ? 'Confirmed' : 'Confirm Weekly Goals'}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Three Clear 1-Tap Entry Points: My plan, My pod, My Career Guide */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-testid="dashboard-entry-points">
        <Link
          to="/plan"
          data-testid="entry-my-plan"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#55665F] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              My plan
            </h3>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              8-week milestones &amp; weekly calendar
            </p>
          </div>
        </Link>

        <Link
          to="/pod"
          data-testid="entry-my-pod"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#55665F] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              My pod
            </h3>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              Meet pod members &amp; share weekly wins
            </p>
          </div>
        </Link>

        <Link
          to="/guide"
          data-testid="entry-my-career-guide"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#55665F] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              My Career Guide
            </h3>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              1:1 with {matchedGuide.first_name} &amp; shared notes
            </p>
          </div>
        </Link>
      </section>

      {/* Why This Match Sheet */}
      <WhyThisMatchModal
        isOpen={whyMatchOpen}
        onClose={() => setWhyMatchOpen(false)}
        mode={whyMatchMode}
        userProfile={currentUser}
        userMove={currentMoveProfile}
        guideProfile={matchedGuide}
        guideMove={matchedGuideEntry.move_profile}
        podName={userPod?.name}
        podMembersCount={userPod?.members?.length || 5}
      />

      {/* Quick Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <h3 className="font-heading text-lg text-[#13231F] dark:text-[#E6EEEA]">
                Reschedule Session
              </h3>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="p-1 text-[#55665F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveReschedule} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Preferred weekly slot
                </label>
                <input
                  type="text"
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold cursor-pointer"
                >
                  Save new time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
