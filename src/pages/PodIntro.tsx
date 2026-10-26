import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { ArrowRight, Users, Shield, Compass, Sparkles } from 'lucide-react';

export const PodIntro: React.FC = () => {
  const { currentPod, podMembers, currentUser, currentMoveProfile } = useApp();
  const navigate = useNavigate();

  const isForming = currentPod?.status === 'forming';
  const membersCount = podMembers.length + 1; // including current user

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-2xl mx-auto w-full pt-4">
        <BrandMark />
      </header>

      <main className="max-w-2xl mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <Users className="w-4 h-4" />
            <span>Sprint Cohort</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            {isForming ? `Your pod is forming (${membersCount} of 6)` : 'Meet your pod'}
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            {isForming
              ? 'Pods start when 4 members join and fill to 6. You start with your guide right away meanwhile.'
              : 'Five others navigating the same transition stage. You will meet twice a week.'}
          </p>
        </div>

        {/* Pod Members List */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0] tracking-wider">
            Pod Members ({membersCount}/6 joined)
          </h2>

          <div className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
            {/* You */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <InitialsAvatar
                  firstName={currentUser?.first_name || 'You'}
                  lastInitial={currentUser?.last_initial || ''}
                  size="md"
                />
                <div>
                  <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    {currentUser?.first_name} {currentUser?.last_initial} <span className="text-xs font-normal text-[#55665F] dark:text-[#A6B8B0]">(You)</span>
                  </p>
                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                    {currentMoveProfile?.from_role || 'Sales Lead'} → {currentMoveProfile?.to_role || 'Product Manager'}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] text-[11px] font-medium">
                Joined
              </span>
            </div>

            {/* Existing peers */}
            {podMembers.map((member) => (
              <div key={member.user_id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar
                    firstName={member.profile.first_name}
                    lastInitial={member.profile.last_initial}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                      {member.profile.first_name} {member.profile.last_initial}
                    </p>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {member.move_line}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                  {member.profile.city}
                </span>
              </div>
            ))}

            {/* Empty forming slots */}
            {Array.from({ length: Math.max(0, 6 - membersCount) }).map((_, i) => (
              <div key={i} className="py-3 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-dashed border-[#55665F] flex items-center justify-center text-xs text-[#55665F]">
                    {membersCount + i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#55665F]">Matching candidate...</p>
                    <p className="text-xs text-[#55665F]">Same target role and stage</p>
                  </div>
                </div>
                <span className="text-[11px] text-[#55665F]">Forming</span>
              </div>
            ))}
          </div>

          {/* Section 3 Correction 1 Continuity rule */}
          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              If your pod gets small, we'll add someone making the same move when we can, or offer to merge with another pod.
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => navigate('/rhythm')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Set your eight-week rhythm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Privacy rule: No contact details or full last names are exposed without your explicit consent.
      </footer>
    </div>
  );
};
