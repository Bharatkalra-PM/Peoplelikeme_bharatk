import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { formatMoveLine } from '../../lib/matching';
import {
  Inbox,
  Users,
  Clock,
  Check,
  X,
  ArrowRight,
  AlertCircle,
  Video,
  HeartHandshake,
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
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'requests' | 'switchers'>('requests');

  // Filter requests directed to this guide
  const isPendingRequest =
    activeRequest &&
    activeRequest.status === 'pending' &&
    activeRequest.guide_id === currentUser?.id;

  // Active guide reach out prompts (guide audience only sees reason!)
  const guidePrompts = reachOutPrompts.filter(
    (p) => p.audience === 'guide' && !p.resolved_at
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Guide Space
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Mentoring switchers making the move you made • Max 2 active switchers
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-full text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
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
            onClick={() => setActiveTab('switchers')}
            className={`px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
              activeTab === 'switchers'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Switchers</span>
          </button>
        </div>
      </div>

      {/* Guide Reach-out slip alert (Section 6.5: guide sees reason and blank message box) */}
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
                  ? 'Fewer than half of goals were done over the last two weeks.'
                  : 'No goal update or post in 7 days.'}
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
            /* Section 10 Empty state */
            <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-10 text-center space-y-2 shadow-xs">
              <Inbox className="w-8 h-8 text-[#55665F] dark:text-[#A6B8B0] mx-auto opacity-60" />
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                No requests yet
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] max-w-sm mx-auto">
                We'll let you know when someone making your move asks for help.
              </p>
            </div>
          ) : (
            <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InitialsAvatar firstName="Priya" lastInitial="M." size="md" />
                  <div>
                    <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      Priya M.
                    </h2>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      Bengaluru • 5y prior experience
                    </p>
                  </div>
                </div>

                <span className="text-xs text-[#8A5A00] dark:text-[#F2B134] font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>36 hours left to respond</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">
                  Career Move
                </span>
                <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  B2B SaaS Sales Lead → Product Manager
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Note from Priya:</span>
                <p className="text-xs text-[#13231F] dark:text-[#E6EEEA] italic bg-[#F1F5F2]/40 dark:bg-[#122523]/40 p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C]">
                  "{activeRequest.note}"
                </p>
              </div>

              {/* Accept or Decline buttons (Section 9.6: decline needs no reason) */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => acceptGuideRequest(activeRequest.id)}
                  className="flex-1 py-2.5 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept switcher</span>
                </button>

                <button
                  type="button"
                  onClick={() => declineGuideRequest(activeRequest.id)}
                  className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Decline (No reason needed)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Switchers Tab */
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <InitialsAvatar firstName="Priya" lastInitial="M." size="lg" />
                <div>
                  <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    Priya M.
                  </h2>
                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                    Week 2 of 8 • Wednesdays 6:30 PM
                  </p>
                </div>
              </div>

              <Link
                to="/guide-home/switcher/switcher-priya-m"
                className="text-xs font-medium text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline"
              >
                Pre-call summary →
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-xs">
              <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0]">
                Move
              </span>
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                B2B SaaS Sales Lead → Product Manager
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-medium text-[#55665F] dark:text-[#A6B8B0]">This week's goals:</span>
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

            <div className="pt-2 flex justify-end">
              <a
                href={sessions[0]?.video_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join weekly 30-min call</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
