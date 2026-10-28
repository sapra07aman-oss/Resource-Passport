/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QrCode, Bell, User, ChevronRight, HelpCircle, Lightbulb } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { useSupabaseStatus } from '../../context/SupabaseContext';
import { useRole } from '../../context/RoleContext';

export interface HeaderProps {
  breadcrumbs?: string[];
  guidedHelpMode?: boolean;
  onToggleGuidedHelp?: () => void;
  onOpenQRScanner?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs = ['Makerspace', 'Resource Passport'],
  guidedHelpMode = false,
  onToggleGuidedHelp,
  onOpenQRScanner,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const { mode } = useSupabaseStatus();
  const { roleDefinition } = useRole();

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 z-30">
      {/* Zone 1: Contextual Breadcrumb Trail */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
        <span className="font-semibold text-slate-800">Campus Facilities</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'font-medium text-slate-900 truncate'
                  : 'truncate hover:text-slate-700'
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Zone 2: Testing Role Switcher & Mode Badge */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <RoleSwitcher />
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded border tracking-tight ${
            mode === 'production'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {mode === 'production' ? 'PROD DB' : 'DEMO MODE'}
        </span>
      </div>

      {/* Zone 3: Primary Action & Profile Affordances */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleGuidedHelp}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border select-none ${
            guidedHelpMode
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Guided Help for step-by-step assistance"
        >
          <Lightbulb className={`w-3.5 h-3.5 ${guidedHelpMode ? 'text-amber-700 fill-amber-500' : 'text-slate-500'}`} />
          <span>{guidedHelpMode ? 'Help Mode: ON' : 'Help Me'}</span>
        </button>

        <button
          onClick={onOpenQRScanner}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Scan asset QR code"
        >
          <QrCode className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden md:inline">Scan Passport QR</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cobalt-600 rounded-full" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          onClick={onOpenProfile}
          className="inline-flex items-center gap-2 p-1 text-xs text-slate-700 hover:text-slate-950 rounded-lg transition-colors"
          title={`Active user as ${roleDefinition.title}`}
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-[11px]">
            {roleDefinition.badgeLabel.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden lg:inline font-medium text-xs text-slate-800">
            Institutional User
          </span>
        </button>
      </div>
    </header>
  );
};
