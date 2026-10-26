import React from 'react';
import { X, Compass, Users, CheckCircle2, Sparkles } from 'lucide-react';
import { MoveProfile, Profile } from '../types';

interface WhyThisMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'guide' | 'pod' | 'both';
  userProfile?: Profile | null;
  userMove?: MoveProfile | null;
  guideProfile?: Profile | null;
  guideMove?: MoveProfile | null;
  podName?: string;
  podMembersCount?: number;
}

export const WhyThisMatchModal: React.FC<WhyThisMatchModalProps> = ({
  isOpen,
  onClose,
  mode,
  userProfile,
  userMove,
  guideProfile,
  guideMove,
  podName = 'Sales → PM Pod',
  podMembersCount = 5,
}) => {
  if (!isOpen) return null;

  const fromField = userMove?.from_field || guideMove?.from_field || 'Sales & Operations';
  const fromRole = userMove?.from_role || 'B2B Sales Lead';
  const toRole = userMove?.to_role || guideMove?.to_role || 'Product Manager';
  const userYears = userMove?.years_experience ?? 5;
  const guideYears = guideMove?.years_experience ?? 6;
  const city = userProfile?.city || guideProfile?.city || 'Bengaluru';
  const priority = userMove?.priority || guideMove?.priority || 'Speed to role';
  const slot =
    userMove?.availability?.[0] ||
    guideMove?.availability?.[0] ||
    'Weekday evenings (6:00 PM – 8:00 PM)';

  const guideBullets = [
    `Same starting field: both of you built your foundation in ${fromField} (${fromRole}).`,
    `Same target role: ${guideProfile?.first_name || 'Arjun'} successfully made the exact move into ${toRole} that you are working toward.`,
    `Similar experience stage: you have ${userYears} years of experience; ${guideProfile?.first_name || 'Arjun'} made the transition with ${guideYears} years of experience and prioritized "${priority}".`,
    `Shared location & schedule: both based in ${city} (or remote) with overlapping availability on ${slot}.`,
  ];

  const podSummary = `All ${podMembersCount} of you are moving from ${fromField.toLowerCase()} or related roles into ${toRole}, with ${Math.max(
    2,
    userYears - 1
  )} to ${userYears + 3} years of experience, mostly in ${city} or remote, and free on ${slot.toLowerCase()}.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-this-match-title"
    >
      <div
        data-testid="why-this-match-sheet"
        className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shared Facts Only • No Scores</span>
            </div>
            <h2
              id="why-this-match-title"
              className="font-heading text-xl text-[#13231F] dark:text-[#E6EEEA] mt-0.5"
            >
              Why this match
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Why this match panel"
            className="p-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {(mode === 'guide' || mode === 'both') && (
          <div className="space-y-3" data-testid="why-match-guide-section">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#13231F] dark:text-[#E6EEEA]">
              <Compass className="w-4 h-4 text-[#F2B134]" />
              <span>
                Why {guideProfile?.first_name || 'Arjun'} {guideProfile?.last_initial || 'K.'} is your Career Guide
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#13231F] dark:text-[#E6EEEA]">
              {guideBullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(mode === 'pod' || mode === 'both') && (
          <div className="space-y-2.5" data-testid="why-match-pod-section">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#13231F] dark:text-[#E6EEEA]">
              <Users className="w-4 h-4 text-[#2D6B8F] dark:text-[#7FB6D6]" />
              <span>Why {podName} is your Pod</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-xs text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
              {podSummary}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};