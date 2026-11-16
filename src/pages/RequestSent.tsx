import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { isPodsEnabled } from '../lib/pilotConfig';
import { ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

export const RequestSent: React.FC = () => {
  const {
    activeRequest,
    guidesList,
    acceptGuideRequest,
    simulate48HourExpiry,
  } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const podsEnabled = isPodsEnabled();

  const reqGuideId = activeRequest?.guide_id || 'guide-arjun-k';
  const cleanGuideId = reqGuideId.replace(/^sample-/, '');
  const targetGuide =
    guidesList.find(
      (g) => g.profile.id === reqGuideId || g.profile.id === cleanGuideId
    ) || guidesList[0];

  const handleContinue = () => {
    if (busy) return;
    setBusy(true);
    if (activeRequest) {
      acceptGuideRequest(activeRequest.id);
    } else {
      acceptGuideRequest('req-sim');
    }
    navigate(podsEnabled ? '/pod/intro' : '/rhythm');
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
          <div className="w-12 h-12 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accepted by Career Guide</span>
            </div>
            <h1 className="font-heading text-2xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              {targetGuide.profile.first_name} accepted your request!
            </h1>
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
              {podsEnabled
                ? 'Your 1:1 mentorship connection is confirmed. You are now being placed into your career pod to coordinate weekly rhythm and goals.'
                : 'Your 1:1 Career Guide connection is confirmed for your 4-week pilot. Next, confirm your weekly 30-minute call time and calendar invite.'}
            </p>
          </div>

          {/* Connection summary card */}
          <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase text-[#55665F] dark:text-[#A6B8B0]">4-Week Pilot Status</span>
              <span className="text-[#2F7D5B] dark:text-[#5FBF8F] font-medium">✓ Active Connection</span>
            </div>

            <div className="text-xs text-[#55665F] dark:text-[#A6B8B0] space-y-1">
              <p>• <strong>Weekly 1:1 Call:</strong> 30 minutes every week with {targetGuide.profile.first_name}.</p>
              <p>• <strong>Weekly Goals:</strong> 2–3 focus items visible to your Career Guide for accountability.</p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-3">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>
                {podsEnabled
                  ? 'Continue to Pod Intro & Rhythm →'
                  : 'Continue to Weekly Call Schedule →'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSimulateTimeout}
              className="w-full py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test: Simulate 48h Timeout &amp; Rematch</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        48-hour response rule: if a Career Guide cannot respond within 48 hours, we offer your next best match automatically.
      </footer>
    </div>
  );
};
