/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, ShieldCheck, Copy, Check, ExternalLink, Terminal } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useSupabaseStatus } from '../../context/SupabaseContext';

export const SupabaseConfigDrawer: React.FC = () => {
  const { isConfigDrawerOpen, closeConfigDrawer, isConfigured, supabaseUrl } = useSupabaseStatus();
  const [copied, setCopied] = useState(false);

  const envSnippet = `# Environment Configuration for Resource Passport
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
`;

  const copySnippet = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isConfigDrawerOpen}
      onClose={closeConfigDrawer}
      title="Supabase Environment Configuration"
      description="Connect Resource Passport to your Supabase PostgreSQL backend"
      maxWidth="lg"
      footer={
        <Button variant="secondary" onClick={closeConfigDrawer}>
          Close Guide
        </Button>
      }
    >
      <div className="space-y-4 text-xs text-slate-600">
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
          <Database className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-900 text-sm">
              Current Status: {isConfigured ? 'Connected (Production Mode)' : 'Demonstration Mode'}
            </div>
            <p className="mt-0.5 text-slate-600">
              {isConfigured
                ? `Connected to Supabase endpoint: ${supabaseUrl}`
                : 'Running in demonstration mode with sample makerspace assets. Real database mutations, bookings, and safety-critical state changes are disabled until Supabase environment variables are configured.'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-slate-600" />
            <span>Secure Configuration Instructions</span>
          </div>
          <p className="text-slate-600">
            For security compliance, API keys must never be stored in browser persistent storage
            (localStorage/sessionStorage) or application database tables. Add your public credentials to{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">.env</code>:
          </p>

          <div className="relative rounded-lg bg-slate-900 text-slate-100 p-3.5 font-mono text-[11px] overflow-x-auto">
            <pre>{envSnippet}</pre>
            <button
              onClick={copySnippet}
              className="absolute top-2.5 right-2.5 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-1"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Security Architecture Invariants</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
            <li>
              <strong>Client Role Security</strong>: Uses only the Supabase Publishable Key. The service-role key is never bundled into frontend assets.
            </li>
            <li>
              <strong>Row-Level Security</strong>: Authorization is enforced at the database layer through PostgreSQL RLS policies in <code className="font-mono">/supabase/migrations/</code>.
            </li>
            <li>
              <strong>PostgreSQL Concurrency</strong>: Overlapping active bookings are blocked via PostgreSQL GiST exclusion constraints.
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-1">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Modal>
  );
};
