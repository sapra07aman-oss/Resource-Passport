/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. RECONCILED 7-ROLE MODEL
export type UserRole =
  | 'STUDENT_RESEARCHER'
  | 'LAB_MANAGER'
  | 'RESOURCE_OWNER'
  | 'SAFETY_OFFICER'
  | 'MAINTENANCE_TECHNICIAN'
  | 'INSTITUTION_ADMINISTRATOR'
  | 'AUDITOR';

export interface RoleDefinition {
  role: UserRole;
  title: string;
  badgeLabel: string;
  description: string;
  scopeDescription: string;
}

export const USER_ROLES_CATALOG: Record<UserRole, RoleDefinition> = {
  STUDENT_RESEARCHER: {
    role: 'STUDENT_RESEARCHER',
    title: 'Student / Researcher',
    badgeLabel: 'Researcher',
    description: 'Browse assets, request bookings, submit check-out/return condition reports, report faults.',
    scopeDescription: 'Self-scope: only personal bookings, records, and accessible public passports.',
  },
  LAB_MANAGER: {
    role: 'LAB_MANAGER',
    title: 'Lab Manager',
    badgeLabel: 'Manager',
    description: 'Manage assigned facility resources, review approval queue, record authorized inspections, impose local operational restrictions.',
    scopeDescription: 'Department/Lab scope: review bookings, signoffs, and operational status.',
  },
  RESOURCE_OWNER: {
    role: 'RESOURCE_OWNER',
    title: 'Resource Owner',
    badgeLabel: 'Owner',
    description: 'Maintain asset metadata, review utilization metrics, assign custodians, propose usage policies.',
    scopeDescription: 'Owned assets scope: oversight and lifecycle configuration.',
  },
  SAFETY_OFFICER: {
    role: 'SAFETY_OFFICER',
    title: 'Safety Officer',
    badgeLabel: 'Safety Officer',
    description: 'Verify training evidence, audit compliance, impose/clear safety holds, investigate safety incidents.',
    scopeDescription: 'Campus safety scope: holds, training verifications, and compliance.',
  },
  MAINTENANCE_TECHNICIAN: {
    role: 'MAINTENANCE_TECHNICIAN',
    title: 'Maintenance Technician',
    badgeLabel: 'Technician',
    description: 'Manage work orders, record inspections, execute calibrations/repairs, recommend return to service.',
    scopeDescription: 'Maintenance scope: work orders, calibrations, and repair logs.',
  },
  INSTITUTION_ADMINISTRATOR: {
    role: 'INSTITUTION_ADMINISTRATOR',
    title: 'Institution Administrator',
    badgeLabel: 'Administrator',
    description: 'Manage users, assign roles, configure departments, manage global policies, review system reports.',
    scopeDescription: 'Full institution administrative scope.',
  },
  AUDITOR: {
    role: 'AUDITOR',
    title: 'Auditor',
    badgeLabel: 'Auditor',
    description: 'Inspect immutable audit logs, verify compliance evidence, export compliance and utilization reports.',
    scopeDescription: 'Read-only compliance audit scope across all logs and history.',
  },
};

// 2. RESOURCE OPERATIONAL STATUSES
export type OperationalStatus =
  | 'OPERATIONAL'
  | 'RESTRICTED'
  | 'UNDER_MAINTENANCE'
  | 'UNDER_INSPECTION'
  | 'OUT_OF_SERVICE'
  | 'RETIRED';

export interface OperationalStatusInfo {
  status: OperationalStatus;
  label: string;
  allowsBookingByDefault: boolean;
  colorClass: string;
  description: string;
}

export const OPERATIONAL_STATUS_MATRIX: Record<OperationalStatus, OperationalStatusInfo> = {
  OPERATIONAL: {
    status: 'OPERATIONAL',
    label: 'Operational',
    allowsBookingByDefault: true,
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    description: 'Fully active, safe for operation, and available for authorized bookings.',
  },
  RESTRICTED: {
    status: 'RESTRICTED',
    label: 'Restricted',
    allowsBookingByDefault: false,
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    description: 'Limited use only. Bookings allowed strictly if explicit activity rules permit.',
  },
  UNDER_MAINTENANCE: {
    status: 'UNDER_MAINTENANCE',
    label: 'Under Maintenance',
    allowsBookingByDefault: false,
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
    description: 'Undergoing planned or corrective servicing. All general bookings blocked.',
  },
  UNDER_INSPECTION: {
    status: 'UNDER_INSPECTION',
    label: 'Under Inspection',
    allowsBookingByDefault: false,
    colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
    description: 'Mandatory inspection due or in progress. Bookings blocked until clearance.',
  },
  OUT_OF_SERVICE: {
    status: 'OUT_OF_SERVICE',
    label: 'Out of Service',
    allowsBookingByDefault: false,
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    description: 'Unsafe, broken, or locked out. Requires formal repairs and safety clearance.',
  },
  RETIRED: {
    status: 'RETIRED',
    label: 'Retired',
    allowsBookingByDefault: false,
    colorClass: 'text-slate-500 bg-slate-100 border-slate-200',
    description: 'Permanently decommissioned. Historical archive only; new bookings prohibited.',
  },
};

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConditionRating = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

// 3. BOOKING STATUSES & CONCURRENCY
export type BookingStatus =
  | 'REQUESTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CHECKED_OUT'
  | 'RETURNED'
  | 'COMPLETED';

// Statuses that hold/reserve the calendar time slot
export const TIME_RESERVING_BOOKING_STATUSES: BookingStatus[] = [
  'REQUESTED',
  'PENDING_APPROVAL',
  'APPROVED',
  'CHECKED_OUT',
];

// 4. CENTRAL SAFETY ELIGIBILITY TYPES
export type EligibilityCheckCode =
  | 'USER_IDENTITY_VALID'
  | 'RESOURCE_OPERATIONAL'
  | 'NO_ACTIVE_SAFETY_HOLDS'
  | 'TRAINING_CERTIFICATION_VALID'
  | 'RESOURCE_AUTHORIZATION_ACTIVE'
  | 'ACTIVITY_AND_MATERIAL_PERMITTED'
  | 'INSPECTION_NOT_OVERDUE'
  | 'SCHEDULE_CONFLICT_FREE'
  | 'APPROVAL_PREREQUISITE_CHECK';

export interface EligibilityCheckItem {
  code: EligibilityCheckCode;
  title: string;
  status: 'PASS' | 'FAIL' | 'REVIEW_REQUIRED' | 'NOT_APPLICABLE';
  message: string;
  required_action?: string;
}

export interface EligibilityEvaluation {
  decision: 'ELIGIBLE' | 'BLOCKED' | 'REVIEW_REQUIRED';
  eligible: boolean;
  policy_version: number;
  evaluated_at: string;
  checks: EligibilityCheckItem[];
}

// 5. CORE ENTITY SCHEMAS (25 Tables)
export interface Department {
  id: string;
  code: string;
  name: string;
  faculty: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  department_id: string;
  full_name: string;
  email: string;
  account_status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  department_id?: string | null;
  assigned_by?: string | null;
  assigned_at: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
}

export interface Location {
  id: string;
  building: string;
  room: string;
  department_id: string;
  access_notes: string;
}

export interface Resource {
  id: string;
  resource_code: string;
  name: string;
  description: string;
  category_id: string;
  location_id: string;
  department_id: string;
  owner_id: string;
  custodian_id: string;
  operational_status: OperationalStatus;
  current_condition: ConditionRating;
  risk_level: RiskLevel;
  serial_number?: string;
  manufacturer?: string;
  model?: string;
  image_url?: string;
  next_inspection_due: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceDocument {
  id: string;
  resource_id: string;
  title: string;
  document_type: 'SOP' | 'MANUAL' | 'CALIBRATION_CERT' | 'SAFETY_GUIDE';
  file_path: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface ResourceStatusHistory {
  id: string;
  resource_id: string;
  previous_status: OperationalStatus;
  new_status: OperationalStatus;
  reason: string;
  changed_by: string;
  changed_at: string;
}

export interface Activity {
  id: string;
  name: string;
  code: string;
  risk_level: RiskLevel;
  description: string;
}

export interface ActivityRequirement {
  id: string;
  activity_id: string;
  category_id?: string | null;
  resource_id?: string | null;
  required_course_id?: string | null;
  requires_supervision: boolean;
  requires_manager_approval: boolean;
  allowed_materials: string[];
  prohibited_materials: string[];
}

export interface SafetyPolicyVersion {
  id: string;
  version_number: number;
  title: string;
  policy_text: string;
  effective_from: string;
  published_by: string;
  is_active: boolean;
}

export interface SafetyHold {
  id: string;
  resource_id: string;
  reason: string;
  severity: 'WARNING' | 'CRITICAL';
  imposed_by: string;
  imposed_at: string;
  cleared_by?: string | null;
  cleared_at?: string | null;
  clearance_notes?: string | null;
}

export interface TrainingCourse {
  id: string;
  course_code: string;
  name: string;
  description: string;
  provider: string;
  validity_days: number | null;
  practical_assessment_required: boolean;
  is_active: boolean;
}

export interface UserTrainingRecord {
  id: string;
  user_id: string;
  course_id: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'VALID' | 'EXPIRED' | 'REVOKED';
  completed_at?: string;
  expires_at?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  evidence_file_path?: string;
}

export interface ResourceAuthorization {
  id: string;
  user_id: string;
  resource_id?: string | null;
  category_id?: string | null;
  scope: 'INDIVIDUAL_RESOURCE' | 'CATEGORY' | 'DEPARTMENT';
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  valid_from: string;
  valid_until?: string | null;
  granted_by: string;
  granted_at: string;
  justification: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  resource_id: string;
  requester_id: string;
  activity_id: string;
  start_at: string;
  end_at: string;
  purpose: string;
  intended_materials?: string;
  status: BookingStatus;
  approval_required: boolean;
  supervision_arrangement?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingApproval {
  id: string;
  booking_id: string;
  reviewer_id: string;
  decision: 'APPROVED' | 'REJECTED' | 'INFO_REQUESTED';
  reason: string;
  reviewed_at: string;
}

export interface BookingEvaluationRecord {
  id: string;
  booking_id?: string | null;
  user_id: string;
  resource_id: string;
  activity_id: string;
  decision: 'ELIGIBLE' | 'BLOCKED' | 'REVIEW_REQUIRED';
  policy_version: number;
  checks_payload: EligibilityCheckItem[];
  evaluated_at: string;
}

export interface HandoverRecord {
  id: string;
  booking_id: string;
  resource_id: string;
  user_id: string;
  handover_type: 'PRE_USE_CHECKOUT' | 'POST_USE_RETURN';
  condition_rating: ConditionRating;
  visible_damage: boolean;
  checklist_answers: Record<string, boolean | string>;
  notes: string;
  evidence_file_path?: string;
  recorded_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  resource_id: string;
  title: string;
  interval_days: number;
  last_performed_at?: string;
  next_due_at: string;
  is_mandatory: boolean;
}

export interface MaintenanceRecord {
  id: string;
  resource_id: string;
  maintenance_type: 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'CALIBRATION' | 'SAFETY_CLEARANCE';
  title: string;
  performed_by: string;
  performed_at: string;
  result: 'PASSED' | 'FAILED' | 'CONDITIONAL';
  notes: string;
  evidence_file_path?: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  resource_id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'COMPLETED' | 'CANCELLED';
  assigned_to?: string | null;
  created_by: string;
  due_at?: string | null;
  completed_at?: string | null;
  resolution_notes?: string;
}

export interface Incident {
  id: string;
  resource_id: string;
  booking_id?: string | null;
  reported_by: string;
  incident_type: 'MALFUNCTION' | 'PHYSICAL_DAMAGE' | 'SAFETY_HAZARD' | 'MISSING_PART' | 'NEAR_MISS';
  severity: RiskLevel;
  description: string;
  status: 'REPORTED' | 'UNDER_INVESTIGATION' | 'RESOLVED';
  assigned_to?: string | null;
  resolution?: string;
  reported_at: string;
  resolved_at?: string | null;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  actor_name?: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  occurred_at: string;
}

export interface AppNotification {
  id: string;
  recipient_id: string;
  event_type: string;
  title: string;
  message: string;
  link_path?: string;
  is_read: boolean;
  created_at: string;
}

// 6. ANTI-AI VERIFICATION & FRAUD PREVENTION TYPES
export type VerificationSource =
  | 'HUMAN_SAFETY_OFFICER'
  | 'INSTITUTIONAL_SSO_LMS'
  | 'PENDING_HUMAN_REVIEW'
  | 'REJECTED_UNVERIFIED_AI';

export interface AntiAIVerificationMetadata {
  is_verified_by_human: boolean;
  verifier_user_id?: string;
  verified_at?: string;
  source: VerificationSource;
  evidence_hash?: string;
  tamper_evident_check: boolean;
  ai_assistance_flag: boolean;
  ai_notes?: string;
}

// 7. UI NAVIGATION TYPES (Simplified for extreme usability)
export type NavigationTab =
  | 'overview'
  | 'resources'
  | 'bookings'
  | 'training'
  | 'maintenance'
  | 'handovers'
  | 'analytics'
  | 'audit'
  | 'administration'
  | 'help';
