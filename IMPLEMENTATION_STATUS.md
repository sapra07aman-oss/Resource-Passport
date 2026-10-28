# Resource Passport — Implementation Status

> **CRITICAL INSTRUCTION FOR ALL AI ASSISTANTS & PROMPTS**:
> Before making any code modifications or proposing next steps, you MUST read this file in full using `view_file`.
> Inspect the existing project files before modifying anything. Do NOT regenerate or rewrite previously completed files unnecessarily.
> Implement strictly one phase at a time. Preserve all existing features, security rules, and architecture.

***

## Current System State

*   **Active Implementation Phase**: Phase 1 Core + UX & Anti-AI Transformation (COMPLETED & VERIFIED).
*   **Target Backend**: Supabase (PostgreSQL 16 + RLS + Supabase Auth + Supabase Storage).
*   **Operating Mode**: Demonstration Mode active (until `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are configured in `.env`).
*   **Roles Supported**: 7 reconciled roles (`STUDENT_RESEARCHER`, `LAB_MANAGER`, `RESOURCE_OWNER`, `SAFETY_OFFICER`, `MAINTENANCE_TECHNICIAN`, `INSTITUTION_ADMINISTRATOR`, `AUDITOR`).
*   **Catalog Domain**: Engineering Makerspace & Advanced FabLab (LC-001 Laser, CM-002 CNC, PR-001 3D Printer, EW-001 Electronics Bench, WJ-001 Waterjet, CR-001 Cleanroom).
*   **Database Tables Documented**: 25 tables across 8 domains.

***

## Phase-by-Phase Progress Log

### Phase 1: Project Foundation, Routing, Design System & Reusable Components
*   **Status**: COMPLETED & VERIFIED.
*   **Deliverables**: App shell, clean 3-zone header, responsive sidebar, standard UI primitives, and the demonstration banner.

### Usability & Anti-AI Transformation: Extremely Simple, Five-Year-Old Friendly & Secure
*   **Status**: COMPLETED & VERIFIED.
*   **Files Created**:
    *   `/src/components/features/HomeScreen.tsx`: Personalized home screen with large, unmistakable action cards ("Find Equipment", "Book Equipment", "My Training", "My Bookings", "Help & Guides") with plain English explanations and zero technical jargon.
    *   `/src/components/features/BookingWizard.tsx`: Guided 5-step booking wizard (Choose Equipment -> Choose Time -> Check Readiness [8 safety checks] -> Review -> Submit) with progress indicator, conflict prevention, and clear explainable next steps.
    *   `/src/components/features/HelpGuide.tsx`: Simple FAQ written for beginners ("How do I use a laser cutter?", "Why is a machine blocked?", "What do the status colors mean?").
*   **Files Modified**:
    *   `/src/types/index.ts`: Updated `NavigationTab`.
    *   `/src/components/layout/Header.tsx`: Added "Help Me Mode" toggle button in the top bar.
    *   `/src/components/layout/Sidebar.tsx`: Simplified navigation labels ("Home", "Find Equipment", "My Bookings", "My Training", "Help & Guide", and role-scoped staff management).
    *   `/src/App.tsx`: Bound HomeScreen, BookingWizard, and HelpGuide with search and status filtering.
*   **Test Results**:
    *   `compile_applet`: Passed.
    *   `lint_applet` (`tsc --noEmit`): Passed (zero type errors).
*   **Anti-AI & Usability Invariants Verified**:
    *   No AI output can automatically grant safety credentials or clear holds.
    *   All buttons and action triggers have explicit, plain-English text labels and high-contrast styling.
    *   Demonstration mode blocks live database commits with an explicit, non-misleading advisory.

***

## Next Phase: Phase 2

*   **Target**: Supabase Configuration, Database Migrations (25 Tables), RLS Policies & Authentication.
*   **Planned Deliverables**:
    1.  `/supabase/migrations/20261028000001_initial_schema.sql`: Full DDL for all 25 tables.
    2.  `/supabase/migrations/20261028000002_rls_and_concurrency.sql`: Row-Level Security policies + GiST booking exclusion constraint (`btree_gist`).
    3.  `/supabase/migrations/20261028000003_seed_data.sql`: Seed data for PostgreSQL.
    4.  `/src/lib/supabaseClient.ts`: Supabase client initialization.
    5.  `/src/features/auth/useAuth.ts`: Supabase session and user profile management.
    6.  Update `/IMPLEMENTATION_STATUS.md`.
