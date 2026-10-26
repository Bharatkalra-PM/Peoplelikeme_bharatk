import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { Check, Sparkles, RefreshCw, Users, HeartHandshake, ArrowRight } from 'lucide-react';

export const WrapUp: React.FC = () => {
  const { currentRhythm, markLanded, continueWithPod, startFreshMatch } = useApp();
  const navigate = useNavigate();

  const [shareWin, setShareWin] = useState(true);
  const [selectedOption, setSelectedOption] = useState<'landed' | 'continue' | 'fresh' | null>(null);
  const [completedToast, setCompletedToast] = useState(false);

  const handleLandedSubmit = () => {
    markLanded(shareWin);
    setSelectedOption('landed');
    setCompletedToast(true);
  };

  const handleContinue = () => {
    continueWithPod();
    setSelectedOption('continue');
    setCompletedToast(true);
  };

  const handleFresh = () => {
    startFreshMatch();
    navigate('/matching');
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
          Sprint Wrap-up & Next Step
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
          Whether you’ve completed eight weeks or landed a role early, decide what comes next.
        </p>
      </div>

      {completedToast ? (
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-xl text-[#13231F] dark:text-[#E6EEEA]">
              {selectedOption === 'landed' ? 'Congratulations on landing!' : 'Rhythm updated'}
            </h2>
            <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] max-w-md mx-auto">
              {selectedOption === 'landed'
                ? 'Your sprint has been marked as landed. You can continue helping others by becoming a Career Guide when you’re settled.'
                : 'Your sessions and pod connection will remain open.'}
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            {selectedOption === 'landed' && (
              <Link
                to="/become-a-guide"
                className="px-6 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
              >
                Become a Career Guide
              </Link>
            )}
            <Link
              to="/home"
              className="px-6 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Option 1: Landed */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#F2B134] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                I’ve landed a role
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                Celebrate quietly with your pod, complete this sprint cycle, and pay it forward as a Career Guide later.
              </p>

              <label className="flex items-center gap-2 pt-2 text-xs text-[#55665F] dark:text-[#A6B8B0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareWin}
                  onChange={(e) => setShareWin(e.target.checked)}
                  className="rounded border-[#D3DDD8] text-[#F2B134] focus:ring-[#F2B134]"
                />
                <span>Post celebratory win to pod</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleLandedSubmit}
              className="w-full py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold shadow-xs"
            >
              Mark role landed
            </button>
          </div>

          {/* Option 2: Continue */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#102A2E] dark:hover:border-[#2A403C] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Continue with this Career Guide & pod
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                Maintain your weekly conversations and accountability rhythm with your current group.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-2.5 rounded-full border border-[#102A2E] dark:border-[#F2B134] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
            >
              Continue rhythm
            </button>
          </div>

          {/* Option 3: Fresh match */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#102A2E] dark:hover:border-[#2A403C] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#2D6B8F]/10 text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Start a fresh match
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                Connect with a different Career Guide or join a new pod cohort at your current stage.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFresh}
              className="w-full py-2.5 rounded-full border border-[#102A2E] dark:border-[#F2B134] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
            >
              Find new match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
