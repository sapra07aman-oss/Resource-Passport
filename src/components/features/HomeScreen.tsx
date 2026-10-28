/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Search,
  CalendarPlus,
  GraduationCap,
  Calendar,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useSupabaseStatus } from '../../context/SupabaseContext';
import { NavigationTab, Resource, OPERATIONAL_STATUS_MATRIX } from '../../types';
import { SEED_RESOURCES, SEED_BOOKINGS, SEED_USER_TRAINING } from '../../lib/mockData';
import { Button } from '../ui/Button';

export interface HomeScreenProps {
  onNavigate: (tab: NavigationTab) => void;
  onStartBooking: (resource?: Resource) => void;
  guidedHelpMode: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onStartBooking,
  guidedHelpMode,
}) => {
  const { currentRole, roleDefinition } = useRole();
  const { isConfigured } = useSupabaseStatus();

  // Calculate user-friendly training counts
  const validTrainingCount = SEED_USER_TRAINING.filter((t) => t.status === 'VALID').length;
  const expiredTrainingCount = SEED_USER_TRAINING.filter((t) => t.status === 'EXPIRED').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Welcoming Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Welcome to Campus Makerspace</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
            What would you like to build today?
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Reserve machines safely, check your safety certificates, and get into the workshop in minutes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              size="md"
              onClick={() => onNavigate('resources')}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Find Equipment
            </Button>
            <Button
              size="md"
              variant="secondary"
              onClick={() => onStartBooking()}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              leftIcon={<CalendarPlus className="w-4 h-4" />}
            >
              Book Equipment
            </Button>
          </div>
        </div>

        {/* Persona quick indicator in hero */}
        <div className="absolute right-6 top-6 hidden lg:flex flex-col items-end text-right">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Signed in as
          </span>
          <span className="text-sm font-bold text-white">{roleDefinition.title}</span>
          <span className="text-xs text-blue-300 font-mono mt-0.5">{roleDefinition.badgeLabel} Profile</span>
        </div>
      </div>

      {/* 2. Optional Guided Help Callout */}
      {guidedHelpMode && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs animate-in fade-in-0 duration-150">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm text-amber-950 flex items-center gap-2">
              <span>Guided Help is Active</span>
              <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded font-mono">Step-by-Step</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              <strong>Tip for Beginners:</strong> To use any machine, follow 3 easy steps:
              1. Click <em>Find Equipment</em> to see what machines are in the lab.
              2. Make sure your <em>Safety Training</em> is completed.
              3. Click <em>Book Equipment</em> to choose your time. Our system checks everything automatically!
            </p>
          </div>
        </div>
      )}

      {/* 3. Five-Year-Old Simple Action Cards (Big, recognizable, obvious) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Quick Actions</span>
          <span className="text-xs font-normal text-slate-500">— Choose what you need to do</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Find Equipment */}
          <div
            onClick={() => onNavigate('resources')}
            className="group cursor-pointer p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-3 relative"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                Find Equipment
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Search for laser cutters, 3D printers, CNC mills, and testing benches.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-blue-600 gap-1">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Book Equipment */}
          <div
            onClick={() => onStartBooking()}
            className="group cursor-pointer p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-3 relative"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                Book Equipment
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Choose a machine and time slot with automatic safety & qualification checks.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-emerald-600 gap-1">
              <span>Start 5-Step Wizard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: My Training */}
          <div
            onClick={() => onNavigate('training')}
            className="group cursor-pointer p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all space-y-3 relative"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                  My Training
                </h3>
                {expiredTrainingCount > 0 && (
                  <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {expiredTrainingCount} Expired
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                See your active safety certificates and what is required before using machines.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-indigo-600 gap-1">
              <span>{validTrainingCount} Courses Active</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: My Bookings */}
          <div
            onClick={() => onNavigate('bookings')}
            className="group cursor-pointer p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all space-y-3 relative"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                  My Bookings
                </h3>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                  {SEED_BOOKINGS.length} Scheduled
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                View your upcoming reservations, check-in instructions, and time slots.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-amber-700 gap-1">
              <span>View Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Help & Guides */}
          <div
            onClick={() => onNavigate('help')}
            className="group cursor-pointer p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all space-y-3 relative"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-900 transition-colors">
                Help & Guides
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Simple answers to common questions, safety guidelines, and emergency contacts.
              </p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-slate-700 gap-1">
              <span>Read Plain-Language FAQ</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Equipment Spotlight Strip (Easy to browse & Understand) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Popular Workshop Equipment</h2>
            <p className="text-xs text-slate-500">
              Clear availability states verified by institutional rules.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('resources')}>
            View All ({SEED_RESOURCES.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SEED_RESOURCES.slice(0, 3).map((res) => {
            const statusInfo = OPERATIONAL_STATUS_MATRIX[res.operational_status];
            return (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 hover:shadow-xs transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                      {res.resource_code}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusInfo.colorClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{res.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {res.risk_level} Risk
                  </span>
                  <Button
                    size="sm"
                    variant={statusInfo.status === 'OPERATIONAL' ? 'primary' : 'secondary'}
                    onClick={() => onStartBooking(res)}
                  >
                    {statusInfo.status === 'OPERATIONAL' ? 'Book Machine' : 'Check Rules'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
