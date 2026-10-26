import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { formatMoveLine } from '../../lib/matching';
import { ArrowLeft, CheckCircle, Circle, Video, MapPin, Briefcase } from 'lucide-react';

export const SwitcherSummary: React.FC = () => {
  const { currentMoveProfile, currentUser, goals, sessions, currentRhythm } = useApp();

  const moveLine = formatMoveLine(
    currentMoveProfile?.from_role || 'B2B SaaS Sales Lead',
    currentMoveProfile?.to_role || 'Product Manager'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <Link
          to="/guide-home"
          className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to guide hub</span>
        </Link>
        <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
          Pre-call summary
        </span>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Switcher header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InitialsAvatar firstName="Priya" lastInitial="M." size="lg" />
            <div>
              <h1 className="text-lg font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Priya M.
              </h1>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>Bengaluru</span>
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-[#102A2E]/10 dark:bg-[#0B1D20] text-[#102A2E] dark:text-[#E6EEEA] font-medium">
            Week {currentRhythm?.week || 2} of 8
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
            <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Primary Priority</span>
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
            <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Availability</span>
            <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
              {(currentMoveProfile?.availability || ['Weekday evenings'])[0]}
            </span>
          </div>
        </div>

        {/* Story */}
        <div className="space-y-1.5 text-xs">
          <h2 className="font-semibold text-[#55665F] dark:text-[#A6B8B0] uppercase text-[11px]">
            Their Move Context
          </h2>
          <p className="text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
            {currentMoveProfile?.story ||
              'Spent 5 years closing enterprise software deals and solving customer friction; transitioning into full-time product management.'}
          </p>
        </div>

        {/* Current Goals */}
        <div className="space-y-2.5 pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
          <h2 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0]">
            This Week’s Goals
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
