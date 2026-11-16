import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
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
  Database,
  BarChart3,
  FastForward,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const WalkthroughToolbar: React.FC = () => {
  const {
    currentUser,
    switchUser,
    resetAllData,
    theme,
    toggleTheme,
    currentRhythm,
    simulateWeekAdvance,
    demoMode,
    setDemoMode,
    demoToast,
    setDemoToast,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

  // Do not show the top bar on the main landing page, sign-in/sign-up page, or when logged out
  if (!currentUser || location.pathname === '/' || location.pathname === '/signup') {
    return null;
  }

  const handleToggleDemoMode = () => {
    const next = !demoMode;
    setDemoMode(next);
    if (!next) {
      setShowPersonaDropdown(false);
    }
    setDemoToast({
      title: next
        ? 'Sample Guides Enabled (Created Only for Demo & Evaluation)'
        : 'Sample Guides Disabled (Standard User View)',
      message: next
        ? 'Sample Guides and Demo Account Switching are created strictly for demonstration purposes and can be removed later on.'
        : 'Switched back to standard user mode. Demo account switching is hidden.',
      linkTo: '/guides',
      linkLabel: 'View Career Guides',
    });
  };

  return (
    <aside
      aria-label="Account & Theme Bar"
      className="bg-[#102A2E] text-[#E6EEEA] border-b border-[#2A403C] text-xs sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#0B1D20] px-2.5 py-1 rounded-full border border-[#2A403C]">
            <User className="w-3.5 h-3.5 text-[#F2B134]" />
            <span className="text-[11px] font-medium text-white">
              {`${currentUser.first_name} ${currentUser.last_initial} (${currentUser.email})`}
            </span>
            {currentRhythm && (
              <span className="text-[10px] text-[#F2B134] font-semibold ml-1 border-l border-[#2A403C] pl-1.5">
                Week {Math.min(4, currentRhythm.week)} of 4
              </span>
            )}
          </div>

          {demoMode && (
            <span className="text-[10px] text-[#F2B134] bg-[#F2B134]/10 border border-[#F2B134]/30 px-2.5 py-0.5 rounded-full">
              Note: Sample Guides &amp; Demo Career Changer are created only for demo evaluation and can be removed later on.
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {!collapsed && (
            <>
              {/* DEMO_MODE / Sample Guides Toggle */}
              <button
                type="button"
                onClick={handleToggleDemoMode}
                className={`px-2.5 py-1 rounded-full border text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  demoMode
                    ? 'bg-[#F2B134]/20 border-[#F2B134] text-[#F2B134] font-semibold'
                    : 'bg-[#0B1D20] hover:bg-[#122523] border-[#2A403C] text-[#A6B8B0] hover:text-white'
                }`}
                title="Sample Guides are created strictly for demo perspective and can be removed later on"
              >
                <FlaskConical className="w-3 h-3" />
                <span>Sample Guides (Demo Only): {demoMode ? 'ON' : 'OFF'}</span>
              </button>

              {currentUser.role === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/pilot')}
                    className="px-2.5 py-1 rounded-full bg-[#F2B134]/20 hover:bg-[#F2B134]/30 border border-[#F2B134] text-[11px] text-[#F2B134] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-3 h-3" />
                    <span>Pilot Go/No-Go</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/database')}
                    className="px-2.5 py-1 rounded-full bg-[#2F7D5B]/20 hover:bg-[#2F7D5B]/30 border border-[#5FBF8F] text-[11px] text-[#5FBF8F] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="View live database records of all users who logged in (Admin only)"
                  >
                    <Database className="w-3 h-3" />
                    <span>User Database</span>
                  </button>
                </>
              )}

              {/* Switch Account Dropdown & Week Advance ONLY appear when Sample Guides (Demo Mode) is turned ON */}
              {demoMode && (
                <>
                  {currentRhythm && (
                    <button
                      type="button"
                      onClick={simulateWeekAdvance}
                      className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] text-[#A6B8B0] hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Advance pilot week (1 to 4) to preview Week 4 Month 2 Offer"
                    >
                      <FastForward className="w-3 h-3 text-[#F2B134]" />
                      <span>Next Week (Wk {currentRhythm.week >= 4 ? 1 : currentRhythm.week + 1}/4)</span>
                    </button>
                  )}

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                      className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#F2B134]/50 text-[11px] text-[#F2B134] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Demo Switch Account</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showPersonaDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-72 bg-[#0B1D20] border border-[#2A403C] rounded-xl shadow-xl p-2 z-50 space-y-1">
                        <div className="px-2 py-1.5 rounded-lg bg-[#122523] border border-[#2A403C] text-[10px] text-[#A6B8B0] leading-relaxed">
                          <strong className="text-[#F2B134]">Demo Evaluation Only:</strong> Sample guides and role switching are included only for demo review and can be removed later on.
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            switchUser('switcher_priya');
                            setShowPersonaDropdown(false);
                            navigate('/home');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-white flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold">Bharat K. (bharatk6325@gmail.com)</p>
                            <p className="text-[10px] text-[#A6B8B0]">Active Career Changer • Week 1 of 4</p>
                          </div>
                          <span className="text-[10px] text-[#F2B134] font-semibold">Demo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            switchUser('new_switcher');
                            setShowPersonaDropdown(false);
                            navigate('/onboarding/objective');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-[#E6EEEA] hover:text-white cursor-pointer"
                        >
                          <p className="font-semibold">Varun K. (varunk6325@gmail.com)</p>
                          <p className="text-[10px] text-[#A6B8B0]">New Career Changer • Fresh Onboarding</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            switchUser('guide_arjun');
                            setShowPersonaDropdown(false);
                            navigate('/guide-home');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-[#E6EEEA] hover:text-white cursor-pointer"
                        >
                          <p className="font-semibold">Arjun K. (Career Guide View)</p>
                          <p className="text-[10px] text-[#A6B8B0]">Accept requests &amp; edit 4-week plan</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            switchUser('admin');
                            setShowPersonaDropdown(false);
                            navigate('/admin/pilot');
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-[11px] hover:bg-[#122523] text-[#E6EEEA] hover:text-white cursor-pointer"
                        >
                          <p className="font-semibold">Admin (Pilot Go/No-Go &amp; Approvals)</p>
                          <p className="text-[10px] text-[#A6B8B0]">Pilot cohort metrics, price test &amp; waitlist</p>
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
                            <span>Sign In / Create Another Account</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={resetAllData}
                    className="p-1.5 rounded bg-[#0B1D20] hover:bg-[#193d43] border border-[#2A403C] text-[#A6B8B0] hover:text-white transition-colors cursor-pointer"
                    title="Reset demo data"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </>
              )}
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

      {demoToast && (
        <div className="bg-[#0B1D20] border-t border-[#2A403C] px-4 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-[#F2B134] text-[#102A2E] font-bold text-[10px] uppercase tracking-wider">
                Demo Notice
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
