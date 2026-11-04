import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  Circle,
  Share2,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  Info,
} from 'lucide-react';

export const Goals: React.FC = () => {
  const {
    goals,
    suggestedGoals,
    acceptSuggestedGoal,
    dismissSuggestedGoal,
    updateGoalStatus,
    saveWeeklyGoals,
    addPodPost,
    currentRhythm,
  } = useApp();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(goals.length === 0);
  const [goalTexts, setGoalTexts] = useState<string[]>(() => {
    if (goals.length > 0) return goals.map((g) => g.text);
    return [
      'Confirm the first Career Guide conversation',
      'Set this week’s goals',
      'Introduce yourself to your pod',
    ];
  });
  const [sharedWinId, setSharedWinId] = useState<string | null>(null);
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [editingSuggestionText, setEditingSuggestionText] = useState('');
  const [confirmedBanner, setConfirmedBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWeeklyGoals(goalTexts);
    setIsEditing(false);
    setConfirmedBanner(true);
  };

  const handleConfirmAndReturn = () => {
    if (isEditing) {
      saveWeeklyGoals(goalTexts);
      setIsEditing(false);
    }
    setConfirmedBanner(true);
    setTimeout(() => {
      navigate('/home');
    }, 350);
  };

  const handleShareWin = (goalText: string, goalId: string) => {
    addPodPost(`Goal done: ${goalText}`, true);
    setSharedWinId(goalId);
    setTimeout(() => setSharedWinId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <Link
            to="/home"
            className="inline-flex items-center gap-1 text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Week {currentRhythm?.week || 1} of 8 Goals
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Select your weekly goals based on your Career Guide discussion, update what is Done / Partly / Not yet, and confirm to save.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isEditing && goals.length > 0) {
              setGoalTexts(goals.map((g) => g.text));
            }
            setIsEditing(!isEditing);
          }}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#FFFFFF] dark:hover:bg-[#0E1E1D] text-xs font-medium cursor-pointer"
        >
          {isEditing ? 'Cancel edit' : 'Edit goal text'}
        </button>
      </div>

      {/* Explainer banner for how Weekly Goals work */}
      <div className="p-3.5 rounded-xl bg-[#2D6B8F]/10 border border-[#2D6B8F]/30 flex items-start gap-2.5 text-xs text-[#13231F] dark:text-[#E6EEEA]">
        <Info className="w-4 h-4 text-[#2D6B8F] dark:text-[#7FB6D6] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">How Week&apos;s Goals work:</span> Your weekly goals are selected based on your 1:1 discussion with your Career Guide. Mark each goal as <strong>Done</strong>, <strong>Partly</strong>, or <strong>Not yet</strong> below, then click <strong>Confirm &amp; Return to Dashboard</strong>.
        </div>
      </div>

      {confirmedBanner && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-[#2F7D5B]/15 border border-[#2F7D5B]/40 text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Weekly goals confirmed and saved to your dashboard!</span>
          </div>
          <Link to="/home" className="underline font-semibold">
            Go to Dashboard →
          </Link>
        </div>
      )}

      {/* Career Guide Suggested Goals */}
      {suggestedGoals.length > 0 && (
        <div
          data-testid="goals-page-suggestions"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#F2B134]/60 rounded-2xl p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested by your Career Guide (Select to add to this week)</span>
          </div>

          <div className="space-y-2.5">
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
                      className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium cursor-pointer"
                    >
                      Save & Accept
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                      {sg.text}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => acceptSuggestedGoal(sg.id)}
                        className="px-3 py-1 rounded-full bg-[#2F7D5B] text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
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
                        className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissSuggestedGoal(sg.id)}
                        className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs text-[#A8432C] dark:text-[#E58C73] cursor-pointer"
                      >
                        Replace
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs"
        >
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
            Set your 2–3 goals for this week
          </h2>
          <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
            Visible to your Career Guide and pod members for weekly accountability.
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
                      ? 'e.g. Confirm the first Career Guide conversation'
                      : idx === 1
                      ? 'e.g. Set this week’s goals'
                      : 'e.g. Introduce yourself to your pod'
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] cursor-pointer"
            >
              Save goals
            </button>
            <button
              type="button"
              onClick={handleConfirmAndReturn}
              data-testid="confirm-goals-back-to-dashboard"
              className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm &amp; Return to Dashboard</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#55665F] dark:text-[#A6B8B0]">
              <span>Select the status for each goal (Not yet / Partly / Done), then click Confirm below</span>
              <span>Week {currentRhythm?.week || 1} of 8</span>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => {
                const isDone = goal.status === 'done';
                const isPartly = goal.status === 'partly';

                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F1F5F2]/20 dark:bg-[#122523]/20"
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

                    <div className="flex items-center flex-wrap gap-2">
                      {isDone && (
                        <button
                          type="button"
                          onClick={() => handleShareWin(goal.text, goal.id)}
                          className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-[11px] font-medium text-[#8A5A00] dark:text-[#F2B134] hover:bg-[#FFFFFF] dark:hover:bg-[#0E1E1D] flex items-center gap-1 cursor-pointer"
                          title="Share to pod feed as a win"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>{sharedWinId === goal.id ? 'Shared!' : 'Share win'}</span>
                        </button>
                      )}

                      {/* Direct 1-tap Status Selector Pills */}
                      <div className="inline-flex items-center rounded-full p-0.5 bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C]">
                        <button
                          type="button"
                          onClick={() => updateGoalStatus(goal.id, 'not_yet')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                            goal.status === 'not_yet'
                              ? 'bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] shadow-2xs'
                              : 'text-[#55665F] dark:text-[#A6B8B0]'
                          }`}
                        >
                          Not yet
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGoalStatus(goal.id, 'partly')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                            isPartly
                              ? 'bg-[#F2B134] text-[#102A2E] font-semibold shadow-2xs'
                              : 'text-[#55665F] dark:text-[#A6B8B0]'
                          }`}
                        >
                          Partly
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGoalStatus(goal.id, 'done')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-[#2F7D5B] text-white font-semibold shadow-2xs'
                              : 'text-[#55665F] dark:text-[#A6B8B0]'
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prominent Accept / Confirm & Go Back to Dashboard Bar */}
            <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                Done updating your goal statuses? Confirm to save and return to your dashboard.
              </p>
              <button
                type="button"
                onClick={handleConfirmAndReturn}
                data-testid="confirm-goals-back-to-dashboard"
                className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Back to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
