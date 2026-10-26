import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Circle, ArrowLeft, Plus, Trash2, Share2, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Goals: React.FC = () => {
  const { goals, updateGoalStatus, saveWeeklyGoals, addPodPost, currentRhythm } = useApp();

  const [isEditing, setIsEditing] = useState(goals.length === 0);
  const [goalTexts, setGoalTexts] = useState<string[]>(() => {
    if (goals.length > 0) return goals.map((g) => g.text);
    return ['', '', ''];
  });
  const [sharedWinId, setSharedWinId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWeeklyGoals(goalTexts);
    setIsEditing(false);
  };

  const handleShareWin = (goalText: string, goalId: string) => {
    addPodPost(`Goal done: ${goalText}`, true);
    setSharedWinId(goalId);
    setTimeout(() => setSharedWinId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Week {currentRhythm?.week || 1} Goals
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Two or three focus items for this week. Keep them concrete.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#FFFFFF] dark:hover:bg-[#0E1E1D] text-xs font-medium"
        >
          {isEditing ? 'Cancel edit' : 'Edit goals'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
            Set your 2–3 goals for this week
          </h2>
          <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
            Visible to your guide and pod members for accountability.
          </p>

          <div className="space-y-3 pt-2">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Goal {idx + 1} {idx === 2 ? '(Optional)' : ''}
                </label>
                <input
                  type="text"
                  value={goalTexts[idx] || ''}
                  onChange={(e) => {
                    const next = [...goalTexts];
                    next[idx] = e.target.value;
                    setGoalTexts(next);
                  }}
                  placeholder={
                    idx === 0
                      ? 'e.g. Write PRD tear-down of Spotify search'
                      : idx === 1
                      ? 'e.g. Reach out to 3 former colleagues for intro chats'
                      : 'e.g. Polish resume bullets on customer metrics'
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium transition-colors shadow-xs"
            >
              Save week's goals
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#55665F] dark:text-[#A6B8B0]">
              <span>Tap the status dot to cycle states (Not yet → Partly → Done)</span>
              <span>Updated in under 2 minutes</span>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => {
                const isDone = goal.status === 'done';
                const isPartly = goal.status === 'partly';

                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between gap-4 bg-[#F1F5F2]/20 dark:bg-[#122523]/20"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus =
                            goal.status === 'not_yet' ? 'partly' : goal.status === 'partly' ? 'done' : 'not_yet';
                          updateGoalStatus(goal.id, nextStatus);
                        }}
                        className="shrink-0"
                        title="Toggle status"
                        aria-label={`Toggle status for goal: ${goal.text}`}
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

                      <span className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                        {goal.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDone && (
                        <button
                          type="button"
                          onClick={() => handleShareWin(goal.text, goal.id)}
                          className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-[11px] font-medium text-[#8A5A00] dark:text-[#F2B134] hover:bg-[#FFFFFF] dark:hover:bg-[#0E1E1D] flex items-center gap-1"
                          title="Share to pod feed as a win"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>{sharedWinId === goal.id ? 'Shared!' : 'Share win'}</span>
                        </button>
                      )}

                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          isDone
                            ? 'bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]'
                            : isPartly
                            ? 'bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]'
                            : 'bg-[#F1F5F2] dark:bg-[#122523] text-[#55665F] dark:text-[#A6B8B0]'
                        }`}
                      >
                        {isDone ? 'Done' : isPartly ? 'Partly' : 'Not yet'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
