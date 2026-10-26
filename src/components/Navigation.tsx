import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from './BrandMark';
import { InitialsAvatar } from './InitialsAvatar';
import {
  Home,
  Users,
  Compass,
  CheckSquare,
  Settings,
  Inbox,
  UserCheck,
  Shield,
  LogOut,
  Calendar,
} from 'lucide-react';

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, currentRhythm } = useApp();
  const location = useLocation();

  // If user is not logged in or in onboarding flows, render clean layout without sidebar/bottom tabs
  const isOnboarding =
    location.pathname === '/' ||
    location.pathname === '/signup' ||
    location.pathname.startsWith('/onboarding') ||
    location.pathname === '/matching' ||
    location.pathname.startsWith('/guides') ||
    location.pathname === '/request-sent' ||
    location.pathname === '/rhythm' ||
    location.pathname === '/pod/intro';

  if (!currentUser || isOnboarding) {
    return <main className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523]">{children}</main>;
  }

  const isGuide = currentUser.role === 'guide';
  const isAdmin = currentUser.role === 'admin';

  // Navigation items for Switcher vs Guide vs Admin
  const navItems = isGuide
    ? [
        { label: 'Requests', to: '/guide-home', icon: Inbox },
        { label: 'Switchers', to: '/guide-home/switchers', icon: Users },
        { label: 'Settings', to: '/settings', icon: Settings },
      ]
    : isAdmin
    ? [
        { label: 'Admin Hub', to: '/admin', icon: Shield },
        { label: 'Switchers View', to: '/home', icon: Home },
        { label: 'Settings', to: '/settings', icon: Settings },
      ]
    : [
        { label: 'Home', to: '/home', icon: Home },
        { label: 'Pod', to: '/pod', icon: Users },
        { label: 'Guide', to: '/guide', icon: Compass },
        { label: 'Goals', to: '/goals', icon: CheckSquare },
        { label: 'Settings', to: '/settings', icon: Settings },
      ];

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] flex flex-col md:flex-row">
      {/* Desktop Sidebar (1280px friendly, thin borders, calm) */}
      <aside aria-label="Main Navigation" className="hidden md:flex flex-col w-64 border-r border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] p-5 shrink-0 justify-between">
        <div className="space-y-6">
          <div className="pt-1 pb-2">
            <BrandMark linkTo={isGuide ? '/guide-home' : '/home'} />
          </div>

          {/* Current user badge */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C]">
            <InitialsAvatar firstName={currentUser.first_name} lastInitial={currentUser.last_initial} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] truncate">
                {currentUser.first_name} {currentUser.last_initial}
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] capitalize truncate">
                {currentUser.role}
                {currentRhythm && !isGuide ? ` • Week ${currentRhythm.week}` : ''}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#102A2E] text-white dark:bg-[#0B1D20]'
                        : 'text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-2">
          {!isGuide && (
            <NavLink
              to="/wrap-up"
              className="block text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] px-3 py-1.5"
            >
              8-Week Wrap-up
            </NavLink>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#A8432C] dark:text-[#E58C73] hover:opacity-80 transition-opacity w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D]">
          <BrandMark linkTo={isGuide ? '/guide-home' : '/home'} />
          <div className="flex items-center gap-2">
            <InitialsAvatar firstName={currentUser.first_name} lastInitial={currentUser.last_initial} size="sm" />
          </div>
        </header>

        <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Tabs (390px mobile first, plain words) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF] dark:bg-[#0E1E1D] border-t border-[#D3DDD8] dark:border-[#2A403C] px-2 py-1.5 flex items-center justify-around">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#102A2E] dark:text-[#F2B134]'
                    : 'text-[#55665F] dark:text-[#A6B8B0]'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
