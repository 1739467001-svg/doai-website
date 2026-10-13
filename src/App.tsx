/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RouterView } from './components/router/RouterView';
import { LoginModal } from './components/modals/LoginModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { PolicyModal } from './components/modals/PolicyModal';
import { Sparkles, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeRoute } = useApp();

  // Reset scroll on navigation. A sub-route such as "conference/schedule"
  // is handled by the target view, which scrolls to its own section — so we
  // must not start a competing smooth scroll here, or the two animations race
  // and the user ends up parked in the middle of the page.
  useEffect(() => {
    const isSubRoute = String(activeRoute).includes('/');
    if (isSubRoute) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeRoute]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      {/* Main Top Navigation */}
      <Navbar />

      {/* Main Body View — resolved by the route table */}
      <main className="flex-1">
        <RouterView />
      </main>

      {/* Global Modals & Drawers */}
      <LoginModal />
      <NotificationDrawer />
      <PolicyModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
