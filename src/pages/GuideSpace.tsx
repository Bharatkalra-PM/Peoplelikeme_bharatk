import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { WhyThisMatchModal } from '../components/WhyThisMatchModal';
import { formatMoveLine } from '../lib/matching';
import { loadPilotCohort, savePilotCohort } from '../lib/pilotConfig';
import {
  Video,
  CheckCircle,
  FileEdit,
  Save,
  ShieldCheck,
  MapPin,
  Check,
  Info,
  Star,
} from 'lucide-react';

export const GuideSpace: React.FC = () => {
  const { currentUser, currentMoveProfile, currentRhythm, sessions, guidesList, rateConversation } =
    useApp();

  const currentWeek = Math.min(4, Math.max(1, currentRhythm?.week || 1));
  const guideItem =
    guidesList.find((g) => g.profile.id === currentRhythm?.guide_id) || guidesList[0];
  const { profile: guide, move_profile: moveProf } = guideItem;

  const [agendaNote, setAgendaNote] = useState(
    'I want to review how to position my non-technical metrics on my product CV, and practice interview case questions.'
  );
  const [savedToast, setSavedToast] = useState(false);
  const [showWhyMatch, setShowWhyMatch] = useState(false);

  // Weekly call helpfulness rating (Section 7: "How helpful was your Career Guide this week?" 1 to 5 + optional comment)
  const [weeklyScore, setWeeklyScore] = useState<number>(5);
  const [weeklyComment, setWeeklyComment] = useState('');
  const [weeklyRated, setWeeklyRated] = useState(false);

  const guideSession = sessions.find((s) => s.kind === 'guide') || sessions[0];

  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleSubmitWeeklyRating = (e: React.FormEvent) => {
    e.preventDefault();
    rateConversation(guideSession?.id || guide.id, weeklyScore, weeklyScore);
    try {
      const cohort = loadPilotCohort();
      const idx = cohort.changers.findIndex((c) => c.id === currentUser?.id);
      if (idx >= 0) {
        cohort.changers[idx].weeklyRatings.push({
          week: currentWeek,
          score: weeklyScore,
          comment: weeklyComment.trim() || undefined,
        });
        savePilotCohort(cohort);
      }
    } catch {
      // ignore
    }
    setWeeklyRated(true);
  };

  const moveLine = formatMoveLine(moveProf.from_role, moveProf.to_role, moveProf.went_back);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            My Career Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Weekly 30-minute 1:1 mentorship across your 4-week pilot (Week {currentWeek} of 4)
          </p>
        </div>

        <button
          type="button"
          data-testid="guide-why-this-match-btn"
          onClick={() => setShowWhyMatch(true)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2D6B8F] dark:text-[#7FB6D6]" />
          <span>Why this match</span>
        </button>
      </div>

      {/* Career Guide Identity Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <InitialsAvatar firstName={guide.first_name} lastInitial={guide.last_initial} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  {guide.first_name} {guide.last_initial}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Approved Career Guide</span>
                </span>
              </div>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{guide.city}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWhyMatch(true)}
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why we matched you</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">
            Career Move
          </span>
          <p className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveLine}</p>
        </div>

        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          {moveProf.story}
        </p>
      </div>

      {/* Next Conversation Card with Guiding Note */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Next 30-Minute Weekly Call
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                {currentRhythm?.guide_slot || 'Wednesdays 6:30 PM'} • Reschedule up to 2 hours before
              </span>
              <h3 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Career Guide conversation: review your 4-week plan and next steps
              </h3>
            </div>

            <a
              href={guideSession?.video_url || 'https://meet.jit.si/plm-guide-call'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Video className="w-4 h-4" />
              <span>Join video call</span>
            </a>
          </div>

          <form onSubmit={handleSaveAgenda} className="pt-4 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-[#F2B134]" />
                <span>Your agenda notes for {guide.first_name}</span>
              </label>
              {savedToast && (
                <span className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={agendaNote}
              onChange={(e) => setAgendaNote(e.target.value)}
              placeholder="What questions or blockers do you want to work through this week?"
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-xs focus:bg-white dark:focus:bg-[#0E1E1D] resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523] flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save notes</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Section 7: Post-Call Question: "How helpful was your Career Guide this week?" (1 to 5 + optional comment) */}
      <section className="space-y-3" data-testid="weekly-call-rating-section">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          After This Week&apos;s Call
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                How helpful was your Career Guide this week?
              </h3>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                Rate from 1 to 5 after your 30-minute call with {guide.first_name}.
              </p>
            </div>
            {weeklyRated && (
              <span className="px-3 py-1 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] text-xs font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Feedback saved ({weeklyScore}/5)</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitWeeklyRating} className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  data-testid={`weekly-helpful-score-${num}`}
                  onClick={() => {
                    setWeeklyScore(num);
                    setWeeklyRated(false);
                  }}
                  className={`px-4 py-2 rounded-xl border font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    weeklyScore === num
                      ? 'bg-[#102A2E] text-white border-[#102A2E] dark:bg-[#F2B134] dark:text-[#102A2E] dark:border-[#F2B134]'
                      : 'border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/50 dark:bg-[#122523]/50'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      num <= weeklyScore ? 'fill-[#F2B134] text-[#F2B134]' : 'text-[#55665F]'
                    }`}
                  />
                  <span>{num}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="font-medium text-[#55665F] dark:text-[#A6B8B0] block mb-1">
                Optional comment
              </label>
              <input
                type="text"
                value={weeklyComment}
                onChange={(e) => setWeeklyComment(e.target.value)}
                placeholder="What was most useful in this week’s call?"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-xs"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
              >
                {weeklyRated ? 'Update rating' : 'Submit weekly rating'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Past Conversations */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Call Attendance History
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C] shadow-xs">
          <div className="p-4 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Week 1: Move Discovery &amp; 4-Week Plan Alignment
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                30 minutes • Confirmed Attended by Career Guide
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium text-[11px] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Attended</span>
            </span>
          </div>
        </div>
      </section>

      <WhyThisMatchModal
        isOpen={showWhyMatch}
        onClose={() => setShowWhyMatch(false)}
        mode="guide"
        userProfile={currentUser}
        userMove={currentMoveProfile}
        guideProfile={guide}
        guideMove={moveProf}
      />
    </div>
  );
};
