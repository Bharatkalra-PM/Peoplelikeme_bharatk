import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { loadPilotCohort, savePilotCohort } from '../../lib/pilotConfig';
import {
  Inbox,
  Users,
  Clock,
  Check,
  X,
  Video,
  HeartHandshake,
  Flag,
  CheckCircle2,
} from 'lucide-react';

export const GuideHome: React.FC = () => {
  const {
    currentUser,
    activeRequest,
    acceptGuideRequest,
    declineGuideRequest,
    currentMoveProfile,
    goals,
    sessions,
    reachOutPrompts,
    guideApplications,
    sprintPlan,
    currentRhythm,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'changers'>('changers');
  const [callAttendanceStatus, setCallAttendanceStatus] = useState<'attended' | 'missed' | null>('attended');
  const [finishedFourWeeks, setFinishedFourWeeks] = useState<'yes' | 'no' | null>('yes');
  const [wouldGuideAgain, setWouldGuideAgain] = useState<'yes' | 'no' | null>('yes');
  const [guideSurveySaved, setGuideSurveySaved] = useState(false);

  const myApp = guideApplications.find(
    (a) =>
      currentUser &&
      (a.user_id === currentUser.id || a.email.toLowerCase() === currentUser.email.toLowerCase())
  );

  const isPendingRequest =
    activeRequest &&
    activeRequest.status === 'pending' &&
    activeRequest.guide_id === currentUser?.id;

  const guidePrompts = reachOutPrompts.filter(
    (p) => p.audience === 'guide' && !p.resolved_at
  );

  const getApplicantStatusLabel = (status: string) => {
    if (status === 'approved') return 'Approved';
    if (status === 'needs_more_info') return 'We need a little more';
    return 'Under review';
  };

  const handleConfirmAttendance = (status: 'attended' | 'missed') => {
    setCallAttendanceStatus(status);
    try {
      const cohort = loadPilotCohort();
      if (cohort.changers.length > 0) {
        cohort.changers[0].callsAttendedOf4 =
          status === 'attended'
            ? Math.min(4, Math.max(1, cohort.changers[0].callsAttendedOf4))
            : Math.max(0, cohort.changers[0].callsAttendedOf4 - 1);
        savePilotCohort(cohort);
      }
    } catch {
      // ignore
    }
  };

  const handleSaveEndSurvey = (finished: 'yes' | 'no', again: 'yes' | 'no') => {
    setFinishedFourWeeks(finished);
    setWouldGuideAgain(again);
    setGuideSurveySaved(true);
    try {
      const cohort = loadPilotCohort();
      const gIdx = cohort.guides.findIndex((g) => g.id === (currentUser?.id || 'guide-arjun-k'));
      if (gIdx >= 0) {
        cohort.guides[gIdx].finishedAllFourWeeks = finished === 'yes';
        cohort.guides[gIdx].wouldGuideAgain = again === 'yes';
        savePilotCohort(cohort);
      }
    } catch {
      // ignore
    }
  };

  const currentWeek = Math.min(4, Math.max(1, currentRhythm?.week || 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Career Guide Space
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            30 minutes a week for four weeks • At most two career changers at a time (1 of 2 active)
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-full text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Requests {isPendingRequest ? '(1)' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('changers')}
            className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'changers'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Career Changers (1/2)</span>
          </button>
        </div>
      </div>

      {/* Applicant status banner if the Career Guide applied */}
      {myApp && (
        <div
          data-testid="guide-home-application-status"
          className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] flex items-center justify-between gap-4 text-xs shadow-xs"
        >
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
              Your Career Guide Application Status
            </span>
            <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-0.5">
              {getApplicantStatusLabel(myApp.status)}
            </p>
            {myApp.admin_note && (
              <p className="text-xs text-[#8A5A00] dark:text-[#F2B134] mt-1">
                Note: {myApp.admin_note}
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full font-semibold ${
              myApp.status === 'approved'
                ? 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]'
                : 'bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]'
            }`}
          >
            {getApplicantStatusLabel(myApp.status)}
          </span>
        </div>
      )}

      {/* Career Guide Reach-out slip alert */}
      {guidePrompts.map((prompt) => (
        <div
          key={prompt.id}
          className="p-4 rounded-xl bg-[#F2B134]/15 border border-[#F2B134]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-[#8A5A00] dark:text-[#F2B134] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Reach out to {prompt.subject_name} {prompt.subject_initial}
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                {prompt.reason === 'few_goals_two_weeks'
                  ? 'Missed most weekly goals over the last two weeks.'
                  : 'No goal update in 7 days.'}
              </p>
            </div>
          </div>

          <Link
            to={`/guide-home/reach-out/${prompt.id}`}
            className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-medium text-center self-start sm:self-auto shrink-0"
          >
            Open reach out note →
          </Link>
        </div>
      ))}

      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {!isPendingRequest ? (
            <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-10 text-center space-y-2 shadow-xs">
              <Inbox className="w-8 h-8 text-[#55665F] dark:text-[#A6B8B0] mx-auto opacity-60" />
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                No pending requests right now
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] max-w-sm mx-auto">
                We&apos;ll notify you when a career changer making your move asks you to be their Career Guide. You can guide at most two people at a time.
              </p>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar firstName="Varun" lastInitial="K." size="md" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      Varun K.
                    </h2>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {currentMoveProfile?.city || 'Bengaluru'} • {currentMoveProfile?.years_experience || 5}y prior experience
                    </p>
                  </div>
                </div>

                <span className="text-xs text-[#8A5A00] dark:text-[#F2B134] font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>48 hours to respond</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">
                  Career Move
                </span>
                <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  {currentMoveProfile?.from_role || 'Sales Lead'} → {currentMoveProfile?.to_role || 'Product Manager'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Note from career changer:</span>
                <p className="text-xs text-[#13231F] dark:text-[#E6EEEA] italic bg-[#F1F5F2]/40 dark:bg-[#122523]/40 p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C]">
                  &ldquo;{activeRequest.note}&rdquo;
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => acceptGuideRequest(activeRequest.id)}
                  className="flex-1 py-2.5 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept career changer</span>
                </button>

                <button
                  type="button"
                  onClick={() => declineGuideRequest(activeRequest.id)}
                  className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Decline (No reason needed)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Career Changers Tab */
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <InitialsAvatar firstName="Bharat" lastInitial="K." size="lg" />
                <div>
                  <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    Bharat K.
                  </h2>
                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                    Week {currentWeek} of 4 • Wednesdays 6:30 PM
                  </p>
                </div>
              </div>

              <Link
                to="/guide-home/switcher/user-bharat-k"
                className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Manage 4-Week Plan &amp; Goals →</span>
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">
                  Move
                </span>
                <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  {currentMoveProfile?.from_role || 'Operations & Strategy Lead'} → {currentMoveProfile?.to_role || 'Product Manager'}
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]">
                Plan: {sprintPlan?.status === 'finalised' ? 'Finalised' : 'Draft'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-medium text-[#55665F] dark:text-[#A6B8B0]">This week&apos;s goals:</span>
              <ul className="space-y-1">
                {goals.map((g) => (
                  <li key={g.id} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        g.status === 'done'
                          ? 'bg-[#2F7D5B]'
                          : g.status === 'partly'
                          ? 'bg-[#F2B134]'
                          : 'bg-[#55665F]'
                      }`}
                    />
                    <span className="text-[#13231F] dark:text-[#E6EEEA]">{g.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 7: Career Guide confirms each call happened (Attended or Missed) */}
            <div className="pt-3 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-[#13231F] dark:text-[#E6EEEA] block">
                  Confirm Week {currentWeek} Call Attendance
                </span>
                <span className="text-[#55665F] dark:text-[#A6B8B0]">
                  Record whether this week&apos;s 30-minute call happened
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="guide-confirm-call-attended"
                  onClick={() => handleConfirmAttendance('attended')}
                  className={`px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1 cursor-pointer ${
                    callAttendanceStatus === 'attended'
                      ? 'bg-[#2F7D5B] text-white'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Attended</span>
                </button>
                <button
                  type="button"
                  data-testid="guide-confirm-call-missed"
                  onClick={() => handleConfirmAttendance('missed')}
                  className={`px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1 cursor-pointer ${
                    callAttendanceStatus === 'missed'
                      ? 'bg-[#A8432C] text-white'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C]'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Missed</span>
                </button>
                <a
                  href={sessions[0]?.video_url || 'https://meet.jit.si/plm-guide-call'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] font-medium flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join 30-min call</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 7: End of Week 4 Career Guide Questions */}
          <div
            data-testid="guide-week4-completion-questions"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs text-xs"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
                  End of Week 4 • Career Guide Check-in
                </span>
                <h3 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-0.5">
                  4-Week Pilot Completion Questions
                </h3>
              </div>
              {guideSurveySaved && (
                <span className="text-[#2F7D5B] dark:text-[#5FBF8F] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recorded for Pilot Dashboard</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] space-y-2">
                <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  1. Did you finish all four weeks?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEndSurvey('yes', wouldGuideAgain || 'yes')}
                    className={`px-4 py-1.5 rounded-full font-semibold cursor-pointer ${
                      finishedFourWeeks === 'yes'
                        ? 'bg-[#2F7D5B] text-white'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEndSurvey('no', wouldGuideAgain || 'no')}
                    className={`px-4 py-1.5 rounded-full font-semibold cursor-pointer ${
                      finishedFourWeeks === 'no'
                        ? 'bg-[#A8432C] text-white'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] space-y-2">
                <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  2. Would you guide again?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveEndSurvey(finishedFourWeeks || 'yes', 'yes')}
                    className={`px-4 py-1.5 rounded-full font-semibold cursor-pointer ${
                      wouldGuideAgain === 'yes'
                        ? 'bg-[#2F7D5B] text-white'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEndSurvey(finishedFourWeeks || 'yes', 'no')}
                    className={`px-4 py-1.5 rounded-full font-semibold cursor-pointer ${
                      wouldGuideAgain === 'no'
                        ? 'bg-[#A8432C] text-white'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
