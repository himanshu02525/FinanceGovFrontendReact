import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// --- STYLES ---
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import './App.css';

// --- COMPONENTS & LAYOUTS ---
import ProtectedRoute from './components/global/ProtectedRoute';
import Layout from './layout/Layout'; // Main Sidebar Layout
import GuestLayout from './layout/GuestLayout'; // Public Layout
import Preloader from './components/global/Preloader';
import { PreloaderProvider } from './context/PreloaderContext';

// --- REGISTRY IMPORTS ---
import {
  ComplianceDashboard,
  ComplianceCreate,
  DisplayAllCompliance,
  DisplayOneRecord,
  ComplianceEdit,
  AuditDashboard,
  AuditCreate,
  DisplayAllAudits,
  AuditEdit,
  ReportDetails,
  CreateReport,
  ReportsDashboard,
  AnalyticsDashboard,
  AuditDetails
} from './core/registry';

// --- PAGE IMPORTS ---
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';
import AuditLogs from './pages/admin/AuditLogs';
import CitizenManagement from './pages/admin/CitizenManagement';
import CreateOfficer from './pages/admin/CreateOfficer';
import DocumentVerification from './pages/admin/DocumentVerification';
import Settings from './pages/admin/Settings';
import UserDetails from './pages/admin/UserDetails';
import UsersPage from './pages/admin/UsersPage';
import AllocateResources from './pages/programManager/AllocateResources';
import BudgetSummary from './pages/programManager/BudgetSummary';
import CreateBudget from './pages/programManager/CreateBudget';
import CreatePrograms from './pages/programManager/CreatePrograms';
import { Dashboard as ProgramManagerDashboard } from './pages/programManager/Dashboard';
import GrantSubsidyPage from './pages/financialofficer/GrantSubsidyPage';
import OfficerAllApplications from './pages/financialofficer/OfficerAllApplications';
import OfficerApplications from './pages/financialofficer/OfficerApplications';
import VerifyDisclosure from './pages/financialofficer/VerifyDisclosure';
import VerifyTaxation from './pages/financialofficer/VerifyTaxation';
import CitizenPrograms from './pages/citizen/CitizenPrograms';
import CitizenSearchPage from './pages/citizen/CitizenSearchPage';
import CreateDisclosure from './pages/citizen/CreateDisclosure';
import CreateTaxation from './pages/citizen/CreateTaxation';
import Documents from './pages/citizen/Documents';
import MyDisclosures from './pages/citizen/MyDisclosures';
import MyTaxations from './pages/citizen/MyTaxations';
import PaymentScreen from './pages/citizen/PaymentScreen';
import Profile from './pages/citizen/Profile';
import Registration from './pages/citizen/Registration';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const Placeholder = ({ title }) => <div className="p-4"><h1>{title}</h1><p>Module coming soon.</p></div>;

function App() {
  return (
    <PreloaderProvider>
      <Preloader />
      <Router>
        <Routes>

          {/* --- GUEST ROUTES (Home, Login, Register) --- */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* --- PROTECTED ROUTES (Sidebar Layout) --- */}
          <Route element={<Layout />}>

            {/* COMPLIANCE OFFICER */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_COMPLIANCE_OFFICER']} />}>
              <Route path="/compliance" element={<ComplianceDashboard />} />
              <Route path="/compliance/create" element={<ComplianceCreate />} />
              <Route path="/compliance/list" element={<DisplayAllCompliance />} />
              <Route path="/compliance/:id" element={<DisplayOneRecord />} />
              <Route path="/compliance/:id/edit" element={<ComplianceEdit />} />
            </Route>

            {/* AUDITOR */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_GOVERNMENT_AUDITOR']} />}>
              <Route path="/audit" element={<AuditDashboard />} />
              <Route path="/audit/create" element={<AuditCreate />} />
              <Route path="/audit/list" element={<DisplayAllAudits />} />
              <Route path="/audit/:id" element={<AuditDetails />} />
              <Route path="/audit/:id/edit" element={<AuditEdit />} />
              <Route path="/reports" element={<ReportsDashboard />} />
              <Route path="/reports/create" element={<CreateReport />} />
              <Route path="/reports/:id" element={<ReportDetails />} />
              <Route path="/reports/analytics" element={<AnalyticsDashboard />} />
            </Route>

            {/* PROGRAM MANAGER */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_PROGRAM_MANAGER']} />}>
              <Route path="/program-manager/dashboard" element={<ProgramManagerDashboard />} />
              <Route path="/create-budget" element={<CreateBudget />} />
              <Route path="/allocate-resources" element={<AllocateResources />} />
              <Route path="/budget-summary" element={<BudgetSummary />} />
              <Route path="/create-programs" element={<CreatePrograms />} />
            </Route>

            {/* ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              <Route path="/admin/users/edit/:id" element={<UserDetails />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/create-officer" element={<CreateOfficer />} />
              <Route path="/admin/citizen-management" element={<CitizenManagement />} />
              <Route path="/admin/document-verification" element={<DocumentVerification />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* FINANCIAL OFFICER */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_FINANCIAL_OFFICER']} />}>
              <Route path="/officer/applications" element={<OfficerApplications />} />
              <Route path="/officer/all-applications" element={<OfficerAllApplications />} />
              <Route path="/officer/citizen-search" element={<CitizenSearchPage />} />
              <Route path="/officer/grant-subsidy" element={<GrantSubsidyPage />} />
              <Route path="/officer/verify-taxation" element={<VerifyTaxation />} />
              <Route path="/officer/verify-disclosure" element={<VerifyDisclosure />} />
              <Route path="/officer/reports" element={<Placeholder title="Financial Summary & Reports" />} />
            </Route>

            {/* CITIZEN */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_CITIZEN']} />}>
              <Route path="/registration" element={<Registration />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/citizen/programs" element={<CitizenPrograms defaultView="available" />} />
              <Route path="/citizen/my-applications" element={<CitizenPrograms defaultView="my-applications" />} />
              <Route path="/citizen/create-disclosure" element={<CreateDisclosure />} />
              <Route path="/citizen/create-taxation" element={<CreateTaxation />} />
              <Route path="/citizen/my-taxation-history" element={<MyTaxations />} />
              <Route path="/citizen/payment-screen" element={<PaymentScreen />} />
              <Route path="/citizen/my-disclosure-history" element={<MyDisclosures />} />
            </Route>
          </Route>

          {/* --- CATCH ALL --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          style={{ maxWidth: "500px", minWidth: "max-content" }}
        />
      </Router>
    </PreloaderProvider>
  );
}

export default App;