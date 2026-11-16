import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { isPodsEnabled, loadPilotMoves } from '../lib/pilotConfig';
import { ArrowRight, Compass, CheckCircle2, Calendar, Target } from 'lucide-react';

export const Welcome: React.FC = () => {
  const podsEnabled = isPodsEnabled();
  const pilotMoves = loadPilotMoves().filter((m) => m.active);

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <BrandMark />
        <Link
          to="/signup?mode=signin"
          className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-3xl mx-auto w-full px-6 py-8 sm:py-14 text-center space-y-8">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2B134]/15 border border-[#F2B134]/40 text-xs font-semibold text-[#8A5A00] dark:text-[#F2B134]">
          <Compass className="w-3.5 h-3.5" />
          <span>Don&apos;t switch careers alone • Free 4-week pilot</span>
        </div>

        {/* Diagram: 1:1 Career Changer & Career Guide (or Guide + Pod when podsEnabled) */}
        <div className="flex justify-center" aria-hidden="true">
          {podsEnabled ? (
            <div className="relative w-72 h-40 flex items-center justify-center">
              <div className="absolute left-6 top-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#102A2E] dark:bg-[#0B1D20] text-white flex items-center justify-center font-medium shadow-xs border-2 border-[#F2B134]">
                  <Compass className="w-5 h-5 text-[#F2B134]" />
                </div>
                <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] mt-1.5">
                  Your Career Guide
                </span>
              </div>
              <div className="absolute right-6 top-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-dashed border-[#D3DDD8] dark:border-[#2A403C] flex items-center justify-center bg-[#FFFFFF]/60 dark:bg-[#0E1E1D]/60 p-2">
                  <div className="w-8 h-8 rounded-full bg-[#F2B134] text-[#102A2E] text-xs flex items-center justify-center font-bold shadow-xs">
                    You
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] mt-1.5">
                  Your Pod
                </span>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] shadow-2xs">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-[#F2B134] text-[#102A2E] text-xs font-bold flex items-center justify-center shadow-2xs">
                  You
                </div>
                <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] mt-1">
                  Career Changer
                </span>
              </div>
              <div className="text-xs font-semibold text-[#2F7D5B] dark:text-[#5FBF8F] px-3 py-1 rounded-full bg-[#2F7D5B]/10">
                4 Weeks • 1:1 Weekly Call
              </div>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-[#102A2E] dark:bg-[#0B1D20] text-white border-2 border-[#F2B134] flex items-center justify-center shadow-2xs">
                  <Compass className="w-5 h-5 text-[#F2B134]" />
                </div>
                <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] mt-1">
                  Your Career Guide
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Heading & Plain Vision Statement (Section 5) */}
        <div className="space-y-4">
          <h1 className="font-heading text-3xl sm:text-5xl font-normal tracking-tight text-[#13231F] dark:text-[#E6EEEA] max-w-2xl mx-auto leading-tight">
            The go-to place for a career change in any field.
          </h1>
          <p className="text-base sm:text-lg text-[#55665F] dark:text-[#A6B8B0] max-w-xl mx-auto">
            Work one-on-one with a Career Guide who made your exact transition 1–5 years ago. A structured four-week pilot with weekly 30-minute calls and clear weekly goals.
          </p>
        </div>

        {/* Starting With: Pilot Moves Box (Section 5) */}
        <div
          data-testid="landing-pilot-moves"
          className="max-w-xl mx-auto p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] space-y-2.5 shadow-2xs"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134] block">
            Starting with
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pilotMoves.map((pm) => (
              <span
                key={pm.id}
                className="px-3 py-1 rounded-full bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]"
              >
                {pm.label}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
            Making another move? Tell us your path and we&apos;ll notify you as soon as we have Career Guides for yours.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/signup?mode=signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F2B134] hover:bg-[#e0a32e] text-[#102A2E] font-semibold text-sm transition-transform active:scale-98 shadow-xs flex items-center justify-center gap-2"
          >
            <span>Find my Career Guide</span>
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
              <Calendar className="w-4 h-4 text-[#F2B134] shrink-0" />
              <h3>Weekly 30-Min Career Guide Call</h3>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              One 30-minute 1:1 call every week for four weeks with a Career Guide who has actually made your move and knows the hurdles.
            </p>
          </div>

          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              <Target className="w-4 h-4 text-[#F2B134] shrink-0" />
              <h3>Personal 4-Week Plan</h3>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              3 to 5 personal milestones tailored to what you&apos;ve already tried, reviewed and finalised with your Career Guide.
            </p>
          </div>

          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              <CheckCircle2 className="w-4 h-4 text-[#F2B134] shrink-0" />
              <h3>Weekly Goals &amp; Check-ins</h3>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
              Two or three weekly goals visible to your Career Guide. Thoughtful human check-ins if you get stuck or go quiet.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full px-6 py-6 border-t border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row items-center justify-between text-xs text-[#55665F] dark:text-[#A6B8B0] gap-4">
        <div>
          <span>People Like Me</span> • <span>Don&apos;t switch careers alone</span> • <span>Privacy by default</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/settings" className="hover:underline">
            Privacy &amp; Principles
          </Link>
          <Link to="/become-a-guide" className="hover:underline">
            Become a Career Guide
          </Link>
        </div>
      </footer>
    </div>
  );
};
