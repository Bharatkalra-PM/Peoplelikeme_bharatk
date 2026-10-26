import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  FastForward,
  HeartHandshake,
  Moon,
  RotateCcw,
  Sun,
  ChevronDown,
  ChevronUp,
  User,
  FlaskConical,
  X,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WalkthroughToolbar: React.FC = () => {
  const {
    currentUser,
    switchUser,
    simulate48HourExpiry,
    simulateSlip,
    simulateWeekAdvance,
    resetAllData,
    theme,
    toggleTheme,
    currentRhythm,
    demoMode,
    setDemoMode,
    demoToast,
    setDemoToast,
  } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

  const handleToggleDemoMode = () => {
    const next = !demoMode;
    setDemoMode(next);
    setDemoToast({
      title: next ? 'Demo Mode Enabled (12 Sample Career Guides)' : 'Demo Mode Disabled (Live Profiles)',
      message: next
        ? 'Showing 12 sample Career Guides and 2 sample pods. Every sample person is clearly labelled "Sample profile".'
        : 'Switched back to standard verified Career Guides.',
      linkTo: '/guides',
      linkLabel: 'View Career Guides',
    });
  };

  const handle48hRematch = () => {
    simulate48HourExpiry();
    navigate('/guides');
  };

  const handleSimulateSlip = () => {
    simulateSlip();
    navigate('/guide-home/reach-out/prompt-demo-slip');
  };

  const handleAdvanceWeek = () => {
    const nextWk = currentRhythm ? Math.min(8, currentRhythm.week + 1) : 2;
    simulateWeekAdvance();
    if (nextWk === 8) {
      navigate('/wrap-up');
    } else {
      navigate('/home');
    }
  };

  const handleReset = () => {
    resetAllData();
    setDemoToast({
      title: 'Demo Data Reset',
      message: 'All state has been reset to Week 1 of 8 for Bharat K. (bharatk6325@gmail.com).',
      linkTo: '/home',
      linkLabel: 'Go to Home',
    });
    navigate('/home');
  };

  return (
    <aside
      aria-label="Walkthrough Testing Bar"
      className="bg-[#102A2E] text-[#E6EEEA] border-b border-[#2A403C] text-xs sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0B1D20] px-2.5 py-1 rounded-full border border-[#2A403C]">
            <User className="w-3.5 h-3.5 text-[#F2B134]" />
            <span className="text-[11px] font-medium text-white">
              {currentUser
                ? `${currentUser.first_name} ${currentUser.last_initial} (${currentUser.email})`
                : 'Logged Out'}
            </span>
            {currentRhythm && (
              <span className="text-[10px] text-[#F2B134] font-semibold ml-1 border-l border-[#2A403C] pl-1.5">
                Week {currentRhythm.week} of 8
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {!collapsed && (
            <>
              {/* DEMO_MODE Toggle */}
              <button
                type="button"
                onClick={handleToggleDemoMode}
                className={`px-2.5 py-1 rounded-full border text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  demoMode
                    ? 'bg-[#F2B134]/20 border-[#F2B134] text-[#F2B134] font-semibold'
                    : 'bg-[#0B1D20] hover:bg-[#122523] border-[#2A403C] text-[#A6B8B0] hover:text-white'
                }`}
                title="Toggle DEMO_MODE (12 sample Career Guides & 2 sample pods)"
              >
                <FlaskConical className="w-3 h-3" />
                <span>Demo Mode: {demoMode ? 'ON' : 'OFF'}</span>
              </button>

              {/* Test Personas Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                  className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] text-[#E6EEEA] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Switch Role / Demo Login</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPersonaDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-[#0B1D20] border border-[#2A403C] rounded-xl shadow-xl p-1.5 z-50 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        switchUser('switcher_priya');
                        setShowPersonaDropdown(false);
                        setDemoToast({
                          title: 'Switched to Bharat K. (bharatk6325@gmail.com)',
                          message: 'Viewing active Week 1 of 8 dashboard matched with Career Guide Arjun K.',
                        });
                        navigate('/home');
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-white flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold">Bharat K. (bharatk6325@gmail.com)</p>
                        <p className="text-[10px] text-[#A6B8B0]">Active Switcher • Week 1 of 8</p>
                      </div>
                      <span className="text-[10px] text-[#F2B134] font-semibold">Active</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchUser('new_switcher');
                        setShowPersonaDropdown(false);
                        setDemoToast({
                          title: 'Switched to Varun K. (varunk6325@gmail.com)',
                          message: 'Starting fresh user onboarding from Step 2 (Objective -> Story -> Matching).',
                        });
                        navigate('/onboarding/objective');
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-[#E6EEEA] hover:text-white cursor-pointer"
                    >
                      <p className="font-semibold">Varun K. (varunk6325@gmail.com)</p>
                      <p className="text-[10px] text-[#A6B8B0]">New Switcher • Full Onboarding Flow</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchUser('guide_arjun');
                        setShowPersonaDropdown(false);
                        setDemoToast({
                          title: 'Switched to Career Guide View (Arjun K.)',
                          message: 'Accept incoming switcher requests or click "Active Switchers" to edit & finalise the 8-week plan.',
                        });
                        navigate('/guide-home');
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-[#E6EEEA] hover:text-white cursor-pointer"
                    >
                      <p className="font-semibold">Arjun K. (Career Guide View)</p>
                      <p className="text-[10px] text-[#A6B8B0]">Accept requests & edit 8-week milestone plan</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchUser('admin');
                        setShowPersonaDropdown(false);
                        setDemoToast({
                          title: 'Switched to Admin View',
                          message: 'Review and approve Career Guide applications with LinkedIn, Email & CV checks.',
                        });
                        navigate('/admin');
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-[#E6EEEA] hover:text-white cursor-pointer"
                    >
                      <p className="font-semibold">Admin (Approvals & Moderation)</p>
                      <p className="text-[10px] text-[#A6B8B0]">Approve / Reject / Ask for more on applications</p>
                    </button>

                    <div className="border-t border-[#2A403C] pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPersonaDropdown(false);
                          navigate('/signup');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] hover:bg-[#122523] text-[#F2B134] flex items-center gap-1.5 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Open Sign-In Page (View Demo Passwords)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Demo Triggers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handle48hRematch}
                  className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#E58C73] hover:border-[#E58C73] transition-colors cursor-pointer"
                  title="Demo what happens when a Career Guide does not reply in 48 hours: automatically offers your next best match"
                >
                  <Clock className="w-3 h-3" />
                  <span>48h Rematch</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateSlip}
                  className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#F2B134] hover:border-[#F2B134] transition-colors cursor-pointer"
                  title="Demo what happens when a switcher misses weekly goals: opens the personal Career Guide check-in screen"
                >
                  <HeartHandshake className="w-3 h-3" />
                  <span>Check-in Nudge</span>
                </button>

                <button
                  type="button"
                  onClick={handleAdvanceWeek}
                  className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#5FBF8F] hover:border-[#5FBF8F] transition-colors cursor-pointer"
                  title="Advance the 8-week sprint by 1 week"
                >
                  <FastForward className="w-3 h-3" />
                  <span>+1 Wk</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[#A6B8B0] hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Reset demo data to Week 1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden lg:inline">Reset</span>
                </button>
              </div>
            </>
          )}

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[#E6EEEA] hover:text-[#F2B134] transition-colors flex items-center gap-1 cursor-pointer"
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F2B134]" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#F2B134]" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>

          {/* Collapse bar */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-[#A6B8B0] hover:text-white cursor-pointer"
            aria-label={collapsed ? 'Expand toolbar' : 'Collapse toolbar'}
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Demo Toast Banner explaining the triggered simulation */}
      {demoToast && (
        <div className="bg-[#0B1D20] border-t border-[#2A403C] px-4 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-[#F2B134] text-[#102A2E] font-bold text-[10px] uppercase tracking-wider">
                Demo Action
              </span>
              <span className="font-semibold text-white">{demoToast.title}:</span>
              <span className="text-[#A6B8B0]">{demoToast.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {demoToast.linkTo && (
                <button
                  type="button"
                  onClick={() => {
                    const target = demoToast.linkTo!;
                    setDemoToast(null);
                    navigate(target);
                  }}
                  className="px-3 py-1 rounded-full bg-[#F2B134] text-[#102A2E] font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>{demoToast.linkLabel || 'View'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setDemoToast(null)}
                className="p-1 text-[#A6B8B0] hover:text-white cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
