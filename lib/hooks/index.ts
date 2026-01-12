export { useAuth, isEmployee, isHR, isCHRO, isAdmin } from './use-auth'
export { useJobs, useJob, useRecommendedJobs, useRecentJobs, useSavedJobs, useSaveJob } from './use-jobs'
export {
  useApplications,
  useApplication,
  useSubmitApplication,
  useWithdrawApplication,
  useApplicationsPaginated,
  useUpdateApplicationStatus,
  useBulkUpdateApplicationStatus,
  useApplicantDetail,
  useAdjacentApplicationIds,
} from './use-applications'
export { useDebounce } from './use-debounce'
export { useFilters, type JobFiltersState } from './use-filters'
export { useCHRODashboard, type TimeRange, type CHRODashboardData } from './use-chro'
export {
  useAdminDashboard,
  useTriggerSync,
  useResolveError,
  useTriggerFullSync,
  useClearCache,
  useExportData,
  useCreateBackup,
  type AdminTimeRange,
  type AdminDashboardData,
  type ActivityLogEntry,
  type CompanySyncStatus,
  type ErrorLogEntry,
} from './use-admin'

// Companies Admin Hooks
export {
  useCompaniesAdmin,
  useCompanyAdmin,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  useToggleCompanyStatus,
  useBulkCompanyStatus,
  type CompanyFormData,
  type CompanyWithStats,
  type CompanyFiltersAdmin,
  type CompanyStatus,
} from './use-companies-admin'

// Users Admin Hooks
export {
  useUsersAdmin,
  useUserAdmin,
  useUserCountsByRole,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetUserPassword,
  useBulkUpdateRole,
  useBulkUpdateStatus,
  useBulkResetPasswords,
  type UserFormData,
  type UserFiltersAdmin,
  type UserWithCompany,
  type UserStatus,
} from './use-users-admin'

// Sync Admin Hooks
export {
  useSyncConfigs,
  useSyncConfig,
  useSyncStats,
  useSyncLogs,
  useSyncLogDetail,
  useUpdateSyncConfig,
  useTestConnection,
  useTriggerManualSync,
  type SyncConfig,
  type SyncLog,
  type SyncLogDetail,
  type SyncLogsFilters,
  type SyncStats,
  type SyncFrequency,
  type SyncStrategy,
  type SyncLogStatus,
  type SyncTrigger,
} from './use-sync-admin'

// CHRO Reports Hooks
export {
  useHiringOverviewReport,
  useCompanyComparisonReport,
  useDepartmentAnalysisReport,
  useTimeToHireReport,
  usePipelineAnalysisReport,
  useReportFilterOptions,
} from './use-chro-reports'
