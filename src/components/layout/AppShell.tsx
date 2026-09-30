import React from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { AppBreadcrumb } from './AppBreadcrumb';
import { OfflineStatusBar } from '../common/OfflineStatusBar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans transition-colors duration-200">
      {/* Offline Status Alert Banner */}
      <OfflineStatusBar />

      {/* Primary Top Header */}
      <TopBar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main
          id="main-content"
          role="main"
          className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12"
        >
          {/* Universal Breadcrumb Navigation */}
          <AppBreadcrumb />

          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};
