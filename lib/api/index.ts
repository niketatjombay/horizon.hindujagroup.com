// Jobs API
export {
  fetchJobs,
  fetchJobById,
  fetchRecommendedJobs,
  fetchRecentJobs,
  toggleSaveJob,
} from './jobs'

// Applications API
export {
  fetchApplications,
  fetchApplicationById,
  submitApplication,
  withdrawApplication,
} from './applications'

// Users API
export {
  fetchCurrentUser,
  fetchUsers,
  fetchUserById,
} from './users'

// CHRO API
export {
  fetchCHRODashboard,
  type TimeRange,
  type CHRODashboardData,
} from './chro'

// Admin API
export {
  fetchAdminDashboard,
  triggerSync,
  resolveError,
  triggerFullSync,
  clearCache,
  exportData,
  createBackup,
  type AdminTimeRange,
  type AdminDashboardData,
  type ActivityLogEntry,
  type CompanySyncStatus,
  type ErrorLogEntry,
} from './admin'

// Companies Admin API
export {
  fetchCompaniesAdmin,
  fetchCompanyAdmin,
  createCompany,
  updateCompany,
  deleteCompany,
  toggleCompanyStatus,
  bulkUpdateCompanyStatus,
  getIndustries,
  type CompanyFormData,
  type CompanyWithStats,
  type CompanyFiltersAdmin,
  type CompanyStatus,
} from './companies-admin'

// Users Admin API
export {
  fetchUsersAdmin,
  fetchUserAdmin,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  bulkUpdateUserRole,
  bulkUpdateUserStatus,
  bulkResetPasswords,
  getUserCountsByRole,
  getCompaniesDropdown,
  type UserFormData,
  type UserFiltersAdmin,
  type UserWithCompany,
  type UserStatus,
} from './users-admin'

// Sync Admin API
export {
  fetchSyncConfigs,
  fetchSyncConfig,
  updateSyncConfig,
  testConnection,
  triggerManualSync,
  fetchSyncLogs,
  fetchSyncLogDetail,
  fetchSyncStats,
  type SyncConfig,
  type SyncLog,
  type SyncLogDetail,
  type SyncLogsFilters,
  type SyncStats,
  type SyncFrequency,
  type SyncStrategy,
  type SyncLogStatus,
  type SyncTrigger,
} from './sync-admin'

// CHRO Reports API
export {
  fetchHiringOverviewReport,
  fetchCompanyComparisonReport,
  fetchDepartmentAnalysisReport,
  fetchTimeToHireReport,
  fetchPipelineAnalysisReport,
  fetchReportFilterOptions,
  getDateRangeFromPreset,
} from './chro-reports'
