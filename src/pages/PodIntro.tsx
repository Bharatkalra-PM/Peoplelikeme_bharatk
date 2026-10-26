import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { ArrowRight, Users, CheckCircle2 } from 'lucide-react';

export const PodIntro: React.FC = () => {
  const { userPod, currentUser, currentMoveProfile, simulatePodReady, podReadyNotification } = useApp();
  const navigate = useNavigate();

  const membersCount = userPod ? userPod.members.length : 2;
  const targetSize = userPod?.target_size || 4;
  const isForming = membersCount < 4;

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-2xl mx-auto w-full pt-4 flex items-center justify-between">
        <BrandMark />
        <Link to="/home" className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:underline">
          Go to Home
        </Link>
      </header>

      <main className="max-w-2xl mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <Users className="w-4 h-4" />
            <span>Sprint Cohort</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            {isForming
              ? `Your pod is forming. ${membersCount} of ${targetSize} have joined.`
              : 'Meet your pod'}
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            {isForming
              ? 'While your pod forms to 4–6 people making a similar move, you start with your Career Guide alone right away. We will notify you when your pod is ready.'
              : 'People making a similar career move at the same stage. You will meet twice a week.'}
          </p>
        </div>

        {podReadyNotification && (
          <div className="p-4 rounded-xl bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{podReadyNotification}</span>
          </div>
        )}

        {/* Pod Members List */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0] tracking-wider">
              Pod Members ({membersCount} of {targetSize} joined)
            </h2>
            {isForming && (
              <button
                type="button"
                onClick={simulatePodReady}
                className="text-xs font-medium text-[#2D6B8F] dark:text-[#89BBD6] underline"
              >
                Simulate: Remaining members join pod
              </button>
            )}
          </div>

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
                    {currentUser?.first_name} {currentUser?.last_initial}{' '}
                    <span className="text-xs font-normal text-[#55665F] dark:text-[#A6B8B0]">(You)</span>
                  </p>
                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                    {currentMoveProfile?.from_role || 'Sales Lead'} → {currentMoveProfile?.to_role || 'Product Manager'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] text-[11px] font-medium">
                Joined
              </span>
            </div>

            {/* Existing peers */}
            {userPod?.members
              .filter((m) => m.user_id !== currentUser?.id)
              .map((member) => (
                <div key={member.user_id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar
                      firstName={member.profile.first_name}
                      lastInitial={member.profile.last_initial}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
                          {member.profile.first_name} {member.profile.last_initial}
                        </p>
                        {member.profile.is_sample && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                            Sample profile
                          </span>
                        )}
                      </div>
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
            {Array.from({ length: Math.max(0, targetSize - membersCount) }).map((_, i) => (
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

          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              If your pod gets small, we'll add someone making the same move when we can, or offer to merge with another pod.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Continue to Week 1</span>
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
