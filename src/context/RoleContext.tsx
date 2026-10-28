/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserRole, USER_ROLES_CATALOG, RoleDefinition } from '../types';

interface RolePermissions {
  canRequestBookings: boolean;
  canApproveBookings: boolean;
  canManageResources: boolean;
  canImposeSafetyHolds: boolean;
  canClearSafetyHolds: boolean;
  canVerifyTraining: boolean;
  canManageWorkOrders: boolean;
  canManageUsersAndRoles: boolean;
  canViewAuditLogs: boolean;
  canExportReports: boolean;
}

interface RoleContextValue {
  currentRole: UserRole;
  roleDefinition: RoleDefinition;
  setRole: (role: UserRole) => void;
  permissions: RolePermissions;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRole] = useState<UserRole>('STUDENT_RESEARCHER');

  const roleDefinition = USER_ROLES_CATALOG[currentRole];

  const permissions = useMemo<RolePermissions>(() => {
    switch (currentRole) {
      case 'STUDENT_RESEARCHER':
        return {
          canRequestBookings: true,
          canApproveBookings: false,
          canManageResources: false,
          canImposeSafetyHolds: false,
          canClearSafetyHolds: false,
          canVerifyTraining: false,
          canManageWorkOrders: false,
          canManageUsersAndRoles: false,
          canViewAuditLogs: false,
          canExportReports: false,
        };
      case 'LAB_MANAGER':
        return {
          canRequestBookings: true,
          canApproveBookings: true,
          canManageResources: true,
          canImposeSafetyHolds: true,
          canClearSafetyHolds: false,
          canVerifyTraining: false,
          canManageWorkOrders: true,
          canManageUsersAndRoles: false,
          canViewAuditLogs: true,
          canExportReports: true,
        };
      case 'RESOURCE_OWNER':
        return {
          canRequestBookings: true,
          canApproveBookings: true,
          canManageResources: true,
          canImposeSafetyHolds: true,
          canClearSafetyHolds: false,
          canVerifyTraining: false,
          canManageWorkOrders: false,
          canManageUsersAndRoles: false,
          canViewAuditLogs: true,
          canExportReports: true,
        };
      case 'SAFETY_OFFICER':
        return {
          canRequestBookings: false,
          canApproveBookings: true,
          canManageResources: false,
          canImposeSafetyHolds: true,
          canClearSafetyHolds: true,
          canVerifyTraining: true,
          canManageWorkOrders: false,
          canManageUsersAndRoles: false,
          canViewAuditLogs: true,
          canExportReports: true,
        };
      case 'MAINTENANCE_TECHNICIAN':
        return {
          canRequestBookings: false,
          canApproveBookings: false,
          canManageResources: false,
          canImposeSafetyHolds: true,
          canClearSafetyHolds: false,
          canVerifyTraining: false,
          canManageWorkOrders: true,
          canManageUsersAndRoles: false,
          canViewAuditLogs: true,
          canExportReports: false,
        };
      case 'INSTITUTION_ADMINISTRATOR':
        return {
          canRequestBookings: true,
          canApproveBookings: true,
          canManageResources: true,
          canImposeSafetyHolds: true,
          canClearSafetyHolds: true,
          canVerifyTraining: true,
          canManageWorkOrders: true,
          canManageUsersAndRoles: true,
          canViewAuditLogs: true,
          canExportReports: true,
        };
      case 'AUDITOR':
        return {
          canRequestBookings: false,
          canApproveBookings: false,
          canManageResources: false,
          canImposeSafetyHolds: false,
          canClearSafetyHolds: false,
          canVerifyTraining: false,
          canManageWorkOrders: false,
          canManageUsersAndRoles: false,
          canViewAuditLogs: true,
          canExportReports: true,
        };
    }
  }, [currentRole]);

  const value = useMemo(
    () => ({
      currentRole,
      roleDefinition,
      setRole,
      permissions,
    }),
    [currentRole, roleDefinition, permissions]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = (): RoleContextValue => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
