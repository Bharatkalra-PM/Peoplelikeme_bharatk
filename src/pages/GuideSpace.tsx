import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { formatMoveLine } from '../lib/matching';
import {
  Compass,
  Calendar,
  Video,
  Clock,
  CheckCircle,
  FileEdit,
  Save,
  ShieldCheck,
  MapPin,
  Check,
} from 'lucide-react';

export const GuideSpace: React.FC = () => {
  const { currentRhythm, sessions, guidesList } = useApp();

  const currentWeek = currentRhythm?.week || 1;
  const guideItem = guidesList.find((g) => g.profile.id === currentRhythm?.guide_id) || guidesList[0];
  const { profile: guide, move_profile: moveProf } = guideItem;

  const [agendaNote, setAgendaNote] = useState(
    'I want to review how to position my non-technical sales metrics on my product CV, and discuss interview case questions.'
  );
  const [savedToast, setSavedToast] = useState(false);

  const guideSession = sessions.find((s) => s.kind === 'guide') || sessions[0];

  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const moveLine = formatMoveLine(moveProf.from_role, moveProf.to_role, moveProf.went_back);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Your Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Weekly 30-minute 1:1 mentorship across your 8-week sprint
          </p>
        </div>

        {/* 8-Dot Sprint Progress Indicator */}
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C]">
          <span className="text-[11px] font-semibold text-[#55665F] dark:text-[#A6B8B0] mr-2">
            Week {currentWeek} of 8
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => {
              const weekNum = i + 1;
              const isPast = weekNum < currentWeek;
              const isCurrent = weekNum === currentWeek;

              return (
                <div
                  key={i}
                  title={`Week ${weekNum}`}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isPast
                      ? 'bg-[#2F7D5B] dark:bg-[#5FBF8F]'
                      : isCurrent
                      ? 'bg-[#F2B134] ring-2 ring-[#F2B134]/30 scale-110'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] bg-transparent'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Guide Identity Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <InitialsAvatar firstName={guide.first_name} lastInitial={guide.last_initial} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  {guide.first_name} {guide.last_initial}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{guide.city}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">Transition</span>
          <p className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveLine}</p>
        </div>

        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          {moveProf.story}
        </p>
      </div>

      {/* Next Conversation Card */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Next 30-Minute Conversation
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                {currentRhythm?.guide_slot || 'Wednesdays 6:30 PM'}
              </span>
              <h3 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Week {currentWeek} Alignment Call
              </h3>
            </div>

            <a
              href={guideSession.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Video className="w-4 h-4" />
              <span>Enter video call</span>
            </a>
          </div>

          {/* Agenda Note Form */}
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
                className="px-4 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523] flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save notes</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Past Conversations List */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Past Conversations
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C] shadow-xs">
          <div className="p-4 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Week 1: Move Discovery & Target Role Audit
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                30 minutes • Held via Jitsi video
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium text-[11px] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Held</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
