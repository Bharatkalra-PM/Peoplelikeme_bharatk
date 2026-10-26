import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import {
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Video,
  ArrowRight,
  Plus,
  Heart,
  MessageSquare,
  AlertCircle,
  Compass,
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    currentUser,
    currentRhythm,
    sessions,
    goals,
    updateGoalStatus,
    podPosts,
    toggleCheer,
    currentPod,
    reachOutPrompts,
  } = useApp();
  const navigate = useNavigate();

  const isWeek1 = (currentRhythm?.week || 1) === 1;
  const hasNoGoals = goals.length === 0;

  // Nudge calculation (only when true, plain words, no red alerts)
  const doneGoalsCount = goals.filter((g) => g.status === 'done').length;
  let nudgeText: string | null = null;
  if (hasNoGoals) {
    nudgeText = 'Welcome to week 1. Start by setting this week’s goals.';
  } else if (goals.length > 0 && doneGoalsCount < goals.length) {
    nudgeText = `${doneGoalsCount} of ${goals.length} done this week`;
  }

  // Active slip prompts for pod audience
  const podSlipPrompt = reachOutPrompts.find(
    (p) => p.audience === 'pod' && !p.resolved_at
  );

  // Determine if session is active (from 10 min before until end)
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Week {currentRhythm?.week || 1}
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Eight-week sprint • {currentPod?.name || 'Your Pod'}
          </p>
        </div>

        {/* Nudge if true (Section 10 & 3: Plain words, no warning red) */}
        {nudgeText && (
          <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2B134]" />
            <span>{nudgeText}</span>
          </div>
        )}
      </div>

      {/* Empty State for first day if no goals */}
      {hasNoGoals && (
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] mx-auto flex items-center justify-center font-semibold">
            1
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-lg text-[#13231F] dark:text-[#E6EEEA]">
              Welcome to week 1
            </h2>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] max-w-sm mx-auto">
              Start by setting this week’s two or three goals. Your guide and pod will see them to help keep you accountable.
            </p>
          </div>
          <Link
            to="/goals"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Set this week’s goals</span>
          </Link>
        </div>
      )}

      {/* Up Next Sessions (Section 3 Correction 7: readable width & 'Opens 10 min before' under join button) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            Up Next
          </h2>
          <Link
            to="/guide"
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline"
          >
            All conversations →
          </Link>
        </div>

        <div className="space-y-3">
          {sessions.slice(0, 2).map((session) => {
            const isJoinable = isSessionJoinable(session.starts_at, session.duration_min);
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
                {/* Session Details at readable width */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        session.kind === 'guide'
                          ? 'bg-[#102A2E]/10 dark:bg-[#0B1D20] text-[#102A2E] dark:text-[#E6EEEA]'
                          : 'bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]'
                      }`}
                    >
                      {session.kind === 'guide' ? '30-min Guide Conversation' : 'Pod Call'}
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

                {/* Action button & 'Opens 10 min before' under the Join button strictly */}
                <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
                  {isJoinable ? (
                    <a
                      href={session.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join call</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] cursor-not-allowed bg-[#F1F5F2]/50 dark:bg-[#122523]/50"
                    >
                      {getTimeUntilSession(session.starts_at)}
                    </button>
                  )}
                  {/* Under Join button as required by Section 3 Correction 7 */}
                  <span className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
                    Opens 10 min before
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* This Week's Goals (Section 3: check marks rather than strikethrough for done goals) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            This Week’s Goals
          </h2>
          <Link
            to="/goals"
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline"
          >
            Edit goals →
          </Link>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
          {goals.length === 0 ? (
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] py-2">
              No goals set yet for this week.
            </p>
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
                      {/* Three-state toggle button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus =
                            goal.status === 'not_yet' ? 'partly' : goal.status === 'partly' ? 'done' : 'not_yet';
                          updateGoalStatus(goal.id, nextStatus);
                        }}
                        className="shrink-0 focus:outline-hidden"
                        title="Toggle: Not yet → Partly → Done"
                        aria-label={`Toggle goal status from ${goal.status}`}
                      >
                        {isDone ? (
                          /* Check mark rather than strikethrough */
                          <CheckCircle className="w-5 h-5 text-[#2F7D5B] dark:text-[#5FBF8F]" />
                        ) : isPartly ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#F2B134] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#F2B134]" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-[#55665F] dark:text-[#A6B8B0]" />
                        )}
                      </button>

                      {/* Text: check marks rather than strikethrough for done goals */}
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
          <Link
            to="/pod"
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline"
          >
            Open pod space →
          </Link>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs">
          {podSlipPrompt && (
            <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] flex items-center justify-between text-xs">
              <span className="text-[#13231F] dark:text-[#E6EEEA]">
                {podSlipPrompt.subject_name} {podSlipPrompt.subject_initial} hasn’t posted this week
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
