// ===============================
// Layout Components
// ===============================
export { default as Layout } from '../layout/Layout';
export { default as Header } from '../layout/Header';
export { default as Footer } from '../layout/Footer';
export { default as Sidebar } from '../layout/Sidebar';

// ===============================
// Global Components
// ===============================
export { default as Loader } from '../components/global/Loader';
export { default as EmptyState } from '../components/global/EmptyState';
export { default as Modal } from '../components/global/Modal';
export { default as ConfirmDialog } from '../components/global/ConfirmDialog';
export { default as RecordsTable } from '../components/global/RecordsTable';
export { default as SearchBar } from '../components/global/SearchBar';
export { default as StatusBadge } from '../components/global/StatusBadge';
export { default as DetailCard } from '../components/global/DetailCard';
export { default as RefetchButton } from '../components/global/RefetchButton';
export { default as StatItem } from '../components/global/StatItem';
export { default as BootstrapSwitch } from '../components/global/BootstrapSwitch';
export { default as BackButton } from '../components/global/BackButton';
export { default as DataUnavailable } from '../components/global/DataUnavailable';
export { default as CharacterAllow } from '../components/global/CharacterAllow';
export { default as StatusCard } from '../components/reports/StatusCard';
export { default as CachedIcon } from '@mui/icons-material/Cached';
export { default as SummaryCard } from '../components/global/SummaryCard'; 


// ===============================
// Compliance Components
// ===============================
export { default as ComplianceSummary } from '../components/compliance/ComplianceSummary';
export { default as CitizenBusinessDetails } from '../components/compliance/CitizenBusinessDetails';
export { default as FundingProgramDetails } from '../components/compliance/FundingProgramDetails';
export { default as SubsidyDetails } from '../components/compliance/SubsidyDetails';
export { default as TaxDetails } from '../components/compliance/TaxDetails';

// ===============================
// Compliance Officer Pages
// ===============================
export { default as ComplianceDashboard } from '../pages/compliaceofficer/ComplianceDashboard';
export { default as ComplianceCreate } from '../pages/compliaceofficer/ComplianceCreate';
export { default as ComplianceEdit } from '../pages/compliaceofficer/ComplianceEdit';
export { default as DisplayAllCompliance } from '../pages/compliaceofficer/DisplayAllCompliance';
export { default as DisplayOneRecord } from '../pages/compliaceofficer/DisplayOneRecord';

// ===============================
// Auditor Pages & Components
// ===============================
export { default as AuditDashboard } from '../pages/auditor/AuditDashboard';
export { default as AuditCreate } from '../pages/auditor/AuditCreate';
export { default as AuditEdit } from '../pages/auditor/AuditEdit';
export { default as AuditDetails } from '../pages/auditor/AuditDetails';
export { default as DisplayAllAudits } from '../pages/auditor/DisplayAllAudits';

export { default as DisplayOneAudit } from '../components/audit/DisplayOneAudit';
export { default as AuditSummary } from '../components/audit/AuditSummary';

// ===============================
// Reports & Analytics
// ===============================
export { default as ReportsDashboard } from '../pages/reportsAnalytics/ReportsDashboard';
export { default as Dashboard } from '../pages/reportsAnalytics/Dashboard';
export { default as AnalyticsDashboard } from '../pages/reportsAnalytics/AnalyticsDashboard';
export { default as CreateReport } from '../pages/reportsAnalytics/CreateReport';
export { default as ReportDetails } from '../pages/reportsAnalytics/ReportDetails';

export { default as ReportsList } from '../components/reports/ReportsList';
export { default as ReportCard } from '../components/reports/ReportCard';
export { default as CreateReportForm } from '../components/reports/CreateReportForm';
export { default as ScopeSelector } from '../components/reports/ScopeSelector';
export { default as ReportViewer } from '../components/reports/ReportViewer';
export { default as TaxMetricsCard } from '../components/reports/TaxMetricsCard';
export { default as ProgramMetricsCard } from '../components/reports/ProgramMetricsCard';
export { default as SubsidyMetricsCard } from '../components/reports/SubsidyMetricsCard';
export { default as GenericMetricsCard } from '../components/reports/GenericMetricsCard';
export { default as MetricsGrid } from '../components/reports/MetricsGrid';

// ===============================
// API Imports
// ===============================
export { default as complianceApi } from '../api/complianceApi';
export { default as auditApi } from '../api/auditApi';
export { default as reportApi } from '../api/reportsAnalyticsApi';

// ===============================
// Chart Components
export { default as CustomPie } from '../components/charts/CustomPie';
export { default as CustomBarVertical } from '../components/charts/CustomBarVertical';
export { default as CustomBarBudget } from '../components/charts/CustomBarBudget';
export { default as SectionHeader } from '../components/charts/SectionHeader';
export { default as ValueList } from '../components/charts/ValueList';
export { default as SummarySection } from '../components/charts/SummarySection';