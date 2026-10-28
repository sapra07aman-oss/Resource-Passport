/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  Search,
  CalendarCheck2,
  GraduationCap,
  Wrench,
  ClipboardCheck,
  BarChart3,
  FileText,
  Settings2,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { NavigationTab, UserRole } from '../../types';
import { useRole } from '../../context/RoleContext';

export interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  className?: string;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  allowedRoles?: UserRole[];
  category?: 'primary' | 'management';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, className }) => {
  const { currentRole, roleDefinition } = useRole();

  const primaryItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'resources',
      label: 'Find Equipment',
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: <CalendarCheck2 className="w-4 h-4" />,
    },
    {
      id: 'training',
      label: 'My Training',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'help',
      label: 'Help & Guide',
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  const managementItems: NavItem[] = [
    {
      id: 'maintenance',
      label: 'Repairs & Inspections',
      icon: <Wrench className="w-4 h-4" />,
      allowedRoles: ['MAINTENANCE_TECHNICIAN', 'LAB_MANAGER', 'INSTITUTION_ADMINISTRATOR', 'SAFETY_OFFICER'],
    },
    {
      id: 'handovers',
      label: 'Check-ins & Incidents',
      icon: <ClipboardCheck className="w-4 h-4" />,
      allowedRoles: ['LAB_MANAGER', 'SAFETY_OFFICER', 'MAINTENANCE_TECHNICIAN', 'INSTITUTION_ADMINISTRATOR'],
    },
    {
      id: 'analytics',
      label: 'Compliance Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      allowedRoles: ['LAB_MANAGER', 'RESOURCE_OWNER', 'SAFETY_OFFICER', 'INSTITUTION_ADMINISTRATOR', 'AUDITOR'],
    },
    {
      id: 'audit',
      label: 'Audit Records',
      icon: <FileText className="w-4 h-4" />,
      allowedRoles: ['AUDITOR', 'INSTITUTION_ADMINISTRATOR', 'SAFETY_OFFICER', 'LAB_MANAGER'],
    },
    {
      id: 'administration',
      label: 'System Admin',
      icon: <Settings2 className="w-4 h-4" />,
      allowedRoles: ['INSTITUTION_ADMINISTRATOR'],
    },
  ];

  const visibleManagementItems = managementItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(currentRole)
  );

  return (
    <aside
      className={`w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none ${className || ''}`}
    >
      {/* Brand & Wordmark Zone */}
      <div className="h-14 px-5 flex items-center gap-3 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-sm tracking-tight text-white leading-none">
            Resource Passport
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1 uppercase">
            Safe Institutional Access
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {/* Core Actions */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Everyday Actions
          </div>
          {primaryItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role-Specific Management (Only displayed when allowed) */}
        {visibleManagementItems.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Staff Management
            </div>
            {visibleManagementItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Active Persona Footer Summary */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/60">
        <div className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Current Profile
          </div>
          <div className="text-xs font-semibold text-white truncate mt-0.5">
            {roleDefinition.title}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            {roleDefinition.badgeLabel} scope
          </div>
        </div>
      </div>
    </aside>
  );
};
