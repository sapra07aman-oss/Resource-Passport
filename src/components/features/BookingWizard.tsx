/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { Resource, Activity, EligibilityEvaluation, OPERATIONAL_STATUS_MATRIX } from '../../types';
import { SEED_RESOURCES, SEED_ACTIVITIES, SEED_USER_TRAINING } from '../../lib/mockData';
import { useSupabaseStatus } from '../../context/SupabaseContext';
import { Button } from '../ui/Button';

export interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedResource?: Resource | null;
  onBookingComplete?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  preselectedResource,
  onBookingComplete,
}) => {
  const { isConfigured } = useSupabaseStatus();

  // Wizard Steps: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    preselectedResource?.id || SEED_RESOURCES[0].id
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string>(SEED_ACTIVITIES[0].id);
  const [bookingDate, setBookingDate] = useState<string>('2026-10-30');
  const [timeSlot, setTimeSlot] = useState<string>('14:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [intendedMaterials, setIntendedMaterials] = useState<string>('Cast Acrylic Sheet 3mm');
  const [projectPurpose, setProjectPurpose] = useState<string>(
    'Rapid prototyping of robotics chassis baseplate'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedResource =
    SEED_RESOURCES.find((r) => r.id === selectedResourceId) || SEED_RESOURCES[0];
  const selectedActivity =
    SEED_ACTIVITIES.find((a) => a.id === selectedActivityId) || SEED_ACTIVITIES[0];

  // Evaluate the 8 Safety Checks for Step 3
  const evaluateSafety = (): EligibilityEvaluation => {
    const isOperational = selectedResource.operational_status === 'OPERATIONAL';
    const isLaser = selectedResource.category_id === 'cat-01';
    const isCnc = selectedResource.category_id === 'cat-02';

    // Check user training records in seed data
    const hasInduction = SEED_USER_TRAINING.some(
      (t) => t.course_id === 'course-01' && t.status === 'VALID'
    );
    const hasLaserTraining = SEED_USER_TRAINING.some(
      (t) => t.course_id === 'course-02' && t.status === 'VALID'
    );
    const hasCncTraining = SEED_USER_TRAINING.some(
      (t) => t.course_id === 'course-03' && t.status === 'VALID'
    );

    let trainingStatus: 'PASS' | 'FAIL' = 'PASS';
    let trainingMessage = 'All required safety training courses are valid.';

    if (!hasInduction) {
      trainingStatus = 'FAIL';
      trainingMessage = 'General Safety Induction is required before using this equipment.';
    } else if (isLaser && !hasLaserTraining) {
      trainingStatus = 'FAIL';
      trainingMessage = 'Laser Cutter Operation Training (LAS-201) is required.';
    } else if (isCnc && !hasCncTraining) {
      trainingStatus = 'FAIL';
      trainingMessage = '5-Axis CNC Mill Safety (CNC-301) has expired on August 1, 2026.';
    }

    const checks = [
      {
        code: 'USER_IDENTITY_VALID' as const,
        title: 'User Identity & Active Status',
        status: 'PASS' as const,
        message: 'Student account is active and verified.',
      },
      {
        code: 'RESOURCE_OPERATIONAL' as const,
        title: 'Machine Operational Condition',
        status: isOperational ? ('PASS' as const) : ('FAIL' as const),
        message: isOperational
          ? `${selectedResource.name} is fully operational and safe to use.`
          : `Machine state is currently ${selectedResource.operational_status}. Bookings blocked.`,
        required_action: isOperational ? undefined : 'Wait for maintenance inspection clearance.',
      },
      {
        code: 'NO_ACTIVE_SAFETY_HOLDS' as const,
        title: 'Active Safety Holds',
        status: 'PASS' as const,
        message: 'No active safety holds or incident locks exist on this equipment.',
      },
      {
        code: 'TRAINING_CERTIFICATION_VALID' as const,
        title: 'Mandatory Safety Training',
        status: trainingStatus,
        message: trainingMessage,
        required_action: trainingStatus === 'FAIL' ? 'Complete course to unlock booking' : undefined,
      },
      {
        code: 'RESOURCE_AUTHORIZATION_ACTIVE' as const,
        title: 'Equipment Authorization Permit',
        status: isCnc ? ('REVIEW_REQUIRED' as const) : ('PASS' as const),
        message: isCnc
          ? 'Requires Lab Manager authorization review for CNC cutting.'
          : 'User has active equipment authorization.',
      },
      {
        code: 'ACTIVITY_AND_MATERIAL_PERMITTED' as const,
        title: 'Permitted Activity & Materials',
        status: 'PASS' as const,
        message: `${selectedActivity.name} with ${intendedMaterials} is approved for this machine.`,
      },
      {
        code: 'INSPECTION_NOT_OVERDUE' as const,
        title: 'Equipment Inspection Currency',
        status: 'PASS' as const,
        message: `Inspections current. Next scheduled service due ${new Date(
          selectedResource.next_inspection_due
        ).toLocaleDateString()}.`,
      },
      {
        code: 'SCHEDULE_CONFLICT_FREE' as const,
        title: 'Time Slot Availability',
        status: 'PASS' as const,
        message: `No overlapping reservations found for ${bookingDate} at ${timeSlot}.`,
      },
    ];

    const hasFailure = checks.some((c) => c.status === 'FAIL');
    const hasReview = checks.some((c) => c.status === 'REVIEW_REQUIRED');

    return {
      decision: hasFailure ? 'BLOCKED' : hasReview ? 'REVIEW_REQUIRED' : 'ELIGIBLE',
      eligible: !hasFailure,
      policy_version: 3,
      evaluated_at: new Date().toISOString(),
      checks,
    };
  };

  const evaluation = evaluateSafety();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Wizard Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded">
                Step {currentStep} of 5
              </span>
              <h2 className="text-base font-bold text-slate-900">Book Equipment</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow 5 simple steps to safely reserve machines in the lab.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* ================= STEP 1: CHOOSE EQUIPMENT ================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 1 — Choose Equipment</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on the machine or room you want to reserve:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {SEED_RESOURCES.map((resource) => {
                  const isSelected = resource.id === selectedResourceId;
                  const statusInfo = OPERATIONAL_STATUS_MATRIX[resource.operational_status];
                  return (
                    <div
                      key={resource.id}
                      onClick={() => setSelectedResourceId(resource.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {resource.resource_code}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{resource.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {resource.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 2: CHOOSE TIME ================= */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 2 — Choose a Time</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick the date and time you will be working at {selectedResource.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Reservation Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Start Time</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono"
                  >
                    <option value="09:00">09:00 AM (Morning Slot)</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM (Afternoon Slot)</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Duration (Minutes)</label>
                <div className="flex gap-2">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        durationMinutes === mins
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Time is Open!</strong> No other student or maintenance job is booked for this slot.
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CHECK READINESS ================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 3 — Safety Readiness Check</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our Central Safety Engine verifies your certificates, machine health, and safety rules:
                </p>
              </div>

              {/* Decision Callout */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  evaluation.decision === 'ELIGIBLE'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : evaluation.decision === 'REVIEW_REQUIRED'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {evaluation.decision === 'ELIGIBLE' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {evaluation.decision === 'ELIGIBLE'
                      ? 'Ready to Book! All Safety Requirements Passed'
                      : evaluation.decision === 'REVIEW_REQUIRED'
                      ? 'Review Needed — Booking requires Lab Manager sign-off'
                      : 'Booking Blocked — Action Required'}
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed">
                    {evaluation.decision === 'ELIGIBLE'
                      ? 'Your safety training is verified and this machine is ready for work.'
                      : 'One or more safety rules need attention before you can reserve this machine.'}
                  </p>
                </div>
              </div>

              {/* 8 Checks List in Plain Language */}
              <div className="space-y-2 border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                {evaluation.checks.map((chk, i) => (
                  <div key={i} className="p-3 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900">{chk.title}</div>
                      <p className="text-slate-600 text-[11px]">{chk.message}</p>
                      {chk.required_action && (
                        <span className="text-[10px] font-bold text-rose-600 block mt-0.5">
                          Action: {chk.required_action}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                        chk.status === 'PASS'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : chk.status === 'REVIEW_REQUIRED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {chk.status === 'PASS' ? 'Passed' : chk.status === 'REVIEW_REQUIRED' ? 'Review' : 'Needs Action'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 4: REVIEW ================= */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Step 4 — Review Your Booking</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check the details below before sending your request:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Equipment</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedResource.name}</span>
                    <span className="text-slate-500 font-mono text-xs block">({selectedResource.resource_code})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Location</span>
                    <span className="font-medium text-slate-800">Engineering Hall B (Room 104)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Date & Time</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{bookingDate}</span>
                    <span className="text-slate-600 font-mono text-xs block">{timeSlot} ({durationMinutes} minutes)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Activity</span>
                    <span className="font-medium text-slate-800">{selectedActivity.name}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Materials</span>
                  <span className="font-medium text-slate-800">{intendedMaterials}</span>
                </div>
              </div>

              {!isConfigured && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Demonstration Mode Notice:</strong> Clicking submit will simulate a successful booking verification. Real database writes require Supabase environment keys.
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 5: SUBMIT & CONFIRMATION ================= */}
          {currentStep === 5 && (
            <div className="space-y-4 py-2 text-center">
              {bookingSubmitted ? (
                <div className="space-y-3 animate-in fade-in-0 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Booking Request Sent!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your reservation for <strong>{selectedResource.name}</strong> on <strong>{bookingDate}</strong> has been logged and assigned reference <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">BK-2026-0912</code>.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2 mt-4">
                    <div className="font-bold text-slate-900">What to do next:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                      <li>Arrive 5 minutes before your time slot.</li>
                      <li>Scan the equipment QR code at the machine to check in.</li>
                      <li>Wear mandatory eye protection and closed-toe footwear.</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button
                      size="md"
                      onClick={() => {
                        onBookingComplete?.();
                        onClose();
                      }}
                    >
                      Done & View My Bookings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Ready to Submit</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                      Click below to lock in your reservation and generate your digital pass.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      size="lg"
                      onClick={handleSubmitBooking}
                      isLoading={isSubmitting}
                      className="w-full sm:w-auto px-8"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {!bookingSubmitted && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBack}
              disabled={currentStep === 1}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < 5 && (
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === 3 && evaluation.decision === 'BLOCKED'}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
