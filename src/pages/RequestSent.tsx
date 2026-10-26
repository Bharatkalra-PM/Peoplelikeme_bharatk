import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { Clock, ArrowRight, RefreshCw, Users, XCircle, CheckCircle2, Bell } from 'lucide-react';

export const RequestSent: React.FC = () => {
  const {
    activeRequest,
    guidesList,
    acceptGuideRequest,
    declineGuideRequest,
    simulate48HourExpiry,
    userPod,
    simulatePodReady,
    podReadyNotification,
  } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const targetGuide = guidesList.find((g) => g.profile.id === activeRequest?.guide_id) || guidesList[0];
  const podMembersCount = userPod ? userPod.members.length : 2;
  const targetPodSize = userPod?.target_size || 4;
  const isPodForming = podMembersCount < 4;

  const handleSimulateAccept = () => {
    if (busy) return;
    setBusy(true);
    if (activeRequest) {
      acceptGuideRequest(activeRequest.id);
    } else if (targetGuide) {
      acceptGuideRequest('req-sim');
    }
    navigate('/home');
  };

  const handleSimulateDecline = () => {
    if (busy) return;
    setBusy(true);
    if (activeRequest) {
      declineGuideRequest(activeRequest.id);
    }
    navigate('/guides');
  };

  const handleSimulateTimeout = () => {
    if (busy) return;
    setBusy(true);
    simulate48HourExpiry();
    navigate('/guides');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-xl mx-auto w-full pt-4 flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Link to="/guides" className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:underline">
            Back to Career Guides
          </Link>
          <Link to="/home" className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:underline">
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full py-8 space-y-6">
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-center">
          <div className="w-12 h-12 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              Request sent to {targetGuide.profile.first_name} {targetGuide.profile.last_initial}
            </h1>
            <p className="text-sm text-[#13231F] dark:text-[#E6EEEA] font-medium">
              Request sent. {targetGuide.profile.first_name} will reply within 48 hours. If he can't, we'll offer your next best match automatically.
            </p>
          </div>

          {/* 48-hour timeline card */}
          <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase text-[#55665F] dark:text-[#A6B8B0]">48-Hour Response Window</span>
              <span className="text-[#8A5A00] dark:text-[#F2B134] font-medium">Awaiting reply</span>
            </div>

            <div className="w-full bg-[#D3DDD8] dark:bg-[#2A403C] h-2 rounded-full overflow-hidden">
              <div className="bg-[#F2B134] h-full w-1/4 rounded-full" />
            </div>

            <div className="text-xs text-[#55665F] dark:text-[#A6B8B0] space-y-1">
              <p>• <strong>When accepted:</strong> Your 8-week plan begins at Week 1 of 8 with personal milestones.</p>
              <p>• <strong>If expired or declined:</strong> We automatically offer your next best Career Guide match.</p>
            </div>
          </div>

          {/* Step 7: Parallel Pod Forming Status */}
          <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                <Users className="w-4 h-4 text-[#2D6B8F] dark:text-[#89BBD6]" />
                <span>Your Pod (in parallel)</span>
              </div>
              <span className="text-[11px] font-medium text-[#2D6B8F] dark:text-[#89BBD6]">
                {isPodForming ? 'Forming' : 'Ready'}
              </span>
            </div>

            {isPodForming ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Your pod is forming. {podMembersCount} of {targetPodSize} have joined.
                </p>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                  You'll start with your Career Guide alone while the rest of your pod forms, and we'll notify you as soon as your pod is ready.
                </p>
                <button
                  type="button"
                  onClick={simulatePodReady}
                  className="text-xs text-[#2D6B8F] dark:text-[#89BBD6] font-medium underline"
                >
                  Simulate: Remaining members join pod
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{podReadyNotification || `Your pod of ${podMembersCount} people is ready!`}</span>
                </p>
              </div>
            )}
          </div>

          {/* Direct walkthrough helper buttons */}
          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-2.5">
            <button
              type="button"
              disabled={busy}
              onClick={handleSimulateAccept}
              className="w-full py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
            >
              <span>Simulate: Career Guide Accepts Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleSimulateDecline}
                className="w-full py-2.5 px-3 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#A8432C] dark:text-[#E58C73] flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Simulate: Career Guide Declines</span>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={handleSimulateTimeout}
                className="w-full py-2.5 px-3 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#8A5A00] dark:text-[#F2B134] flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate: 48h Expiry</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        You can also switch to {targetGuide.profile.first_name}'s account from the top bar to accept this request directly.
      </footer>
    </div>
  );
};
