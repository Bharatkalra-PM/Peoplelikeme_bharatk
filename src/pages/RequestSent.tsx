import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { Clock, CheckCircle2, ArrowRight, RefreshCw, UserCheck } from 'lucide-react';

export const RequestSent: React.FC = () => {
  const { activeRequest, guidesList, acceptGuideRequest, simulate48HourExpiry } = useApp();
  const navigate = useNavigate();

  const targetGuide = guidesList.find((g) => g.profile.id === activeRequest?.guide_id) || guidesList[0];

  const handleSimulateAccept = () => {
    if (activeRequest) {
      acceptGuideRequest(activeRequest.id);
    }
    navigate('/pod/intro');
  };

  const handleSimulateTimeout = () => {
    simulate48HourExpiry();
    navigate('/guides');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-xl mx-auto w-full pt-4">
        <BrandMark />
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
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
              We give guides 48 hours to review incoming requests. This keeps the matching cadence predictable.
            </p>
          </div>

          {/* 48-hour timeline card */}
          <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase text-[#55665F] dark:text-[#A6B8B0]">48-Hour Response Rule</span>
              <span className="text-[#8A5A00] dark:text-[#F2B134] font-medium">Under review</span>
            </div>

            {/* Simple progress bar */}
            <div className="w-full bg-[#D3DDD8] dark:bg-[#2A403C] h-2 rounded-full overflow-hidden">
              <div className="bg-[#F2B134] h-full w-1/4 rounded-full" />
            </div>

            <div className="text-xs text-[#55665F] dark:text-[#A6B8B0] space-y-1">
              <p>• <strong>When accepted:</strong> You'll set your weekly 30-min conversation time and join your pod.</p>
              <p>• <strong>If expired or declined:</strong> We automatically offer your next best match without delay.</p>
            </div>
          </div>

          {/* Direct walkthrough helper buttons */}
          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-3">
            <button
              type="button"
              onClick={handleSimulateAccept}
              className="w-full py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Simulate: Guide Accepts Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSimulateTimeout}
              className="w-full py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#A8432C] dark:text-[#E58C73] flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate: 48h Expiry (Trigger Automatic Rematch)</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        You can also switch to {targetGuide.profile.first_name}'s account from the top bar to accept this request directly.
      </footer>
    </div>
  );
};
