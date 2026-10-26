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
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    currentUser,
    currentMoveProfile,
    currentRhythm,
    activeRequest,
    guidesList,
    sprintPlan,
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

  // Personal Progress Dashboard (Feedback #4 from Arjun)
  const currentWeek = currentRhythm?.week || 1;
  const matchedGuideEntry =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id) || guidesList[0];
  const matchedGuide = matchedGuideEntry.profile;

  const totalMilestones = sprintPlan?.milestones?.length || 5;
  const completedMilestones =
    sprintPlan?.milestones?.filter((m) => m.completed).length ||
    (currentWeek > 1 ? 2 : 1);

  const doneGoalsCount = goals.filter((g) => g.status === 'done').length;
  const attendedSessionsCount =
    sessions.filter((s) => s.held === true).length || Math.max(1, (currentWeek - 1) * 3 + 1);

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
    <div className="space-y-6 max-w-3xl mx-auto" data-testid="personal-progress-dashboard">
      {/* Header: Week N of 8 + Why this match button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            Your Personal Progress
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

      {/* 3 Compact Progress Metrics: Milestones Reached, Goals Done This Week, Sessions Attended */}
      <div className="grid grid-cols-3 gap-3">
        <div
          data-testid="metric-milestones-reached"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs"
        >
          <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] block">
            Milestones reached
          </span>
          <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {completedMilestones} of {totalMilestones}
          </p>
        </div>

        <div
          data-testid="metric-goals-done"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs"
        >
          <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] block">
            Goals done this week
          </span>
          <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {doneGoalsCount} of {goals.length || 3}
          </p>
        </div>

        <div
          data-testid="metric-sessions-attended"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 shadow-2xs"
        >
          <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] block">
            Sessions attended
          </span>
          <p className="font-heading text-xl sm:text-2xl font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-1">
            {attendedSessionsCount} so far
          </p>
        </div>
      </div>

      {/* Next Session Card (with guiding note, Join active from 10m before, and Reschedule) */}
      {nextSession && (
        <section
          data-testid="next-session-card"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]">
                Next session
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

      {/* This Week's Goals (with quick 1-tap update or Day 1 empty state) */}
      <section className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            This week's goals
          </h2>
          <Link to="/goals" className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium">
            Update goals →
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="py-4 text-center space-y-2.5" data-testid="day-one-empty-goals">
            <p className="text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              Welcome to week 1. Start by setting this week's goals.
            </p>
            <Link
              to="/goals"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set this week's goals</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => {
              const isDone = goal.status === 'done';
              const isPartly = goal.status === 'partly';
              return (
                <div
                  key={goal.id}
                  className="p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between gap-3 hover:bg-[#F1F5F2]/30 dark:hover:bg-[#122523]/30 transition-colors"
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
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]'
                        : isPartly
                        ? 'bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]'
                        : 'text-[#55665F] dark:text-[#A6B8B0]'
                    }`}
                  >
                    {isDone ? 'Done' : isPartly ? 'Partly' : 'Not yet'}
                  </span>
                </div>
              );
            })}
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
              8-week milestones & weekly calendar
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
              Meet pod members & share weekly wins
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
              1:1 with {matchedGuide.first_name} & shared notes
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
