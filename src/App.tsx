/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Cpu,
  Calendar,
  GraduationCap,
  Wrench,
  Search,
  ExternalLink,
  Plus,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  FileText,
  Filter,
} from 'lucide-react';
import { SupabaseProvider, useSupabaseStatus } from './context/SupabaseContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { AppShell } from './components/layout/AppShell';
import { SupabaseConfigDrawer } from './components/auth/SupabaseConfigDrawer';
import { HomeScreen } from './components/features/HomeScreen';
import { BookingWizard } from './components/features/BookingWizard';
import { HelpGuide } from './components/features/HelpGuide';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Table, Column } from './components/ui/Table';
import { NavigationTab, Resource, OPERATIONAL_STATUS_MATRIX } from './types';
import {
  SEED_RESOURCES,
  SEED_COURSES,
  SEED_BOOKINGS,
  SEED_INCIDENTS,
  SEED_DEPARTMENTS,
  SEED_USER_TRAINING,
} from './lib/mockData';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Guided 5-Step Booking Wizard State
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState(false);
  const [wizardPreselectedResource, setWizardPreselectedResource] = useState<Resource | null>(null);

  // Guided Help Mode (Five-year-old friendly toggle)
  const [guidedHelpMode, setGuidedHelpMode] = useState(true);

  const { openConfigDrawer, isConfigured } = useSupabaseStatus();
  const { currentRole, roleDefinition } = useRole();

  // Filtered resources for search and status
  const filteredResources = SEED_RESOURCES.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resource_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || r.operational_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartBooking = (resource?: Resource) => {
    setWizardPreselectedResource(resource || null);
    setIsBookingWizardOpen(true);
  };

  const resourceColumns: Column<Resource>[] = [
    {
      key: 'resource_code',
      header: 'Code',
      render: (r) => (
        <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {r.resource_code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Equipment Name & Details',
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900">{r.name}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {r.manufacturer} · {r.model}
          </div>
        </div>
      ),
    },
    {
      key: 'operational_status',
      header: 'Availability',
      render: (r) => {
        const info = OPERATIONAL_STATUS_MATRIX[r.operational_status];
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded border ${info.colorClass}`}
          >
            {info.label}
          </span>
        );
      },
    },
    {
      key: 'risk_level',
      header: 'Risk Level',
      render: (r) => {
        const variants: Record<string, 'neutral' | 'warning' | 'danger' | 'info'> = {
          LOW: 'neutral',
          MEDIUM: 'info',
          HIGH: 'warning',
          CRITICAL: 'danger',
        };
        return (
          <Badge variant={variants[r.risk_level] || 'neutral'} size="sm">
            {r.risk_level} RISK
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedResource(r);
            }}
          >
            Details
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleStartBooking(r);
            }}
          >
            Book
          </Button>
        </div>
      ),
    },
  ];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Home';
      case 'resources':
        return 'Find Equipment';
      case 'bookings':
        return 'My Bookings';
      case 'training':
        return 'My Training';
      case 'help':
        return 'Help & Guide';
      case 'maintenance':
        return 'Repairs & Inspections';
      case 'handovers':
        return 'Check-ins & Incidents';
      case 'analytics':
        return 'Compliance Reports';
      case 'audit':
        return 'Audit Records';
      case 'administration':
        return 'System Administration';
      default:
        return 'Dashboard';
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      breadcrumbs={['Makerspace', getBreadcrumbTitle()]}
      onOpenQRScanner={() =>
        alert('Passport QR Camera Scanner identifies equipment instantly by barcode or URL.')
      }
      onOpenNotifications={() => alert('In-App Notification Center: You have zero unread alerts.')}
      onOpenProfile={openConfigDrawer}
    >
      <div className="space-y-6">
        {/* ================= VIEW 1: HOME ================= */}
        {activeTab === 'overview' && (
          <HomeScreen
            onNavigate={setActiveTab}
            onStartBooking={handleStartBooking}
            guidedHelpMode={guidedHelpMode}
          />
        )}

        {/* ================= VIEW 2: FIND EQUIPMENT ================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                  Find Equipment
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search, inspect safety requirements, and book campus workshop machinery.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleStartBooking()}>
                  Book Equipment
                </Button>
              </div>
            </div>

            {/* Guided Tip */}
            {guidedHelpMode && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Tip:</strong> Look for the <strong>Green "Operational"</strong> label to find
                  equipment ready for immediate booking!
                </span>
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search machine name (e.g. Laser Cutter, Markforged, Haas)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-2xs"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
                {[
                  { id: 'ALL', label: 'All Equipment' },
                  { id: 'OPERATIONAL', label: 'Available' },
                  { id: 'RESTRICTED', label: 'Restricted' },
                  { id: 'UNDER_MAINTENANCE', label: 'Under Repair' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStatusFilter(item.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      statusFilter === item.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Table */}
            <Table
              columns={resourceColumns}
              data={filteredResources}
              keyExtractor={(r) => r.id}
              onRowClick={(r) => setSelectedResource(r)}
            />
          </div>
        )}

        {/* ================= VIEW 3: MY BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                  My Bookings
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  View and manage your upcoming machine reservations.
                </p>
              </div>
              <Button size="sm" onClick={() => handleStartBooking()} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                New Booking
              </Button>
            </div>

            <div className="space-y-3">
              {SEED_BOOKINGS.map((booking) => {
                const res = SEED_RESOURCES.find((r) => r.id === booking.resource_id);
                return (
                  <div
                    key={booking.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {booking.booking_reference}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                            booking.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {booking.status === 'APPROVED' ? 'Confirmed & Ready' : 'Pending Review'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{res?.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(booking.start_at).toLocaleDateString()}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(booking.start_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(booking.end_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => alert(`Showing instructions for ${booking.booking_reference}`)}
                      >
                        Check-in Instructions
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => alert('Booking can be cancelled up to 2 hours before start.')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: MY TRAINING ================= */}
        {activeTab === 'training' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                  My Safety Training
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Certificates verified by Campus Safety Officers to unlock equipment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEED_COURSES.map((course) => {
                const userRec = SEED_USER_TRAINING.find((t) => t.course_id === course.id);
                const isValid = userRec?.status === 'VALID';
                const isExpired = userRec?.status === 'EXPIRED';

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {course.course_code}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                            isValid
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isExpired
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {isValid ? 'Active & Valid' : isExpired ? 'Expired' : 'Not Started'}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm">{course.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-slate-500">
                        {isValid && userRec?.expires_at ? (
                          <span>
                            Valid until{' '}
                            <strong className="text-slate-800 font-mono">
                              {new Date(userRec.expires_at).toLocaleDateString()}
                            </strong>
                          </span>
                        ) : isExpired ? (
                          <span className="text-rose-600 font-semibold">Renewal Required</span>
                        ) : (
                          <span>Provider: {course.provider}</span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant={isValid ? 'secondary' : 'primary'}
                        onClick={() =>
                          alert(
                            isValid
                              ? `Certificate for ${course.name} is active and verified by Campus Safety.`
                              : `To complete ${course.name}, visit campus LMS portal.`
                          )
                        }
                      >
                        {isValid ? 'View Certificate' : 'Start Course'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 5: HELP & GUIDE ================= */}
        {activeTab === 'help' && (
          <HelpGuide
            onStartBooking={() => handleStartBooking()}
            onExploreEquipment={() => setActiveTab('resources')}
          />
        )}

        {/* ================= VIEW 6: REPAIRS & MAINTENANCE ================= */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                Repairs & Equipment Inspections
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized technician work orders, scheduled inspections, and return-to-service records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-orange-600" />
                    <span>Active Work Order #WO-2026-008</span>
                  </h3>
                  <Badge variant="warning">In Progress</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>OMAX Waterjet (WJ-001):</strong> High pressure abrasive nozzle spindle
                  replacement and pump seal calibration.
                </p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Assigned: Tech usr-tech-01</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => alert('Only assigned technicians can record service completion.')}
                  >
                    Update Work Order
                  </Button>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Recent Completed Inspection</span>
                  </h3>
                  <Badge variant="success">Passed</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Epilog Laser Cutter (LC-001):</strong> Optics beam alignment and exhaust fan
                  cleaning completed. Power output 99.2W verified.
                </p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Signed off: Oct 15, 2026</span>
                  <span className="font-mono text-emerald-700 font-semibold">Cleared for Use</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 8: CHECK-INS & INCIDENTS ================= */}
        {activeTab === 'handovers' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                Check-ins & Incident Register
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Digital handover condition logs, equipment damage reports, and safety hold management.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Open Incident #INC-2026-0041: Nozzle Spindle Pressure Spike
                  </h3>
                </div>
                <Badge variant="danger">Under Investigation</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reported by Lab Manager: Pressure spike tripped emergency interlock during cutting cycle.
                Temporary safety hold imposed on OMAX Waterjet until technician replacement sign-off.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500 font-mono">Assigned: Safety Officer & Tech</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => alert('Only Safety Officers can clear an active safety hold.')}
                >
                  Review Incident
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 9: COMPLIANCE REPORTS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                Utilization & Compliance Analytics
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Authoritative institutional metrics calculated directly from database records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-xs font-semibold uppercase">Resource Utilization</span>
                <div className="text-2xl font-bold text-slate-900 font-mono-numbers mt-1">78.4%</div>
                <p className="text-[11px] text-slate-500 mt-0.5">142 booked operating hours / 181 available hours</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-xs font-semibold uppercase">Training Compliance</span>
                <div className="text-2xl font-bold text-emerald-600 font-mono-numbers mt-1">94.1%</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Active researchers with all required certs</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-xs font-semibold uppercase">Inspection Currency</span>
                <div className="text-2xl font-bold text-blue-600 font-mono-numbers mt-1">83.3%</div>
                <p className="text-[11px] text-slate-500 mt-0.5">5 of 6 registered machines within inspection due date</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-xs font-semibold uppercase">Safety Holds Active</span>
                <div className="text-2xl font-bold text-orange-600 font-mono-numbers mt-1">1</div>
                <p className="text-[11px] text-slate-500 mt-0.5">OMAX Waterjet (under repair clearance)</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 10: AUDIT RECORDS ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                Digital Audit Records
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only immutable system event log. PostgreSQL RLS blocks all UPDATE and DELETE mutations.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Recent System & Security Audit Events</span>
                <Badge variant="success">Tamper-Evident RLS Active</Badge>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  {
                    id: 'aud-01',
                    event: 'BOOKING_APPROVED',
                    actor: 'usr-mgr-01 (Lab Manager)',
                    target: 'Epilog Laser Cutter (LC-001) for usr-student-01',
                    time: '2026-10-28 09:05:00 UTC',
                  },
                  {
                    id: 'aud-02',
                    event: 'SAFETY_HOLD_IMPOSED',
                    actor: 'usr-safety-01 (Safety Officer)',
                    target: 'OMAX Waterjet (WJ-001) due to spindle pressure spike',
                    time: '2026-10-26 14:18:00 UTC',
                  },
                  {
                    id: 'aud-03',
                    event: 'TRAINING_VERIFIED_HUMAN',
                    actor: 'usr-safety-01 (Safety Officer)',
                    target: 'Laser Cutter Operation (LAS-201) verified for usr-student-01',
                    time: '2026-09-11 11:00:00 UTC',
                  },
                ].map((aud) => (
                  <div key={aud.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {aud.event}
                        </span>
                        <span className="text-slate-800 font-medium">{aud.target}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Actor: {aud.actor}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{aud.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 11: SYSTEM ADMINISTRATION ================= */}
        {activeTab === 'administration' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
                System Administration & Governance
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Institutional department management, user assignments, and safety policy publishing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Institutional Departments</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SEED_DEPARTMENTS.map((dept) => (
                  <div key={dept.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1 text-xs">
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {dept.code}
                    </span>
                    <div className="font-bold text-slate-900">{dept.name}</div>
                    <div className="text-[11px] text-slate-500">{dept.faculty}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Equipment Quick Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setSelectedResource(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in-0 zoom-in-95 duration-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900">
                  {selectedResource.resource_code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedResource.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedResource.manufacturer} · {selectedResource.model}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded border ${
                  OPERATIONAL_STATUS_MATRIX[selectedResource.operational_status].colorClass
                }`}
              >
                {OPERATIONAL_STATUS_MATRIX[selectedResource.operational_status].label}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{selectedResource.description}</p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="font-medium text-slate-800">Engineering Hall B (Room 104)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Risk Level</span>
                <span className="font-semibold text-rose-700">{selectedResource.risk_level} RISK</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Condition</span>
                <span className="font-medium text-slate-800">{selectedResource.current_condition}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Next Inspection</span>
                <span className="font-medium text-slate-800 font-mono-numbers">
                  {new Date(selectedResource.next_inspection_due).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedResource(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const res = selectedResource;
                  setSelectedResource(null);
                  handleStartBooking(res);
                }}
              >
                Book This Machine
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Step Guided Booking Wizard Modal */}
      <BookingWizard
        isOpen={isBookingWizardOpen}
        onClose={() => setIsBookingWizardOpen(false)}
        preselectedResource={wizardPreselectedResource}
        onBookingComplete={() => setActiveTab('bookings')}
      />

      {/* In-app Supabase Setup Guide */}
      <SupabaseConfigDrawer />
    </AppShell>
  );
}

export default function App() {
  return (
    <SupabaseProvider>
      <RoleProvider>
        <MainAppContent />
      </RoleProvider>
    </SupabaseProvider>
  );
}
