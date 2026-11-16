import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isPodsEnabled } from '../lib/pilotConfig';
import { downloadIcsFile, generateIcsContent } from '../lib/calendar';
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
  Download,
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

  const podsEnabled = isPodsEnabled();
  const currentWeek = Math.min(4, Math.max(1, currentRhythm?.week || 1));
  const matchedGuide =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id)?.profile ||
    guidesList[0].profile;

  const [showHowWeekWorks, setShowHowWeekWorks] = useState<boolean>(() => {
    return localStorage.getItem('plm_seen_how_4_weeks_work') !== 'true';
  });
  const [showMoreMilestones, setShowMoreMilestones] = useState(true);
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
    localStorage.setItem('plm_seen_how_4_weeks_work', 'true');
  };

  const sortedMilestones = sprintPlan
    ? [...sprintPlan.milestones]
        .slice(0, 5)
        .sort(
          (a, b) =>
            Math.min(4, a.week ?? (a as any).target_week ?? 1) -
            Math.min(4, b.week ?? (b as any).target_week ?? 1)
        )
    : [];

  const completedCount = sortedMilestones.filter((m) => m.completed).length;
  const visibleSessions = podsEnabled
    ? sessions
    : sessions.filter((s) => s.kind === 'guide');

  const getGuidingNote = (kind: string) => {
    if (kind === 'guide') {
      return 'Career Guide conversation: review your 4-week plan and next steps';
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

  const handleDownloadIcs = (session: any) => {
    const icsText = generateIcsContent({
      title: session.title,
      description: 'Weekly 30-minute Career Guide call on People Like Me',
      startsAt: session.starts_at,
      durationMin: session.duration_min,
      videoUrl: session.video_url,
    });
    downloadIcsFile('people-like-me-guide-call', icsText);
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
            My 4-Week Plan &amp; Call Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Week {currentWeek} of 4 • {completedCount} of {sortedMilestones.length || 4} milestones reached (set basis your 1:1 with {matchedGuide.first_name})
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHowWeekWorks(true)}
          data-testid="how-your-week-works-trigger"
          className="self-start sm:self-auto px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2D6B8F] dark:text-[#7FB6D6]" />
          <span>How your 4 weeks work</span>
        </button>
      </div>

      {/* "How your 4 weeks work" Explainer Banner (Section 6) */}
      {showHowWeekWorks && (
        <div
          data-testid="how-your-week-works-explainer"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#2D6B8F]/40 rounded-2xl p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D6B8F] dark:text-[#7FB6D6]">
              <Info className="w-4 h-4" />
              <span>How your 4 weeks work</span>
            </div>
            <button
              type="button"
              onClick={dismissExplainer}
              className="p-1 text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
              aria-label="Close How your 4 weeks work explainer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523]">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                1. Weekly Career Guide Call (30 min)
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-1">
                One 30-minute 1:1 call every week with {matchedGuide.first_name} with calendar invite and video link. Reschedule up to 2 hours before.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523]">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                2. 3 to 5 Personal Milestones
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-1">
                Drafted around what you have already tried, then reviewed and finalised with your Career Guide.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523]">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                3. 2–3 Weekly Goals
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-1">
                Concrete weekly focus items marked Done, Partly, or Not yet—visible to your Career Guide for support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Call Calendar with Clear Guiding Notes */}
      <section className="space-y-3" data-testid="weekly-calendar-section">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F2B134]" />
            <span>Weekly Call Calendar (Week {currentWeek} of 4)</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowRescheduleModal(true)}
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium cursor-pointer"
          >
            Reschedule (up to 2h before)
          </button>
        </div>

        <div className="space-y-3">
          {visibleSessions.map((session) => {
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
                      {session.duration_min} min 1:1
                    </span>
                    <span className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formattedTime}</span>
                    </span>
                  </div>

                  {/* Guiding Instruction Note */}
                  <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    {guidingNote}
                  </h3>

                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                    {session.title} • Reschedule permitted up to 2 hours before
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownloadIcs(session)}
                    className="px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Calendar invite</span>
                  </button>
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

      {/* 4-Week Milestones Section */}
      <section className="space-y-3" data-testid="eight-week-plan-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-[#F2B134]" />
            <span>Your 4-Week Plan &amp; Personal Milestones</span>
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
          {/* 4-Week Progress Timeline Bar */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => {
              const wk = idx + 1;
              const isCurrent = wk === currentWeek;
              const isPast = wk < currentWeek;
              return (
                <div
                  key={wk}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    isCurrent
                      ? 'border-[#F2B134] bg-[#F2B134]/15 text-[#13231F] dark:text-[#E6EEEA] font-semibold'
                      : isPast
                      ? 'border-[#2F7D5B]/40 bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]'
                      : 'border-[#D3DDD8]/60 dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0]'
                  }`}
                >
                  <span className="text-xs block">Week {wk} of 4</span>
                </div>
              );
            })}
          </div>

          {/* All Milestones Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedMilestones.map((m) => (
              <div
                key={m.id}
                data-testid="milestone-card"
                onClick={() => toggleMilestoneComplete(m.id)}
                className="p-3.5 rounded-xl bg-[#F1F5F2]/60 dark:bg-[#122523]/60 border border-[#D3DDD8]/70 dark:border-[#2A403C] flex items-start justify-between gap-3 cursor-pointer hover:border-[#F2B134] transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
                    Target: Week {Math.min(4, m.week ?? (m as any).target_week ?? 1)} of 4
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

          {/* Custom milestone form toggle */}
          <div className="pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowMoreMilestones(!showMoreMilestones)}
              className="text-xs font-semibold text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center gap-1 cursor-pointer"
            >
              <span>{showMoreMilestones ? 'Hide custom milestone form' : 'Add custom milestone'}</span>
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
                {[1, 2, 3, 4].map((w) => (
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
              Rescheduling is permitted up to 2 hours before the scheduled call time.
            </p>
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
              {podsEnabled && (
                <>
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
                </>
              )}
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
