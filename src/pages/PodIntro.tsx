import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { ArrowRight, Users, CheckCircle2, MapPin } from 'lucide-react';

export const PodIntro: React.FC = () => {
  const { userPod, currentUser, currentMoveProfile, podReadyNotification } = useApp();
  const navigate = useNavigate();

  const peerMembers = (userPod?.members || []).filter(
    (m) => m.user_id !== currentUser?.id
  );
  const membersCount = peerMembers.length + 1;

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
            <span>Sprint Cohort Ready</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Meet your pod ({membersCount} members)
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Peers making a similar career transition at the same stage. You will meet twice a week (30-min Pod Call + 15-min Check-in) alongside your 1:1 Career Guide sessions.
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
              Your Pod Members ({membersCount} joined)
            </h2>
            <Link
              to="/pod"
              className="text-xs font-medium text-[#2D6B8F] dark:text-[#89BBD6] hover:underline"
            >
              Open full Pod &amp; member profiles →
            </Link>
          </div>

          <div className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
            {/* You */}
            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <InitialsAvatar
                  firstName={currentUser?.first_name || 'You'}
                  lastInitial={currentUser?.last_initial || ''}
                  size="lg"
                />
                <div>
                  <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    {currentUser?.first_name} {currentUser?.last_initial}{' '}
                    <span className="text-xs font-normal text-[#55665F] dark:text-[#A6B8B0]">(You)</span>
                  </p>
                  <p className="text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F]">
                    {currentMoveProfile?.from_role || 'Operations & Strategy Lead'} → {currentMoveProfile?.to_role || 'Product Manager'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] text-[11px] font-medium">
                Joined
              </span>
            </div>

            {/* Fellow Pod Peers */}
            {peerMembers.map((member) => (
              <div key={member.user_id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar
                    firstName={member.profile.first_name}
                    lastInitial={member.profile.last_initial}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                        {member.profile.first_name} {member.profile.last_initial}
                      </p>
                      {member.profile.is_sample && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                          Sample profile
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F]">
                      {member.move_line}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{member.profile.city}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              You can click any pod member inside the Pod tab to view their transition story, background, and weekly goals.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/pod')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] text-xs sm:text-sm font-semibold cursor-pointer"
          >
            View Pod &amp; Member Profiles
          </button>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>Continue to Week 1 Dashboard</span>
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
