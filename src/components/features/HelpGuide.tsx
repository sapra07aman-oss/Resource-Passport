/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  HelpCircle,
  Lightbulb,
  Phone,
  Mail,
  CalendarCheck2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface HelpGuideProps {
  onStartBooking: () => void;
  onExploreEquipment: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({
  onStartBooking,
  onExploreEquipment,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Simple Guide for Everyone</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold font-display text-slate-900">
          How to Use Resource Passport
        </h1>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Everything you need to know in plain language. No complicated words, no confusing jargon.
        </p>
      </div>

      {/* 3 Step Walkthrough */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          How to Use Equipment in 3 Simple Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Find Your Machine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click <strong>Find Equipment</strong> to see all laser cutters, 3D printers, and tools.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Check Safety Rules</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Make sure you have passed the safety course for that machine (like Laser Safety).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Pick a Time & Work</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your time slot, get instant verification, and show up to create your project!
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button size="sm" onClick={onStartBooking}>
            Try Booking Wizard
          </Button>
          <Button size="sm" variant="secondary" onClick={onExploreEquipment}>
            Browse Equipment
          </Button>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions</h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Why is my booking blocked?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              The system automatically checks 8 safety rules before confirming. If a booking is blocked,
              it usually means either: your safety course expired, the machine is under repairs, or
              someone else already booked that time. Check the exact message shown on screen.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>What do the machine status colors mean?</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pl-5 pt-0.5">
              <div>
                <strong className="text-emerald-700">Green (Operational):</strong> Ready to use and
                open for bookings.
              </div>
              <div>
                <strong className="text-amber-700">Yellow (Restricted):</strong> Special permission or
                specific materials required.
              </div>
              <div>
                <strong className="text-orange-700">Orange (Under Maintenance):</strong> Technicians
                are currently servicing the machine.
              </div>
              <div>
                <strong className="text-rose-700">Red (Out of Service / Safety Hold):</strong> Locked
                out for safety. No bookings permitted.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency & Lab Contacts */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <span>Need Human Assistance?</span>
        </h3>
        <p className="text-xs text-slate-300">
          Our workshop managers and safety officers are available during normal campus operating hours.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Campus EHS Safety Desk</div>
              <div className="text-slate-400 text-[11px] font-mono">+1 (555) 019-2834</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-bold text-white">Makerspace Manager</div>
              <div className="text-slate-400 text-[11px] font-mono">makerspace-mgr@university.edu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
