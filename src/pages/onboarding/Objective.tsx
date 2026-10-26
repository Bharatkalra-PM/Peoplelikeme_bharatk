import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import { ArrowRight, Compass, RotateCcw, Users, LogOut } from 'lucide-react';
import { ObjectiveType } from '../../types';

export const Objective: React.FC = () => {
  const { currentUser, setUserObjective, logout } = useApp();
  const navigate = useNavigate();

  const handleSelect = (obj: ObjectiveType) => {
    setUserObjective(obj);
    if (obj === 'become_guide') {
      navigate('/become-a-guide');
    } else {
      navigate('/onboarding/story');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-2xl mx-auto w-full pt-2 flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <BrandMark />
        <div className="flex items-center gap-3">
          {currentUser && (
            <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Signed in as <strong className="text-[#13231F] dark:text-[#E6EEEA]">{currentUser.first_name}</strong>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Choose your objective
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Tell us where you are in your career journey so we can set up the right path.
          </p>
        </div>

        <div className="space-y-4">
          {/* Option 1: Switch to a new role or field */}
          <button
            type="button"
            onClick={() => handleSelect('switch_role')}
            className="w-full text-left bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#102A2E] dark:hover:border-[#F2B134] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#102A2E]/10 dark:bg-[#F2B134]/15 text-[#102A2E] dark:text-[#F2B134] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Switch to a new role or field
                </h2>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                  Work with a Career Guide who made your exact move 1–5 years ago and a pod of peers at your stage.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#55665F] group-hover:text-[#102A2E] dark:group-hover:text-[#F2B134] shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Option 2: Restart after a career break */}
          <button
            type="button"
            onClick={() => handleSelect('restart_break')}
            className="w-full text-left bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#102A2E] dark:hover:border-[#F2B134] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Restart after a career break
                </h2>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                  Rebuild momentum with an eight-week structured plan, a supportive Career Guide, and a peer pod.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#55665F] group-hover:text-[#102A2E] dark:group-hover:text-[#F2B134] shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Option 3: I've made a switch and want to be a Career Guide */}
          <button
            type="button"
            onClick={() => handleSelect('become_guide')}
            className="w-full text-left bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#102A2E] dark:hover:border-[#F2B134] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#2D6B8F]/10 text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  I've made a switch and want to be a Career Guide
                </h2>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                  Share what you learned with up to two people at a time (30 minutes a week for eight weeks).
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#55665F] group-hover:text-[#102A2E] dark:group-hover:text-[#F2B134] shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>

      <footer className="max-w-2xl mx-auto w-full text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Privacy by default • You can change your objective at any time in Settings.
      </footer>
    </div>
  );
};
