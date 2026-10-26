import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, FastForward, HeartHandshake, Moon, RotateCcw, Sun, ChevronDown, ChevronUp, User } from 'lucide-react';
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
  } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

  return (
    <aside aria-label="Walkthrough Testing Bar" className="bg-[#102A2E] text-[#E6EEEA] border-b border-[#2A403C] text-xs px-3 py-1.5 transition-all sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0B1D20] px-2.5 py-1 rounded-full border border-[#2A403C]">
            <User className="w-3.5 h-3.5 text-[#F2B134]" />
            <span className="text-[11px] font-medium text-white">
              {currentUser ? `${currentUser.first_name} ${currentUser.last_initial} (${currentUser.email})` : 'Logged Out'}
            </span>
            {currentRhythm && (
              <span className="text-[10px] text-[#A6B8B0] ml-1 border-l border-[#2A403C] pl-1.5">
                Week {currentRhythm.week}/8
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {!collapsed && (
            <>
              {/* Test Personas Dropdown (for testing guide view or admin view) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                  className="px-2.5 py-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] text-[#A6B8B0] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Switch Role / Test Guide</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPersonaDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-[#0B1D20] border border-[#2A403C] rounded-xl shadow-xl p-1.5 z-50 space-y-1">
                    <button
                      onClick={() => {
                        switchUser('switcher_priya');
                        setShowPersonaDropdown(false);
                        navigate('/home');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] hover:bg-[#122523] text-white flex items-center justify-between"
                    >
                      <span>Bharat K. (My Switcher)</span>
                      <span className="text-[10px] text-[#F2B134]">Active</span>
                    </button>
                    <button
                      onClick={() => {
                        switchUser('guide_vikram');
                        setShowPersonaDropdown(false);
                        navigate('/guide-home');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] hover:bg-[#122523] text-[#A6B8B0] hover:text-white"
                    >
                      Vikram S. (Test Guide - Bengaluru)
                    </button>
                    <button
                      onClick={() => {
                        switchUser('guide_arjun');
                        setShowPersonaDropdown(false);
                        navigate('/guide-home');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] hover:bg-[#122523] text-[#A6B8B0] hover:text-white"
                    >
                      Arjun K. (Guide View - 1:1)
                    </button>
                    <button
                      onClick={() => {
                        switchUser('guide_dev');
                        setShowPersonaDropdown(false);
                        navigate('/guide-home');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] hover:bg-[#122523] text-[#A6B8B0] hover:text-white"
                    >
                      Dev M. (Guide - Went Back)
                    </button>
                    <button
                      onClick={() => {
                        switchUser('admin');
                        setShowPersonaDropdown(false);
                        navigate('/admin');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] hover:bg-[#122523] text-[#A6B8B0] hover:text-white"
                    >
                      Admin (Approvals & Safety)
                    </button>
                  </div>
                )}
              </div>

              {/* Simulation triggers */}
              <div className="flex items-center gap-1">
                <button
                  onClick={simulate48HourExpiry}
                  className="px-2 py-1 rounded bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#E58C73]"
                  title="Simulate 48-Hour guide expiration to see automatic rematch state"
                >
                  <Clock className="w-3 h-3" />
                  <span className="hidden md:inline">Simulate</span> 48h Rematch
                </button>

                <button
                  onClick={simulateSlip}
                  className="px-2 py-1 rounded bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#F2B134]"
                  title="Simulate user slipping (triggers personal reach-out prompt)"
                >
                  <HeartHandshake className="w-3 h-3" />
                  <span className="hidden md:inline">Simulate</span> Slip
                </button>

                <button
                  onClick={simulateWeekAdvance}
                  className="px-2 py-1 rounded bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#5FBF8F]"
                  title="Advance current sprint by 1 week"
                >
                  <FastForward className="w-3 h-3" />
                  +1 Wk
                </button>

                <button
                  onClick={resetAllData}
                  className="p-1 rounded bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[#A6B8B0] hover:text-white"
                  title="Reset demo data"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full bg-[#0B1D20] hover:bg-[#122523] border border-[#2A403C] text-[#A6B8B0] hover:text-[#F2B134] transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Collapse bar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-[#A6B8B0] hover:text-white"
            aria-label={collapsed ? 'Expand toolbar' : 'Collapse toolbar'}
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
