// ============================================================================
// Mock Data Architecture - Barrel Export
// ============================================================================
// This file exports all mock data and services for the Horizon IJP application.
// All data consumption should go through these exports.
// NO inline dummy data allowed anywhere in the application.
// ============================================================================

// =============================================================================
// Data Store (LocalStorage Persistence)
// =============================================================================
export {
  initializeDataStore,
  resetDataStore,
  isDataStoreInitialized,
} from '@/lib/stores/data-store'

// =============================================================================
// Mock Data Exports
// =============================================================================

// Companies
export { MOCK_COMPANIES, getCompanyById, getCompanyByName } from './data/companies'

// Jobs
export { MOCK_JOBS, getJobById, getJobsByCompany, getJobsByLocation, getJobsByFunction } from './data/jobs'

// Users
export { MOCK_USERS, getCurrentUser, getUserById, getUserByEmail, getUsersByRole, getUsersByCompany } from './data/users'

// Applications
export { MOCK_APPLICATIONS, getApplicationById, getApplicationsByUser, getApplicationsByJob, getApplicationsByStatus, getCurrentUserApplications } from './data/applications'

// =============================================================================
// Mock Service Exports
// =============================================================================

// Company Services
export {
  getMockCompanies,
  getMockCompanyById,
  getAllMockCompanies,
  getMockCompanyCount,
  type CompanyFilters,
} from './services/companies'

// Job Services
export {
  getMockJobs,
  getMockJobById,
  getMockRecommendedJobs,
  getMockRecentJobs,
  getMockJobsByCompany,
  getMockSavedJobs,
  getMockJobLocations,
  getMockJobFunctions,
  getMockJobCountByStatus,
  getMockJobCount,
  toggleMockJobSave,
  type ExtendedJobFilters,
} from './services/jobs'

// User Services
export {
  getMockCurrentUser,
  getMockUsers,
  getMockUserById,
  getMockUserByEmail,
  getMockUsersByRole,
  getMockUsersByCompany,
  getMockDepartments,
  getMockUserCount,
  getMockUserCountByRole,
  mockLogin,
  type UserFilters,
} from './services/users'

// Application Services
export {
  getMockApplications,
  getMockApplicationById,
  getMockCurrentUserApplications,
  getMockApplicationsByJob,
  createMockApplication,
  updateMockApplicationStatus,
  withdrawMockApplication,
  hasUserAppliedToJob,
  getMockApplicationCountByStatus,
  getMockApplicationCount,
  resetSessionApplications,
  getMockApplicantDetail,
  getAdjacentApplicationIds,
  type ExtendedApplicationFilters,
  type TimelineEvent,
  type ApplicantDetail,
} from './services/applications'

// CHRO Services
export {
  getMockCHRODashboard,
  getTotalCompaniesCount,
  type TimeRange,
  type CHRODashboardData,
} from './services/chro'

// Admin Services
export {
  getMockAdminDashboard,
  triggerCompanySync,
  resolveError,
  triggerFullSync,
  clearSystemCache,
  exportSystemData,
  createSystemBackup,
  type AdminTimeRange,
  type AdminDashboardData,
  type ActivityLogEntry,
  type CompanySyncStatus,
  type ErrorLogEntry,
  type ActivityAction,
  type ErrorSeverity,
  type SyncStatus,
} from './services/admin'

// Companies Admin Services
export {
  getMockCompaniesWithStats,
  getMockCompanyWithStats,
  createMockCompany,
  updateMockCompany,
  deleteMockCompany,
  toggleMockCompanyStatus,
  bulkUpdateMockCompanyStatus,
  getCompanyIndustries,
  COMPANY_INDUSTRIES,
  type CompanyFormData,
  type CompanyWithStats,
  type CompanyFiltersAdmin,
  type CompanyStatus,
} from './services/companies-admin'

// Users Admin Services
export {
  getMockUsersFiltered,
  getMockUserAdmin,
  createMockUserAdmin,
  updateMockUserAdmin,
  deleteMockUserAdmin,
  resetMockUserPassword,
  bulkUpdateMockUserRole,
  bulkUpdateMockUserStatus,
  bulkResetMockUserPasswords,
  getMockUserCountsByRole,
  getCompaniesForDropdown,
  USER_DEPARTMENTS,
  USER_ROLES,
  type UserFormData,
  type UserFiltersAdmin,
  type UserWithCompany,
  type UserStatus,
} from './services/users-admin'

// Sync Admin Services
export {
  getMockSyncConfigs,
  getMockSyncConfig,
  updateMockSyncConfig,
  testMockConnection,
  triggerMockManualSync,
  getMockSyncLogs,
  getMockSyncLogDetail,
  getMockSyncStats,
  SYNC_DATA_SOURCES,
  SYNC_FREQUENCIES,
  type SyncConfig,
  type SyncLog,
  type SyncLogDetail,
  type SyncLogsFilters,
  type SyncStats,
  type SyncFrequency,
  type SyncStrategy,
  type SyncLogStatus,
  type SyncTrigger,
} from './services/sync-admin'

// CHRO Reports Services
export {
  getMockHiringOverviewReport,
  getMockCompanyComparisonReport,
  getMockDepartmentAnalysisReport,
  getMockTimeToHireReport,
  getMockPipelineAnalysisReport,
  getMockReportFilterOptions,
  getDateRangeFromPreset,
} from './services/chro-reports'
