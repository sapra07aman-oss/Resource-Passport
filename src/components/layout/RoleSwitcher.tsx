/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Shield, ChevronDown, Check, UserCheck, Info } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { UserRole, USER_ROLES_CATALOG } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setRole, roleDefinition } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = Object.values(USER_ROLES_CATALOG);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-2xs whitespace-nowrap"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5 text-slate-500">
          <Shield className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[11px] uppercase tracking-wider text-slate-400">Persona:</span>
        </span>
        <span className="font-semibold text-slate-900">{roleDefinition.badgeLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-80 rounded-xl bg-white shadow-xl border border-slate-200 p-2 divide-y divide-slate-100 animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <UserCheck className="w-4 h-4 text-slate-700" />
              <span>Institutional Persona Switcher</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-tight">
              Testing aid for reviewing role-scoped navigation and permissions. Does not bypass backend RLS.
            </p>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto space-y-0.5">
            {roles.map((item) => {
              const isSelected = item.role === currentRole;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    setRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-slate-900" />
                    ) : (
                      <div className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1 rounded bg-slate-200/80 text-slate-700">
                        {item.badgeLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 bg-slate-50/80 rounded-b-lg flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>Scope: {roleDefinition.scopeDescription}</span>
          </div>
        </div>
      )}
    </div>
  );
};
