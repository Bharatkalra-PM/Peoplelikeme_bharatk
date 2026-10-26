import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import {
  CheckCircle,
  Circle,
  Video,
  ArrowRight,
  Plus,
  Heart,
  Compass,
  Flag,
  Sparkles,
  Users,
  Clock,
  Check,
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    currentRhythm,
    activeRequest,
    guidesList,
    sprintPlan, toggleMilestoneComplete, finaliseSprintPlan,
    sessions,
    goals,
    suggestedGoals,
    acceptSuggestedGoal,
    dismissSuggestedGoal,
    updateGoalStatus,
    podPosts,
    toggleCheer,
    userPod,
    reachOutPrompts,
    simulatePodReady,
    podReadyNotification,
    dismissPodNotification,
  } = useApp();

  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [editingSuggestionText, setEditingSuggestionText] = useState('');

  // STEP 4: Home before matching â€” single focused "Your next step" card: "Choose your Career Guide".
  // Nothing else competes for attention.
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
    const requestedGuide = guidesList.find((g) => g.profile.id === activeRequest.guide_id) || guidesList[0];
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
            If he can't, we'll offer your next best match automatically.
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

  // STEP 8 & 9: Active 8-week sprint
  const currentWeek = currentRhythm?.week || 1;
  const matchedGuide =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id)?.profile || guidesList[0].profile;
  const hasNoGoals = goals.length === 0;
  const doneGoalsCount = goals.filter((g) => g.status === 'done').length;

  let nudgeText: string | null = null;
  if (hasNoGoals) {
    nudgeText = 'Welcome to Week 1. Start by setting this weekâ€™s goals.';
  } else if (goals.length > 0 && doneGoalsCount < goals.length) {
    nudgeText = `${doneGoalsCount} of ${goals.length} done this week`;
  }

  const podSlipPrompt = reachOutPrompts.find((p) => p.audience === 'pod' && !p.resolved_at);
  const podMembersCount = userPod ? userPod.members.length : 5;
  const podTargetSize = userPod?.target_size || 4;
  const isPodForming = podMembersCount < 4;

  const isSessionJoinable = (startsAt: string, durationMin: number) => {
    const startMs = new Date(startsAt).getTime();
    const endMs = startMs + durationMin * 60 * 1000;
    const nowMs = Date.now();
    return nowMs >= startMs - 10 * 60 * 1000 && nowMs <= endMs;
  };

  const getTimeUntilSession = (startsAt: string) => {
    const diffMs = new Date(startsAt).getTime() - Date.now();
    if (diffMs <= 0) return 'In progress';
    const mins = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `in ${days}d ${hours % 24}h`;
    if (hours > 0) return `in ${hours}h ${mins % 60}m`;
    return `in ${mins}m`;
  };

  const sortedMilestones = sprintPlan
    ? [...sprintPlan.milestones].sort((a, b) => (a.week ?? (a as any).target_week ?? 1) - (b.week ?? (b as any).target_week ?? 1))
    : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Week {currentWeek} of 8
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Career Guide: {matchedGuide.first_name} {matchedGuide.last_initial} â€¢ {userPod?.name || 'Your Pod'}
          </p>
        </div>

        {nudgeText && (
          <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2B134]" />
            <span>{nudgeText}</span>
          </div>
        )}
      </div>

      {/* Pod Notification or Pod Forming Banner (Step 7) */}
      {podReadyNotification && (
        <div className="p-4 rounded-2xl bg-[#2F7D5B]/10 border border-[#2F7D5B]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F]">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{podReadyNotification}</span>
          </div>
          <button
            type="button"
            onClick={dismissPodNotification}
            className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {isPodForming && (
        <div
          data-testid="pod-forming-banner"
          className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              <Users className="w-4 h-4 text-[#2D6B8F] dark:text-[#89BBD6]" />
              <span>Your pod is forming. {podMembersCount} of {podTargetSize} have joined.</span>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              You have started with your Career Guide alone. We will notify you as soon as your pod is ready.
            </p>
          </div>
          <button
            type="button"
            onClick={simulatePodReady}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#2D6B8F] dark:text-[#89BBD6] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] shrink-0"
          >
            Simulate: Pod ready
          </button>
        </div>
      )}

      {/* 8-Week Timeline & Personal Milestones (Step 8 & 9) */}
      {sprintPlan && (
        <section className="space-y-3" data-testid="eight-week-plan-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-[#F2B134]" />
              <span>Your 8-Week Plan & Personal Milestones</span>
            </h2>
            <span
              data-testid="plan-status-badge"
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                sprintPlan.status === 'finalised'
                  ? 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]'
                  : 'bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]'
              }`}
            >
              {sprintPlan.status === 'finalised'
                ? `Finalised with ${matchedGuide.first_name}`
                : `Draft: you'll finalise this with ${matchedGuide.first_name} in your first conversation.`}
            </span>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-5 shadow-xs">
            {/* 8-Week Progress Timeline Bar */}
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }).map((_, idx) => {
                const wk = idx + 1;
                const isCurrent = wk === currentWeek;
                const isPast = wk < currentWeek;
                return (
                  <div
                    key={wk}
                    className={`p-2 rounded-xl border text-center transition-colors ${
                      isCurrent
                        ? 'border-[#F2B134] bg-[#F2B134]/15 text-[#13231F] dark:text-[#E6EEEA] font-semibold'
                        : isPast
                        ? 'border-[#2F7D5B]/40 bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]'
                        : 'border-[#D3DDD8]/60 dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0]'
                    }`}
                  >
                    <span className="text-[10px] block">Wk {wk}</span>
                  </div>
                );
              })}
            </div>

            {/* Milestones list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedMilestones.map((m) => (
                <div
                  key={m.id}
                  data-testid="milestone-card" onClick={() => toggleMilestoneComplete(m.id)} title="Click to toggle milestone completion"
                  className="p-3.5 rounded-xl bg-[#F1F5F2]/60 dark:bg-[#122523]/60 border border-[#D3DDD8]/70 dark:border-[#2A403C] flex items-start justify-between gap-3 cursor-pointer hover:border-[#F2B134] transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
                      Target: Week {m.week ?? (m as any).target_week ?? 1}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                      {m.title}
                    </p>
                  </div>
                  {m.completed && (
                    <CheckCircle className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F] shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Up Next Sessions */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            Up Next (Week {currentWeek})
          </h2>
          <Link to="/guide" className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline">
            All conversations â†’
          </Link>
        </div>

        <div className="space-y-3">
          {sessions.slice(0, 2).map((session) => {
            const isJoinable = true;
            const formattedTime = new Date(session.starts_at).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            });

            return (
              <div
                key={session.id}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        session.kind === 'guide'
                          ? 'bg-[#102A2E]/10 dark:bg-[#0B1D20] text-[#102A2E] dark:text-[#E6EEEA]'
                          : 'bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]'
                      }`}
                    >
                      {session.kind === 'guide' ? '30-min Career Guide Conversation' : 'Pod Call'}
                    </span>
                    <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {formattedTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    {session.title}
                  </h3>

                  {session.agenda && (
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] line-clamp-2">
                      Agenda: {session.agenda}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                  {isJoinable ? (
                    <a
                      href={session.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join / Preview Session</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] cursor-not-allowed bg-[#F1F5F2]/50 dark:bg-[#122523]/50"
                    >
                      {getTimeUntilSession(session.starts_at)}
                    </button>
                  )}
                  <span className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
                    Interactive Demo Room Ready
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Suggested Goals from Career Guide (if any) */}
      {suggestedGoals.length > 0 && (
        <section className="space-y-3" data-testid="suggested-goals-section">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested Goals from your Career Guide</span>
          </h2>
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#F2B134]/50 rounded-2xl p-5 space-y-3 shadow-xs">
            {suggestedGoals.map((sg) => (
              <div
                key={sg.id}
                className="p-3.5 rounded-xl bg-[#F1F5F2]/60 dark:bg-[#122523]/60 border border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {editingSuggestionId === sg.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingSuggestionText}
                      onChange={(e) => setEditingSuggestionText(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        acceptSuggestedGoal(sg.id, editingSuggestionText);
                        setEditingSuggestionId(null);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                      {sg.text}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => acceptSuggestedGoal(sg.id)}
                        className="px-3 py-1 rounded-full bg-[#2F7D5B] text-white text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSuggestionId(sg.id);
                          setEditingSuggestionText(sg.text);
                        }}
                        className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissSuggestedGoal(sg.id)}
                        className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs text-[#A8432C] dark:text-[#E58C73]"
                      >
                        Replace
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* This Week's Goals */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            This Weekâ€™s Goals
          </h2>
          <Link to="/goals" className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline">
            Edit goals â†’
          </Link>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
          {goals.length === 0 ? (
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                No goals set yet for this week.
              </p>
              <Link
                to="/goals"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set this weekâ€™s goals</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
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
                            goal.status === 'not_yet' ? 'partly' : goal.status === 'partly' ? 'done' : 'not_yet';
                          updateGoalStatus(goal.id, nextStatus);
                        }}
                        className="shrink-0 focus:outline-hidden"
                        title="Toggle: Not yet â†’ Partly â†’ Done"
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
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
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
        </div>
      </section>

      {/* From Your Pod Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            From Your Pod
          </h2>
          <Link to="/pod" className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline">
            Open pod space â†’
          </Link>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs">
          {podSlipPrompt && (
            <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] flex items-center justify-between text-xs">
              <span className="text-[#13231F] dark:text-[#E6EEEA]">
                {podSlipPrompt.subject_name} {podSlipPrompt.subject_initial} hasnâ€™t posted this week
              </span>
              <Link
                to="/pod"
                className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-[11px] font-medium hover:bg-white dark:hover:bg-[#0E1E1D]"
              >
                Say hello
              </Link>
            </div>
          )}

          {podPosts.slice(0, 2).map((post) => (
            <div key={post.id} className="space-y-2 pb-3 border-b border-[#D3DDD8]/60 dark:border-[#2A403C] last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <InitialsAvatar firstName={post.author_name} lastInitial={post.author_initial} size="sm" />
                  <span className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    {post.author_name} {post.author_initial}
                  </span>
                </div>
                {post.is_win && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]">
                    Win
                  </span>
                )}
              </div>
              <p className="text-xs text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
                {post.body}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => toggleCheer(post.id)}
                  className={`text-[11px] flex items-center gap-1 transition-colors ${
                    post.cheered_by_me
                      ? 'text-[#A8432C] dark:text-[#E58C73] font-medium'
                      : 'text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.cheered_by_me ? 'fill-current' : ''}`} />
                  <span>{post.cheers_count} {post.cheers_count === 1 ? 'cheer' : 'cheers'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

