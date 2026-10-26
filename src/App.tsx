import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WalkthroughToolbar } from './components/WalkthroughToolbar';
import { Navigation } from './components/Navigation';
import { ReportModal } from './components/ReportModal';

// Screens
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Objective } from './pages/onboarding/Objective';
import { Story } from './pages/onboarding/Story';
import { Background } from './pages/onboarding/Background';
import { Details } from './pages/onboarding/Details';
import { Confirm } from './pages/onboarding/Confirm';
import { Matching } from './pages/Matching';
import { Guides } from './pages/Guides';
import { GuideDetail } from './pages/GuideDetail';
import { RequestSent } from './pages/RequestSent';
import { PodIntro } from './pages/PodIntro';
import { RhythmSetup } from './pages/RhythmSetup';
import { Home } from './pages/Home';
import { Goals } from './pages/Goals';
import { Pod } from './pages/Pod';
import { GuideSpace } from './pages/GuideSpace';
import { WrapUp } from './pages/WrapUp';
import { Settings } from './pages/Settings';
import { BecomeAGuide } from './pages/guide/BecomeAGuide';
import { GuideHome } from './pages/guide/GuideHome';
import { SwitcherSummary } from './pages/guide/SwitcherSummary';
import { ReachOut } from './pages/guide/ReachOut';
import { AdminHub } from './pages/admin/AdminHub';
import { DatabaseRecords } from './pages/DatabaseRecords';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* End-to-end Walkthrough toolbar for quick review */}
        <WalkthroughToolbar />

        {/* Global Safety Report Modal */}
        <ReportModal />

        {/* Main Application with Responsive Navigation */}
        <Navigation>
          <Routes>
            {/* Public & Landing */}
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Step 2: Objective & 4-Step Story Onboarding */}
            <Route path="/onboarding/objective" element={<Objective />} />
            <Route path="/onboarding/story" element={<Story />} />
            <Route path="/onboarding/background" element={<Background />} />
            <Route path="/onboarding/details" element={<Details />} />
            <Route path="/onboarding/confirm" element={<Confirm />} />

            {/* Matching & Requests */}
            <Route path="/matching" element={<Matching />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/request-sent" element={<RequestSent />} />

            {/* Pod Intro & Rhythm Setup */}
            <Route path="/pod/intro" element={<PodIntro />} />
            <Route path="/rhythm" element={<RhythmSetup />} />

            {/* Active Sprint (Switcher Experience) */}
            <Route path="/home" element={<Home />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/pod" element={<Pod />} />
            <Route path="/guide" element={<GuideSpace />} />
            <Route path="/wrap-up" element={<WrapUp />} />
            <Route path="/settings" element={<Settings />} />

            {/* Guide Experience */}
            <Route path="/become-a-guide" element={<BecomeAGuide />} />
            <Route path="/guide-home" element={<GuideHome />} />
            <Route path="/guide-home/switchers" element={<GuideHome />} />
            <Route path="/guide-home/switcher/:id" element={<SwitcherSummary />} />
            <Route path="/guide-home/reach-out/:promptId" element={<ReachOut />} />

            {/* Admin Hub */}
            <Route path="/admin" element={<AdminHub />} />
            <Route path="/database" element={<DatabaseRecords />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Navigation>
      </BrowserRouter>
    </AppProvider>
  );
}
