/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Database, ArrowRight } from 'lucide-react';
import { useSupabaseStatus } from '../../context/SupabaseContext';

export const DemonstrationBanner: React.FC = () => {
  const { mode, openConfigDrawer } = useSupabaseStatus();

  if (mode === 'production') {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-300/40 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-semibold tracking-wide uppercase text-[11px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900">
          Demonstration Mode
        </span>
        <span className="text-amber-800">
          Simulated browsing only. Live Supabase credentials are unconfigured. Real bookings, state mutations, and safety-critical operations are disabled.
        </span>
      </div>
      <button
        onClick={openConfigDrawer}
        className="inline-flex items-center gap-1 font-medium text-amber-900 underline hover:text-amber-950 transition-colors cursor-pointer shrink-0"
      >
        <Database className="w-3.5 h-3.5" />
        <span>Supabase Setup Guide</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
