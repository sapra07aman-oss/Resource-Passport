/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

export type SystemMode = 'production' | 'demonstration';

interface SupabaseContextValue {
  mode: SystemMode;
  isConfigured: boolean;
  supabaseUrl: string | null;
  hasPublishableKey: boolean;
  isConfigDrawerOpen: boolean;
  openConfigDrawer: () => void;
  closeConfigDrawer: () => void;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);

  // Read environment variables directly at runtime
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || null;

  // Determine mode based strictly on whether valid environment configuration exists
  const isConfigured = Boolean(
    supabaseUrl &&
      supabaseUrl.trim().length > 0 &&
      supabaseUrl.startsWith('https://') &&
      publishableKey &&
      publishableKey.trim().length > 0
  );

  const mode: SystemMode = isConfigured ? 'production' : 'demonstration';

  const value = useMemo(
    () => ({
      mode,
      isConfigured,
      supabaseUrl,
      hasPublishableKey: Boolean(publishableKey),
      isConfigDrawerOpen,
      openConfigDrawer: () => setIsConfigDrawerOpen(true),
      closeConfigDrawer: () => setIsConfigDrawerOpen(false),
    }),
    [mode, isConfigured, supabaseUrl, publishableKey, isConfigDrawerOpen]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabaseStatus = (): SupabaseContextValue => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseStatus must be used within a SupabaseProvider');
  }
  return context;
};
