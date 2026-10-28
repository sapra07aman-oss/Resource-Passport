/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemonstrationBanner } from './DemonstrationBanner';
import { NavigationTab } from '../../types';

export interface AppShellProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  breadcrumbs?: string[];
  onOpenQRScanner?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  breadcrumbs,
  onOpenQRScanner,
  onOpenNotifications,
  onOpenProfile,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          onSelectTab(tab);
          setMobileMenuOpen(false);
        }}
        className="hidden md:flex"
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden flex">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              onSelectTab(tab);
              setMobileMenuOpen(false);
            }}
            className="flex w-full"
          />
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemonstrationBanner />
        <Header
          breadcrumbs={breadcrumbs}
          onOpenQRScanner={onOpenQRScanner}
          onOpenNotifications={onOpenNotifications}
          onOpenProfile={onOpenProfile}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
