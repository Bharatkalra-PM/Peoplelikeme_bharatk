import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Flag,
  CheckCircle,
  Calendar,
  Info,
  Video,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  X,
  Plus,
} from 'lucide-react';

export const MyPlan: React.FC = () => {
  const {
    currentRhythm,
    sprintPlan,
    toggleMilestoneComplete,
    addMilestone,
    sessions,
    guidesList,
    updateRhythmSchedule,
  } = useApp();

  const currentWeek = currentRhythm?.week || 1;
  const matchedGuide =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id)?.profile ||
    guidesList[0].profile;

  const [showHowWeekWorks, setShowHowWeekWorks] = useState<boolean>(() => {
    return localStorage.getItem('plm_seen_how_week_works') !== 'true';
  });
  const [showMoreMilestones, setShowMoreMilestones] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [guideSlot, setGuideSlot] = useState(
    currentRhythm?.guide_slot || 'Wednesdays 6:30 PM'
  );
  const [podCallSlot, setPodCallSlot] = useState('Thursdays 7:00 PM');
  const [podCheckinSlot, setPodCheckinSlot] = useState('Mondays 6:30 PM');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneWeek, setNewMilestoneWeek] = useState<number>(currentWeek);

  const dismissExplainer = () => {
    setShowHowWeekWorks(false);
    localStorage.setItem('plm_seen_how_week_works', 'true');
  };

  const sortedMilestones = sprintPlan
    ? [...sprintPlan.milestones].sort(
        (a, b) =>
          (a.week ?? (a as any).target_week ?? 1) -
          (b.week ?? (b as any).target_week ?? 1)
      )
    : [];

  const completedCount = sortedMilestones.filter((m) => m.completed).length;
  const visibleMilestones = showMoreMilestones
    ? sortedMilestones
    : sortedMilestones.slice(0, 4);

  const getGuidingNote = (kind: string) => {
    if (kind === 'guide') {
      return 'Career Guide conversation: review your plan and next steps';
    }
    if (kind === 'pod_checkin') {
      return 'Pod check-in: 15 minutes, update your goals';
    }
    return 'Pod call: share one win and one struggle';
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateRhythmSchedule(guideSlot, podCallSlot, podCheckinSlot);
    setShowRescheduleModal(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addMilestone(newMilestoneWeek, newMilestoneTitle.trim());
    setNewMilestoneTitle('');
  };

  return (
    <div className="space-y-8" data-testid="my-plan-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <Link
            to="/home"
            className="inline-flex items-center gap-1 text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to progress dashboard</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            My Plan & Weekly Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Week {currentWeek} of 8 • {completedCount} of {sortedMilestones.length || 5} milestones reached
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHowWeekWorks(true)}
          data-testid="how-your-week-works-trigger"
          className="self-start sm:self-auto px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2D6B8F] dark:text-[#7FB6D6]" />
          <span>How your week works</span>
        </button>
      </div>

      {/* "How your week works" Explainer Banner */}
      {showHowWeekWorks && (
        <div
          data-testid="how-your-week-works-explainer"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#2D6B8F]/40 rounded-2xl p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6B8F] dark:text-[#7FB6D6]">
              <Info className="w-4 h-4" />
              <span>How your week works</span>
            </div>
            <button
              type="button"
              onClick={dismissExplainer}
              className="p-1 text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
              aria-label="Close How your week works explainer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523]">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                1. Career Guide conversation (30 min)
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-1">
                Review your plan and next steps one-on-one with {matchedGuide.first_name}.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523]">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                2. Pod call (30 min)
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-1">
                Share one win and one struggle with peers making the same transition.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523]">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                3. Pod check-in (15 min)
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-1">
                Quick mid-week check-in to update your goals and stay unblocked.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Calendar with Clear Guiding Notes */}
      <section className="space-y-3" data-testid="weekly-calendar-section">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F2B134]" />
            <span>Weekly Rhythm Calendar (Week {currentWeek})</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowRescheduleModal(true)}
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium cursor-pointer"
          >
            Reschedule times
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => {
            const guidingNote = getGuidingNote(session.kind);
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
                data-testid={`calendar-item-${session.kind}`}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#102A2E]/10 dark:bg-[#0B1D20] text-[#102A2E] dark:text-[#F2B134]">
                      {session.duration_min} min
                    </span>
                    <span className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formattedTime}</span>
                    </span>
                  </div>

                  {/* Guiding Instruction Note (Feedback #3) */}
                  <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    {guidingNote}
                  </h3>

                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                    {session.title}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowRescheduleModal(true)}
                    className="px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <a
                    href={session.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8-Week Milestones Section (with "More" collapse for secondary details) */}
      <section className="space-y-3" data-testid="eight-week-plan-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-[#F2B134]" />
            <span>Your 8-Week Plan & Personal Milestones</span>
          </h2>
          {sprintPlan && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]">
              {sprintPlan.status === 'finalised'
                ? `Finalised with ${matchedGuide.first_name}`
                : `Draft: review with ${matchedGuide.first_name} in your 1:1`}
            </span>
          )}
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

          {/* Milestones Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleMilestones.map((m) => (
              <div
                key={m.id}
                data-testid="milestone-card"
                onClick={() => toggleMilestoneComplete(m.id)}
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

          {/* Collapse secondary details behind "More" */}
          <div className="pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowMoreMilestones(!showMoreMilestones)}
              className="text-xs font-semibold text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center gap-1 cursor-pointer"
            >
              <span>{showMoreMilestones ? 'Less details' : 'More milestones & custom plan'}</span>
              {showMoreMilestones ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {showMoreMilestones && (
            <form onSubmit={handleAddMilestone} className="pt-3 flex flex-col sm:flex-row gap-2 text-xs">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Add a custom milestone..."
                className="flex-1 px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              />
              <select
                value={newMilestoneWeek}
                onChange={(e) => setNewMilestoneWeek(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <h3 className="font-heading text-lg text-[#13231F] dark:text-[#E6EEEA]">
                Reschedule Weekly Sessions
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
                <label className="font-medium">Career Guide conversation (30 min)</label>
                <input
                  type="text"
                  value={guideSlot}
                  onChange={(e) => setGuideSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium">Pod call (30 min)</label>
                <input
                  type="text"
                  value={podCallSlot}
                  onChange={(e) => setPodCallSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium">Pod check-in (15 min)</label>
                <input
                  type="text"
                  value={podCheckinSlot}
                  onChange={(e) => setPodCheckinSlot(e.target.value)}
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
                  Save schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};