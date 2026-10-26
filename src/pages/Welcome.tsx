import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { ArrowRight, Compass } from 'lucide-react';

export const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <BrandMark />
        <Link
          to="/signup"
          className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto w-full px-6 py-8 sm:py-16 text-center space-y-10">
        {/* Abstract Career Guide-and-Pod Diagram SVG */}
        <div className="flex justify-center" aria-hidden="true">
          <div className="relative w-72 h-44 flex items-center justify-center">
            {/* Career Guide circle */}
            <div className="absolute left-6 top-12 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#102A2E] dark:bg-[#0B1D20] text-white flex items-center justify-center font-medium shadow-xs border-2 border-[#F2B134]">
                <Compass className="w-5 h-5 text-[#F2B134]" />
              </div>
              <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] mt-1.5">
                Your Career Guide
              </span>
            </div>

            {/* Connecting subtle line */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 288 176">
              <path
                d="M 68 76 C 110 76, 130 88, 168 88"
                fill="none"
                stroke="#D3DDD8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="dark:stroke-[#2A403C]"
              />
            </svg>

            {/* Pod cluster */}
            <div className="absolute right-6 top-6 flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full border border-dashed border-[#D3DDD8] dark:border-[#2A403C] flex items-center justify-center bg-[#FFFFFF]/60 dark:bg-[#0E1E1D]/60 p-2">
                <div className="w-6 h-6 rounded-full bg-[#2F7D5B] text-white text-[10px] flex items-center justify-center absolute top-1 left-4 font-semibold">
                  A
                </div>
                <div className="w-6 h-6 rounded-full bg-[#2D6B8F] text-white text-[10px] flex items-center justify-center absolute top-3 right-3 font-semibold">
                  C
                </div>
                <div className="w-6 h-6 rounded-full bg-[#8A5A00] text-white text-[10px] flex items-center justify-center absolute bottom-2 right-4 font-semibold">
                  R
                </div>
                <div className="w-6 h-6 rounded-full bg-[#A8432C] text-white text-[10px] flex items-center justify-center absolute bottom-2 left-3 font-semibold">
                  D
                </div>
                <div className="w-6 h-6 rounded-full bg-[#55665F] text-white text-[10px] flex items-center justify-center absolute -top-1 right-10 font-semibold">
                  M
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F2B134] text-[#102A2E] text-xs flex items-center justify-center font-bold shadow-xs">
                  You
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] mt-1.5">
                Your Pod (4–6 peers)
              </span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="font-heading text-3xl sm:text-5xl font-normal tracking-tight text-[#13231F] dark:text-[#E6EEEA] max-w-xl mx-auto leading-tight">
            Make your career move alongside people doing the same.
          </h1>
          <p className="text-base sm:text-lg text-[#55665F] dark:text-[#A6B8B0] max-w-lg mx-auto">
            A Career Guide who made your exact transition 1–5 years ago. A pod of peers at your stage. An eight-week rhythm.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/signup?role=switcher"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F2B134] hover:bg-[#e0a32e] text-[#102A2E] font-medium text-sm transition-transform active:scale-98 shadow-xs flex items-center justify-center gap-2"
          >
            <span>Find my people</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/become-a-guide"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#FFFFFF] dark:hover:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] text-sm font-medium transition-colors"
          >
            Become a Career Guide
          </Link>
        </div>

        {/* Three Value Lines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-left border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2B134]" />
              <h3>Weekly Career Guide Conversation</h3>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              30 minutes one-on-one each week with a Career Guide who has actually made this move and knows the hurdles.
            </p>
          </div>

          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2B134]" />
              <h3>Two Pod Sessions a Week</h3>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              A 30-minute structured call and a 15-minute quick check-in with peers navigating the same stage.
            </p>
          </div>

          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2B134]" />
              <h3>Weekly Accountability</h3>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              Two or three weekly goals visible to your Career Guide and pod. Human check-ins when someone slips or goes quiet.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full px-6 py-6 border-t border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#55665F] dark:text-[#A6B8B0] gap-4">
        <div>
          <span>People Like Me</span> • <span>Privacy by default</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/settings" className="hover:underline">
            Privacy & Principles
          </Link>
          <Link to="/become-a-guide" className="hover:underline">
            Become a Career Guide
          </Link>
        </div>
      </footer>
    </div>
  );
};
