import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { WhyThisMatchModal } from '../components/WhyThisMatchModal';
import { Month2OfferCard } from '../components/Month2OfferCard';
import { isPodsEnabled } from '../lib/pilotConfig';
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

const DEFAULT_FOUR_WEEK_ROADMAP: {
  week: number;
  phase: string;
  defaultTitle: string;
  guideFocus: string;
}[] = [
  {
    week: 1,
    phase: 'Foundation',
    defaultTitle: 'Validate target role & align 4-week plan with your Career Guide',
    guideFocus: '1:1 Guide Call: Agree on your 4-week milestones & positioning story',
  },
  {
    week: 2,
    phase: 'Positioning',
    defaultTitle: 'Reframe CV, LinkedIn & transition narrative for hiring managers',
    guideFocus: '1:1 Guide Call: Line-by-line review of your transition narrative & CV',
  },
  {
    week: 3,
    phase: 'Proof & Outreach',
    defaultTitle: 'Complete 1 practical role case study & shortlist 15 target teams',
    guideFocus: '1:1 Guide Call: Critique your role artifact & warm outreach strategy',
  },
  {
    week: 4,
    phase: 'Mock & Next Step',
    defaultTitle: 'Run live mock interview & story drill with your Career Guide',
    guideFocus: '1:1 Guide Call: 30-min mock interview, feedback & Month 2 roadmap',
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

  const podsEnabled = isPodsEnabled();
  const [whyMatchOpen, setWhyMatchOpen] = useState(false);
  const [whyMatchMode, setWhyMatchMode] = useState<'guide' | 'pod' | 'both'>('guide');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleSlot, setRescheduleSlot] = useState(
    currentRhythm?.guide_slot || 'Wednesdays 6:30 PM'
  );
  const [activeMetricInfo, setActiveMetricInfo] = useState<
    'milestones' | 'goals' | 'sessions' | null
  >(null);

  const rawWeek = Math.min(4, Math.max(1, currentRhythm?.week || 1));
  const [selectedWeekCard, setSelectedWeekCard] = useState<number>(rawWeek);
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
              We have matched your profile against people who have already made the move you are working toward. Review your closest matches and ask one to guide your four-week pilot.
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
            If they can&apos;t, we&apos;ll offer your next best match automatically.
          </p>
          <Link
            to="/request-sent"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
          >
            <span>View request status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Personal Progress Dashboard (4-Week Pilot)
  const currentWeek = Math.min(4, Math.max(1, currentRhythm?.week || 1));
  const matchedGuideEntry =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id) || guidesList[0];
  const matchedGuide = matchedGuideEntry.profile;

  const existingMilestones = (sprintPlan?.milestones || []).slice(0, 5);
  const allFourWeekCards = DEFAULT_FOUR_WEEK_ROADMAP.map((item) => {
    const matchedMilestone = existingMilestones.find(
      (m) => Math.min(4, m.week ?? (m as any).target_week ?? 1) === item.week
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

  const totalMilestones = Math.min(5, Math.max(3, existingMilestones.length || 4));
  const completedMilestones =
    existingMilestones.filter((m) => m.completed).length ||
    (currentWeek > 1 ? 2 : 1);

  const doneGoalsCount = goals.filter((g) => g.status === 'done').length;

  const visibleSessions = podsEnabled
    ? sessions
    : sessions.filter((s) => s.kind === 'guide');
  const heldCalls = visibleSessions.filter((s) => s.held === true);
  const attendedCallsCount = heldCalls.length || Math.min(4, Math.max(1, currentWeek));

  const activeWeekObj =
    allFourWeekCards.find((c) => c.week === selectedWeekCard) || allFourWeekCards[0];

  const nextSession = visibleSessions[0] || sessions[0];
  const nextSessionGuidingNote =
    'Career Guide conversation: review your 4-week plan and next steps';

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateRhythmSchedule(rescheduleSlot, 'Thursdays 7:00 PM', 'Mondays 6:30 PM');
    setShowRescheduleModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" data-testid="personal-progress-dashboard">
      {/* Header: Week N of 4 + Career Guide Avatar + Why this match button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            Your Personal Progress Dashboard
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Week {currentWeek} of 4
          </h1>
          <div className="flex items-center flex-wrap gap-3 mt-1.5">
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 pr-3 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]"
            >
              <InitialsAvatar
                firstName={matchedGuide.first_name}
                lastInitial={matchedGuide.last_initial}
                size="sm"
              />
              <span>
                Career Guide: <strong>{matchedGuide.first_name} {matchedGuide.last_initial}</strong>
              </span>
            </Link>

            {podsEnabled && (
              <Link
                to="/pod"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]"
              >
                <span>{userPod?.name || 'Your Pod'}</span>
              </Link>
            )}
          </div>
        </div>

        <button
          type="button"
          data-testid="dashboard-why-this-match-btn"
          onClick={() => {
            setWhyMatchMode(podsEnabled ? 'both' : 'guide');
            setWhyMatchOpen(true);
          }}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2D6B8F] dark:text-[#7FB6D6]" />
          <span>Why this match</span>
        </button>
      </div>

      {/* Week 4 Month 2 Offer & End-of-Pilot Rating (Shown automatically in Week 4 or when Week 4 card is selected) */}
      {(currentWeek === 4 || selectedWeekCard === 4) && (
        <Month2OfferCard
          userId={currentUser?.id || 'user-bharat-k'}
          userName={currentUser?.full_name || `${currentUser?.first_name || 'Bharat'} ${currentUser?.last_initial || 'K.'}`}
          userEmail={currentUser?.email || 'bharatk6325@gmail.com'}
          guideName={`${matchedGuide.first_name} ${matchedGuide.last_initial}`}
        />
      )}

      {/* 3 Progress Metrics: Milestones Reached, Goals This Week, Calls Attended */}
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
              Basis your 1:1 discussion with Career Guide {matchedGuide.first_name} across your 4-week plan
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
                  Goals this week
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMetricInfo(activeMetricInfo === 'goals' ? null : 'goals')
                  }
                  aria-label="What does Goals this week mean?"
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
              Selected weekly action items for Week {currentWeek} (visible to your Career Guide)
            </p>
          </div>

          {/* Metric 3: Calls Attended */}
          <div
            data-testid="metric-sessions-attended"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Calls attended
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMetricInfo(
                      activeMetricInfo === 'sessions' ? null : 'sessions'
                    )
                  }
                  aria-label="Which calls are counted in Calls attended?"
                  className="p-1 rounded-full hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-[#2D6B8F] dark:text-[#7FB6D6] cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
                {attendedCallsCount} of 4
              </p>
            </div>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-2 leading-snug">
              Weekly 30-minute 1:1 calls with Career Guide {matchedGuide.first_name}
            </p>
          </div>
        </div>

        {/* Expandable Info Explanation Box */}
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
                    Milestones are your 3 to 5 key transition checkpoints drafted and agreed based on your 1:1 discussion with your Career Guide ({matchedGuide.first_name}) across your 4-week pilot.
                  </p>
                </div>
              )}
              {activeMetricInfo === 'goals' && (
                <div>
                  <p className="font-semibold">What &ldquo;Goals this week&rdquo; means:</p>
                  <p className="text-[#55665F] dark:text-[#A6B8B0] mt-0.5 leading-relaxed">
                    Weekly goals are the 2–3 concrete actions you select for the current week, visible to your Career Guide. Mark them as Done, Partly, or Not yet and confirm them below.
                  </p>
                </div>
              )}
              {activeMetricInfo === 'sessions' && (
                <div>
                  <p className="font-semibold">What &ldquo;Calls attended&rdquo; counts:</p>
                  <p className="text-[#55665F] dark:text-[#A6B8B0] mt-0.5 leading-relaxed">
                    Tracks your weekly 30-minute 1:1 Career Guide calls with {matchedGuide.first_name} across the 4-week pilot.
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

      {/* All 4 Week Cards Available on Dashboard (Week 1 to Week 4) */}
      <section
        data-testid="dashboard-all-week-cards"
        className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F2B134]" />
              <span>Your 4-Week Pilot Plan — All 4 Week Cards</span>
            </h2>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              Click any week card (Week 1 – Week 4) to view its milestone &amp; 1:1 Career Guide focus. (Click Week 4 to view Month 2 offer.)
            </p>
          </div>
          <Link
            to="/plan"
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium shrink-0"
          >
            Open full plan &amp; calendar →
          </Link>
        </div>

        {/* Grid of all 4 Week Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {allFourWeekCards.map((wkCard) => {
            const isSelected = wkCard.week === selectedWeekCard;
            return (
              <button
                key={wkCard.week}
                type="button"
                data-testid={`dashboard-week-card-${wkCard.week}`}
                onClick={() => setSelectedWeekCard(wkCard.week)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
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
                  Week {activeWeekObj.week} of 4 • {activeWeekObj.phase}
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

      {/* Next Call Card (with guiding note, Join, and Reschedule up to 2h before) */}
      {nextSession && (
        <section
          data-testid="next-session-card"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]">
                Next call (Weekly 30-min 1:1)
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
              {nextSession.title} ({nextSession.duration_min} mins) • Reschedule up to 2 hours before
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

      {/* This Week's Goals (visible to Career Guide) */}
      <section className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
              This week&apos;s goals (Visible to your Career Guide)
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

      {/* 1-Tap Entry Points: My plan, My Career Guide (and My pod ONLY if podsEnabled) */}
      <section
        className={`grid grid-cols-1 ${podsEnabled ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}
        data-testid="dashboard-entry-points"
      >
        <Link
          to="/plan"
          data-testid="entry-my-plan"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#55665F] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              My plan
            </h3>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              4-week milestones &amp; weekly call calendar
            </p>
          </div>
        </Link>

        {podsEnabled && (
          <Link
            to="/pod"
            data-testid="entry-my-pod"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-[#55665F] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                My pod
              </h3>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                View pod member profiles &amp; share wins
              </p>
            </div>
          </Link>
        )}

        <Link
          to="/guide"
          data-testid="entry-my-career-guide"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <InitialsAvatar
                firstName={matchedGuide.first_name}
                lastInitial={matchedGuide.last_initial}
                size="md"
              />
              <span className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                {matchedGuide.first_name} {matchedGuide.last_initial}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#55665F] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              My Career Guide
            </h3>
            <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              1:1 with {matchedGuide.first_name}, weekly feedback &amp; shared notes
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

      {/* Quick Reschedule Modal (up to 2 hours before) */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <h3 className="font-heading text-lg text-[#13231F] dark:text-[#E6EEEA]">
                Reschedule Weekly Call
              </h3>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="p-1 text-[#55665F] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              You can reschedule your 30-minute Career Guide call up to 2 hours before the scheduled start time.
            </p>
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
