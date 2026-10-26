import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { formatMoveLine } from '../../lib/matching';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Video,
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Flag,
  Sparkles,
  Check,
  Edit3,
} from 'lucide-react';

export const SwitcherSummary: React.FC = () => {
  const {
    currentMoveProfile,
    goals,
    suggestedGoals,
    sessions,
    currentRhythm,
    sprintPlan,
    addMilestone,
    updateMilestone,
    removeMilestone,
    reorderMilestone,
    finaliseSprintPlan,
    suggestWeeklyGoal,
  } = useApp();

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneWeek, setNewMilestoneWeek] = useState(4);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingWeek, setEditingWeek] = useState(2);

  const [suggestedGoalText, setSuggestedGoalText] = useState('');
  const [goalSuggestedToast, setGoalSuggestedToast] = useState(false);

  const moveLine = formatMoveLine(
    currentMoveProfile?.from_role || 'B2B SaaS Sales Lead',
    currentMoveProfile?.to_role || 'Product Manager',
    false,
    currentMoveProfile?.industry || 'Consumer goods'
  );

  const sortedMilestones = sprintPlan
    ? [...sprintPlan.milestones].sort((a, b) => (a.week ?? (a as any).target_week ?? 1) - (b.week ?? (b as any).target_week ?? 1))
    : [];

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    addMilestone(newMilestoneTitle.trim(), newMilestoneWeek);
    setNewMilestoneTitle('');
  };

  const handleSuggestGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestedGoalText.trim()) return;
    suggestWeeklyGoal(suggestedGoalText.trim());
    setSuggestedGoalText('');
    setGoalSuggestedToast(true);
    setTimeout(() => setGoalSuggestedToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <Link
          to="/guide-home"
          className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Career Guide hub</span>
        </Link>
        <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
          Switcher Plan & Pre-call Summary
        </span>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Switcher header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <InitialsAvatar firstName="Bharat" lastInitial="K." size="lg" />
            <div>
              <h1 className="text-lg font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Bharat K.
              </h1>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{currentMoveProfile?.city || 'Bengaluru'}</span>
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-[#102A2E]/10 dark:bg-[#0B1D20] text-[#102A2E] dark:text-[#E6EEEA] font-medium">
            Week {currentRhythm?.week || 1} of 8
          </span>
        </div>

        {/* Move line */}
        <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">
            Transition
          </span>
          <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
            {moveLine}
          </p>
        </div>

        {/* Context Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C]">
            <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Experience</span>
            <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
              {currentMoveProfile?.years_experience || 5} years
            </span>
          </div>
          <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C]">
            <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">What matters most</span>
            <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
              {currentMoveProfile?.priority || 'Speed to role'}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C]">
            <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Dependants</span>
            <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
              {currentMoveProfile?.dependants || 'None'}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C]">
            <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">When free</span>
            <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
              {(currentMoveProfile?.availability || ['Weekday evenings'])[0]}
            </span>
          </div>
        </div>

        {/* Story */}
        <div className="space-y-1.5 text-xs">
          <h2 className="font-semibold text-[#55665F] dark:text-[#A6B8B0] uppercase text-[11px]">
            Their Story & Move Context
          </h2>
          <p className="text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
            {currentMoveProfile?.story ||
              'Spent 5 years closing enterprise software deals and solving customer friction; transitioning into full-time product management.'}
          </p>
          {currentMoveProfile?.tried_so_far && (
            <p className="text-[#55665F] dark:text-[#A6B8B0] pt-1">
              <strong>Tried so far:</strong> {currentMoveProfile.tried_so_far}
            </p>
          )}
        </div>

        {/* PILLAR 3: Career Guide Owns the 8-Week Plan & Milestones */}
        <div
          data-testid="guide-plan-editor"
          className="space-y-4 pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-[#F2B134]" />
                <span>8-Week Milestones ({sprintPlan?.status === 'finalised' ? 'Finalised' : 'Draft'})</span>
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                Add, remove, edit, and reorder milestones, then mark the plan Finalised.
              </p>
            </div>

            {sprintPlan?.status !== 'finalised' ? (
              <button
                type="button"
                onClick={finaliseSprintPlan}
                className="px-4 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Plan Finalised</span>
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Plan Finalised</span>
              </span>
            )}
          </div>

          {/* Milestones List */}
          <div className="space-y-2.5">
            {sortedMilestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-[#F1F5F2]/60 dark:bg-[#122523]/60 border border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {editingMilestoneId === m.id ? (
                  <div className="flex-1 flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs"
                    />
                    <select
                      value={editingWeek}
                      onChange={(e) => setEditingWeek(parseInt(e.target.value) || 1)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                        <option key={w} value={w}>
                          Week {w}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        updateMilestone(m.id, { title: editingTitle, week: editingWeek });
                        setEditingMilestoneId(null);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
                        Week {m.week ?? (m as any).target_week ?? 1}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                        {m.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderMilestone(m.id, 'up')}
                        className="p-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-white dark:hover:bg-[#0E1E1D] disabled:opacity-40"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedMilestones.length - 1}
                        onClick={() => reorderMilestone(m.id, 'down')}
                        className="p-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-white dark:hover:bg-[#0E1E1D] disabled:opacity-40"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMilestoneId(m.id);
                          setEditingTitle(m.title);
                          setEditingWeek(m.week ?? (m as any).target_week ?? 1);
                        }}
                        className="p-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-white dark:hover:bg-[#0E1E1D]"
                        title="Edit milestone"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMilestone(m.id)}
                        className="p-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] text-[#A8432C] dark:text-[#E58C73] hover:bg-white dark:hover:bg-[#0E1E1D]"
                        title="Remove milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Milestone Form */}
          <form onSubmit={handleAddMilestone} className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              type="text"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="Add a milestone (e.g. Complete 2 mock product sense interviews)"
              className="flex-1 px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-xs"
            />
            <select
              value={newMilestoneWeek}
              onChange={(e) => setNewMilestoneWeek(parseInt(e.target.value) || 4)}
              className="px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-xs"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <option key={w} value={w}>
                  Target: Week {w}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </form>
        </div>

        {/* PILLAR 3: Suggest Weekly Goals for the Switcher */}
        <div className="space-y-3 pt-4 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B134]" />
              <span>Suggest Weekly Goals for Switcher</span>
            </h2>
            {goalSuggestedToast && (
              <span className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] font-medium">
                âœ“ Suggested to switcher!
              </span>
            )}
          </div>

          <form onSubmit={handleSuggestGoal} className="flex gap-2">
            <input
              type="text"
              value={suggestedGoalText}
              onChange={(e) => setSuggestedGoalText(e.target.value)}
              placeholder="Suggest a goal for this week (appears on their Goals screen to accept, edit, or replace)..."
              className="flex-1 px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium shrink-0"
            >
              Suggest Goal
            </button>
          </form>

          {suggestedGoals.length > 0 && (
            <div className="text-xs text-[#55665F] dark:text-[#A6B8B0] space-y-1">
              <span className="font-medium">Currently suggested:</span>
              <ul className="list-disc pl-5 space-y-0.5">
                {suggestedGoals.map((sg) => (
                  <li key={sg.id}>{sg.text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Current Goals */}
        <div className="space-y-2.5 pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
          <h2 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
            Switcherâ€™s Active Weekly Goals
          </h2>
          <div className="space-y-2">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {g.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
                  ) : g.status === 'partly' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#F2B134] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#F2B134]" />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-[#55665F]" />
                  )}
                  <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{g.text}</span>
                </div>
                <span className="text-[11px] text-[#55665F] capitalize">{g.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <a
            href={sessions[0]?.video_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium flex items-center gap-2 shadow-xs"
          >
            <Video className="w-4 h-4" />
            <span>Join 30-min call</span>
          </a>
        </div>
      </div>
    </div>
  );
};

