# Finance Gov Register - Frontend Flow Documentation 📋

## Table of Contents
1. [Technical Architecture Documentation](#i-technical-architecture-documentation)
2. [UI and User Flows Documentation](#ii-ui-and-user-flows-documentation)
3. [Project Structure](#iii-project-structure)
4. [Module Connections & Data Flow](#iv-module-connections--data-flow)
5. [Error Handling](#v-error-handling)

---

## I. Technical Architecture Documentation 💻

### Overview
Finance Gov Register is a comprehensive web application designed to manage financial programs, budgets, compliance, audits, and citizen applications. The system uses a component-based React architecture with microservices API integration.

**Frontend Stack:**
- **Framework**: React 18+ with Vite
- **State Management**: React Context API + Custom Hooks
- **UI Library**: Bootstrap 5 + Framer Motion (animations)
- **HTTP Client**: Axios with custom interceptors
- **Router**: React Router v6
- **Base URL**: http://localhost:5173
- **API Gateway Base URL**: http://localhost:8000/api

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                    │
│                    :5173                                    │
├─────────────────────────────────────────────────────────────┤
│  Pages (Admin, Auditor, Citizen, Financial Officer, etc.)   │
│         │                                                   │
│         ├─ Components (Global, Charts, Forms, Tables)       |
│         └─ API Services (axiosInstance → Backend)           │
├─────────────────────────────────────────────────────────────┤s
│              API Interceptor & Error Handling               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 API Gateway / Backend                       │
│                    :8000/api                                │
├─────────────────────────────────────────────────────────────┤
│  • Program Service (CRUD, Budget, Status)                   │
│  • Compliance Service (Subsidy, Tax, Funding)               │
│  • Audit Service (Audit Logs, Summary)                      │
│  • Citizen Service (Applications, Profile)                  │
│  • Reports & Analytics Service                              │
│  • Resource Allocation Service                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Key Interaction Flows

| Flow | Description | Components Involved |
|------|-------------|-------------------|
| **User Authentication** | User logs in, receives auth token | Frontend → API Gateway |
| **Program Management** | Create/Update/Delete financial programs | Program Manager Page → programService → API |
| **Budget Allocation** | Allocate budget to programs | Budget Service → Program Service → API |
| **Compliance Check** | View program compliance status | Compliance Page → complianceApi → API |
| **Audit Tracking** | View and manage audit records | Audit Page → auditApi → API |
| **Citizen Application** | Citizens apply for subsidies/assistance | Citizen Pages → CitizenApi → API |
| **Reports Generation** | Generate system reports and analytics | Reports Page → reportsAnalyticsApi → API |
| **Resource Allocation** | Allocate resources to programs | AllocateResources → resourceService → API |

---

### System Requirements ⚙️

**Software:**
- Node.js 16.x+
- npm or yarn
- React 18+
- Vite (Build tool)
- Modern browser (Chrome, Firefox, Safari, Edge)

**Backend Services:**
- API Gateway running on port 8000
- Database connectivity (MySQL/PostgreSQL)

**Operational:**
- Port 5173 (Frontend Dev Server)
- Port 8000 (API Gateway)
- Internet connectivity for API calls

---

## II. UI and User Flows Documentation 🧑‍💻

### General UI Overview

The application features a role-based dashboard with:
- **Navigation Bar**: Sidebar with role-specific navigation
- **Header**: User profile, logout, role display
- **Content Area**: Main workspace for modules
- **Footer**: Copyright information
- **Preloader**: Loading states during data fetch

### User Roles & Access

| Role | Access Level | Primary Modules |
|------|--------------|-----------------|
| **Admin** | Full System Access | Dashboard, Users, System Settings, All Reports |
| **Program Manager** | Programs & Budgets | Create Programs, Allocate Budget, View Summary |
| **Compliance Officer** | Compliance Management | Compliance Status, Audit Reports, Document Review |
| **Financial Officer** | Financial Tracking | Budget Tracking, Financial Reports, Resource Allocation |
| **Auditor** | Audit & Review | Audit Logs, Program Audits, Compliance Verification |
| **Citizen** | Self-Service | Apply for Subsidy, Track Application, View Programs |

---

### Core Modules and User Flows

#### 1. **Dashboard Module**
**URL**: `/dashboard`

**Purpose**: System overview and key metrics

**Components**:
- Summary Cards (Active Programs, Total Budget, Pending Audits)
- Recent Activities Table
- Program Status Overview
- Key Metrics & Statistics

**User Flow: Dashboard View**
```
1. User logs in → Redirected to Dashboard
2. Dashboard loads preloader while fetching data
3. Display Summary Cards with key metrics
4. Show recent programs and activities
5. Display audit status and compliance summary
6. Auto-refresh data every 30 seconds
```

**API Endpoints**:
- `GET /programs/summary` - Get program summary
- `GET /audits/recent` - Get recent audits
- `GET /reports/dashboard` - Dashboard metrics

---

#### 2. **Program Manager Module**
**URL**: `/program-manager`

**Purpose**: Create, manage, and track financial programs

**Sub-Components**:

##### 2.1 Create Programs
**URL**: `/program-manager/create`

**Form Fields**:
- Program Title (required, max 100 chars)
- Description (required, max 1000 chars)
- Budget Amount (required, numeric)
- Start Date (required)
- End Date (required, must be after start date)
- Status (Active/Closed)

**User Flow: Program Creation**
```
1. Navigate to Create Programs
2. Fill program details form
3. Validation occurs in real-time
   - Title: Required, max 100 chars
   - Description: Required, max 1000 chars, shows character count
   - Budget: Required, positive number
   - Dates: Required, end date > start date
4. Click "Create Program" button
5. Success message shown, form resets
6. New program added to list
7. Can switch to "All Programs" to view created program
```

**API Endpoints**:
- `POST /programs/create` - Create new program
- Data submitted: `{ title, description, budget, startDate, endDate, status }`

##### 2.2 All Programs (List & Manage)
**URL**: `/program-manager/all-programs`

**Components**:
- **Filter**: Status filter (All, Active, Closed)
- **Table Columns**:
  - Program ID
  - Title
  - Description (truncated to 100 chars with "More" button)
  - Start Date
  - End Date
  - Budget (formatted currency)
  - Status (Active/Closed badge)
  - Actions (Update, Delete)

**User Flow: View & Manage Programs**
```
1. Click "All Programs" button
2. Table loads with pagination/filtering
3. Filter by status (Active/Closed)
4. View program description (truncated):
   - Shows first 100 characters
   - "More" button appears if description longer
   - Click "More" → Modal opens with:
     * Full program title
     * Complete description
     * Close button
5. Update Program:
   - Click "Update" button
   - Update dialog opens (centered modal)
   - Pre-populated with current data
   - Edit fields (title, description, budget, dates, status)
   - Click "Update Program" → Success message
   - List refreshes automatically
6. Delete Program:
   - Click "Delete" button
   - Confirmation dialog appears
   - Confirm deletion → Program removed
   - List refreshes automatically
```

**Update Program Dialog Flow**:
```
Dialog Structure:
├─ Header
│  ├─ Title: "Update Program"
│  └─ Close (X) button
├─ Content (Scrollable)
│  ├─ Title input field
│  ├─ Description textarea (max 1000 chars)
│  ├─ Budget input
│  ├─ Start Date picker
│  ├─ End Date picker
│  └─ Status dropdown
└─ Footer
   ├─ Cancel button
   └─ Update Program button

Behavior:
- Form pre-fills with existing program data
- All validations same as create
- Changes reflect immediately on submit
- Auto-reload program list
```

**API Endpoints**:
- `GET /programs/all` - List all programs
- `GET /programs/summary` - Get program summary
- `PUT /programs/update/{id}` - Update program
- `DELETE /programs/{id}` - Delete program
- `GET /programs/filter?status=ACTIVE` - Filter programs

---

#### 3. **Budget Management Module**
**URL**: `/program-manager/create-budget`

**Purpose**: Allocate and track budget for programs

**User Flow: Create Budget**
```
1. Navigate to Create Budget section
2. Select or search for program
3. Enter budget allocation details:
   - Budget Amount
   - Allocation Date
   - Department/Category
4. Validate budget doesn't exceed program budget
5. Submit allocation
6. View budget allocation summary
```

**API Endpoints**:
- `POST /budgets/create` - Create budget allocation
- `GET /budgets/{programId}` - Get program budgets
- `PUT /budgets/{id}` - Update budget
- `DELETE /budgets/{id}` - Delete budget

---

#### 4. **Compliance Module**
**URL**: `/program-manager/compliance`

**Purpose**: Track compliance status of programs

**Components**:
- Compliance Summary Cards
- Compliance Status Table
- Document Upload Section
- Compliance History

**User Flow: Check Compliance**
```
1. Navigate to Compliance
2. View compliance summary:
   - Total Programs
   - Compliant Programs
   - Non-Compliant Programs
   - Pending Review
3. Filter by compliance status
4. View individual program compliance:
   - Subsidy Details
   - Tax Details
   - Funding Program Details
   - Documents
5. Upload compliance documents if needed
6. View compliance history and changes
```

**API Endpoints**:
- `GET /compliance/summary` - Compliance summary
- `GET /compliance/{programId}` - Program compliance status
- `POST /compliance/documents/upload` - Upload documents
- `GET /compliance/history` - Compliance change history

---

#### 5. **Audit Module**
**URL**: `/program-manager/audit`

**Purpose**: Track and manage program audits

**Components**:
- Audit Summary
- Audit History Table
- Audit Details View
- Audit Log Entries

**User Flow: View Audits**
```
1. Navigate to Audit section
2. View audit summary:
   - Total Audits
   - Completed Audits
   - Pending Audits
   - Issues Found
3. Click on specific audit to view details:
   - Audit Date
   - Auditor Name
   - Findings
   - Status
   - Recommendations
4. View audit history timeline
5. Generate audit report
```

**API Endpoints**:
- `GET /audits/summary` - Audit summary
- `GET /audits/{programId}` - Program audit history
- `GET /audits/{auditId}/details` - Audit details
- `POST /audits/create` - Create new audit
- `PUT /audits/{id}/status` - Update audit status

---

#### 6. **Resource Allocation Module**
**URL**: `/program-manager/allocate-resources`

**Purpose**: Allocate resources to programs

**User Flow: Allocate Resources**
```
1. Navigate to Allocate Resources
2. Select program
3. Define resource allocation:
   - Resource Type (Personnel, Equipment, etc.)
   - Quantity
   - Allocation Period
   - Cost per unit
4. Validate total allocation cost
5. Submit allocation
6. View allocation summary
7. Track resource utilization
```

**API Endpoints**:
- `POST /resources/allocate` - Allocate resources
- `GET /resources/{programId}` - Get program resources
- `PUT /resources/{id}` - Update allocation
- `DELETE /resources/{id}` - Remove allocation

---

#### 7. **Reports & Analytics Module**
**URL**: `/program-manager/reports`

**Purpose**: Generate and view system reports

**Components**:
- Report Generator Form
- Report Viewer
- Export Options
- Report History

**User Flow: Generate Reports**
```
1. Navigate to Reports section
2. Select report type:
   - Program Summary Report
   - Budget Utilization Report
   - Compliance Report
   - Audit Report
   - Financial Summary
3. Set parameters:
   - Date range
   - Filters (by program, department, status)
4. Click "Generate Report"
5. System compiles data and displays:
   - Charts and graphs
   - Summary statistics
   - Detailed data tables
6. Export options:
   - PDF download
   - Excel download
   - Print
7. Save report for future reference
```

**API Endpoints**:
- `GET /reports/generate` - Generate report with parameters
- `GET /reports/export` - Export report
- `GET /reports/history` - Report history
- `POST /reports/schedule` - Schedule recurring reports

---

#### 8. **Citizen Module**
**URL**: `/citizen`

**Purpose**: Citizens apply for subsidies and assistance

**User Flow: Citizen Application**
```
1. Citizen logs in
2. Navigate to "Apply for Assistance"
3. Browse available programs
4. Click on program to view details:
   - Program name
   - Eligibility criteria
   - Benefits
   - Required documents
5. Click "Apply"
6. Fill application form:
   - Personal information
   - Household details
   - Income information
   - Supporting documents
7. Review application
8. Submit application
9. Receive confirmation
10. Track application status:
    - Under Review
    - Approved
    - Rejected
    - Documents Requested
11. View approval and download certificate
```

**Application Status Flow**:
```
Submitted → Pending Review → 
  ├─ Approved → Processing → Completed
  ├─ Rejected
  └─ Documents Requested → Resubmit
```

**API Endpoints**:
- `GET /programs/public` - Public program listing
- `POST /applications/create` - Submit application
- `GET /applications/{id}/status` - Check status
- `PUT /applications/{id}/documents` - Upload documents
- `GET /applications/{id}` - View application details

---

### Module Connections & Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND STRUCTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    DASHBOARD                              │   │
│  │  • Summarizes data from all modules                       │   │
│  │  • Displays key metrics from Programs, Audits, Budget     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                    ↑         ↑         ↑                         │
│  ┌─────────────────┼─────────┼─────────┼──────────────────┐    │
│  │                 │         │         │                  │    │
│  ↓                 ↓         ↓         ↓                  ↓    │
│ ┌────────┐ ┌────────────┐ ┌──────┐ ┌──────────┐ ┌────────┐    │
│ │PROGRAMS│→│COMPLIANCE │→│AUDIT │→│ BUDGET   │→│REPORTS │    │
│ └────────┘ └────────────┘ └──────┘ └──────────┘ └────────┘    │
│     │                        │         │           │             │
│     ├─ Create Program        ├─ Check              ├─ Generate   │
│     ├─ Update Program        │  Compliance         │  Report     │
│     ├─ Delete Program        ├─ Upload Docs        ├─ Export     │
│     ├─ List Programs         ├─ View Status        └─ History    │
│     └─ Filter               └─ Manage             │             │
│                                                    ↓             │
│                                             ┌─────────────┐    │
│                                             │  RESOURCES  │    │
│                                             │ ALLOCATION  │    │
│                                             └─────────────┘    │
│                                                    ↑             │
│                                                    │             │
│                                              BUDGET SERVICE      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│               SHARED SERVICES & UTILITIES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐       │
│  │ axiosInstance│  │  Helpers   │  │  useAsync Hook   │       │
│  │ (API Client) │  │  (Formatters)  │  (State Mgmt)   │       │
│  └──────────────┘  └────────────┘  └──────────────────┘       │
│         │               │                  │                    │
│         └───────────────┼──────────────────┘                    │
│                         │                                        │
│                    All Components                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Port 8000)                       │
│  • Routes all requests to appropriate backend services           │
│  • Handles authentication & authorization                        │
│  • Implements rate limiting & logging                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND MICROSERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│  • Program Service        • Audit Service                         │
│  • Budget Service         • Citizen Service                       │
│  • Compliance Service     • Reports Service                       │
│  • Resource Service       • Authentication Service                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                     │
│  • Programs              • Audit Logs                             │
│  • Budgets               • Citizen Applications                   │
│  • Compliance Records    • Resources                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## III. Project Structure

```
FinanceGovRegister/
│
├── index.html                          # HTML entry point
├── vite.config.js                      # Vite configuration
├── eslint.config.js                    # ESLint rules
├── package.json                        # Dependencies & scripts
├── package-lock.json
│
├── public/                             # Static assets
│   └── ...
│
└── src/                                # Source code
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root component
    ├── App.css                         # Global styles
    ├── index.css                       # Global CSS
    │
    ├── api/                            # API & Services
    │   ├── Admin.js                    # Admin API calls
    │   ├── api.js                      # Base API configuration
    │   ├── aravind.js                  # Custom API service
    │   ├── auditApi.js                 # Audit API calls
    │   ├── authService.jsx             # Authentication service
    │   ├── axiosInstance.js            # Axios interceptor setup
    │   ├── budgetService.js            # Budget API calls
    │   ├── CitizenApi.js               # Citizen API calls
    │   ├── CitizenAreef.js             # Extended citizen service
    │   ├── complianceApi.js            # Compliance API calls
    │   ├── helpers.js                  # Utility functions
    │   ├── programService.js           # Program API calls
    │   ├── reportsAnalyticsApi.js      # Reports API calls
    │   ├── resourceService.js          # Resource API calls
    │   ├── status.js                   # Status management
    │   ├── storage.js                  # Local storage helpers
    │   └── useAsync.js                 # Custom async hook
    │
    ├── assets/                         # Images, icons, etc
    │
    ├── components/                     # Reusable components
    │   ├── audit/                      # Audit components
    │   │   ├── AuditSummary.jsx
    │   │   ├── DisplayOneAudit.jsx
    │   │   └── DisplayOneAudit.css
    │   │
    │   ├── charts/                     # Chart components
    │   │   ├── CustomBarBudget.jsx
    │   │   ├── CustomBarVertical.jsx
    │   │   ├── CustomPie.jsx
    │   │   ├── SectionHeader.jsx
    │   │   ├── SummarySection.jsx
    │   │   └── ValueList.jsx
    │   │
    │   ├── compliance/                 # Compliance components
    │   │   ├── CitizenBusinessDetails.jsx
    │   │   ├── ComplianceSummary.jsx
    │   │   ├── ComplianceTable.jsx
    │   │   ├── DocumentList.jsx
    │   │   ├── Documents.jsx
    │   │   ├── FundingProgramDetails.jsx
    │   │   ├── SubsidyDetails.jsx
    │   │   └── TaxDetails.jsx
    │   │
    │   ├── global/                     # Global reusable components
    │   │   ├── BackButton.jsx
    │   │   ├── BootstrapSwitch.jsx
    │   │   ├── CharacterAllow.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── ConfirmDialog.css
    │   │   ├── DataUnavailable.jsx
    │   │   ├── DetailCard.jsx
    │   │   ├── DetailCard.css
    │   │   ├── EmptyState.jsx
    │   │   ├── EmptyState.css
    │   │   ├── Loader.jsx
    │   │   ├── Loader.css
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Modal.css
    │   │   ├── NotFound.jsx
    │   │   ├── Preloader.jsx
    │   │   ├── Preloader.css
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── RecordsTable.jsx
    │   │   ├── RecordsTable.css
    │   │   ├── RefetchButton.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── SearchBar.css
    │   │   ├── StatItem.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── SummaryCard.jsx
    │   │
    │   ├── reports/                    # Reports components
    │   │   ├── CreateReportForm.jsx
    │   │   ├── DisplayAllReports.jsx
    │   │   ├── GenericMetricsCard.jsx
    │   │   ├── MetricsGrid.jsx
    │   │   ├── ProgramMetricsCard.jsx
    │   │   ├── ReportCard.jsx
    │   │   ├── ReportsList.jsx
    │   │   └── ReportViewer.jsx
    │   │
    │   └── ... (other components)
    │
    ├── context/                        # React Context
    │   └── PreloaderContext.jsx        # Global preloader state
    │
    ├── core/                           # Core utilities
    │   └── registry.js                 # Service registry
    │
    ├── forms/                          # Form utilities
    │   └── demo.txt
    │
    ├── hooks/                          # Custom hooks
    │   ├── hooks.js                    # Custom hook utilities
    │   └── usePreloader.js             # Preloader hook
    │
    ├── layout/                         # Layout components
    │   ├── Footer.jsx
    │   ├── Footer.css
    │   ├── GuestLayout.jsx             # Public layout (no auth)
    │   ├── Header.jsx
    │   ├── Header.css
    │   ├── Layout.jsx                  # Main authenticated layout
    │   ├── Layout.css
    │   ├── Sidebar.jsx
    │   └── Sidebar.css
    │
    ├── pages/                          # Page components
    │   ├── Home.jsx
    │   ├── Home.css
    │   │
    │   ├── admin/                      # Admin role pages
    │   │   └── ... (admin-specific pages)
    │   │
    │   ├── auditor/                    # Auditor role pages
    │   │   └── ... (auditor-specific pages)
    │   │
    │   ├── auth/                       # Authentication pages
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── AuthLayout.jsx
    │   │
    │   ├── citizen/                    # Citizen role pages
    │   │   ├── CitizenDashboard.jsx
    │   │   └── ... (citizen-specific pages)
    │   │
    │   ├── compliaceofficer/           # Compliance officer pages
    │   │   └── ... (compliance-specific pages)
    │   │
    │   ├── financialofficer/           # Financial officer pages
    │   │   └── ... (finance-specific pages)
    │   │
    │   ├── programManager/             # Program manager pages
    │   │   ├── Dashboard.jsx           # Program dashboard
    │   │   ├── Dashboard.css
    │   │   ├── CreatePrograms.jsx      # Create/manage programs
    │   │   ├── CreateProgramForm.jsx   # Program form
    │   │   ├── CreateProgramForm.jsx   # Program form
    │   │   ├── UpdateProgramDialog.jsx # Update program modal
    │   │   ├── CreateBudget.jsx        # Create budget
    │   │   ├── CreateBudgetForm.jsx    # Budget form
    │   │   ├── BudgetSummary.jsx       # Budget summary
    │   │   ├── AllocateResources.jsx   # Resource allocation
    │   │   ├── AllocateResourcesForm.jsx
    │   │   ├── Pages.css               # Program manager styles
    │   │   ├── Forms.css               # Form styles
    │   │   └── Funct.jsx               # Utility functions
    │   │
    │   └── reportsAnalytics/           # Reports & analytics pages
    │       └── ... (reports pages)
    │
    ├── styles/                         # Global styles
    │   ├── global.css
    │   └── demo.txt
    │
    └── utils/                          # Utility functions
        └── parseMetrics.js             # Metrics parsing utils
```

---

### File Descriptions

#### API Services (`src/api/`)

| File | Purpose | Key Methods |
|------|---------|------------|
| `axiosInstance.js` | Axios setup with interceptors | Request/response interceptors, error handling |
| `programService.js` | Program CRUD operations | `createProgram()`, `updateProgram()`, `deleteProgram()`, `getAllPrograms()` |
| `budgetService.js` | Budget management | `createBudget()`, `updateBudget()`, `getBudgets()` |
| `complianceApi.js` | Compliance checks | `getCompliance()`, `updateCompliance()` |
| `auditApi.js` | Audit operations | `getAudits()`, `createAudit()`, `updateAuditStatus()` |
| `reportsAnalyticsApi.js` | Report generation | `generateReport()`, `exportReport()` |
| `CitizenApi.js` | Citizen applications | `submitApplication()`, `getApplicationStatus()` |
| `helpers.js` | Utility functions | `formatCurrency()`, `formatDate()`, `showError()`, `showSuccess()` |

#### Components (`src/components/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Modal.jsx` | Generic modal wrapper | `isOpen`, `onClose`, `title`, `children` |
| `ConfirmDialog.jsx` | Confirmation dialog | `isOpen`, `title`, `message`, `onConfirm`, `onCancel` |
| `Loader.jsx` | Loading spinner | `fullScreen`, `message` |
| `StatusBadge.jsx` | Status display | `status`, `variant` |
| `SummaryCard.jsx` | Summary metric card | `title`, `value`, `icon` |
| `RecordsTable.jsx` | Data table | `columns`, `data`, `onAction` |

#### Pages (`src/pages/`)

| Page | Route | Role Access | Purpose |
|------|-------|-------------|---------|
| `Home.jsx` | `/` | All | Landing/redirect page |
| `Login.jsx` | `/login` | Public | User authentication |
| `Dashboard.jsx` | `/dashboard` | Authenticated | Main dashboard |
| `CreatePrograms.jsx` | `/program-manager/create-programs` | Program Manager | Program management |
| `CreateBudget.jsx` | `/program-manager/budget` | Financial Officer | Budget allocation |
| `Compliance.jsx` | `/compliance` | Compliance Officer | Compliance tracking |
| `AuditSummary.jsx` | `/audit` | Auditor | Audit management |

---

## IV. Module Connections & Data Flow

### Program Creation to Completion Flow

```
START
  │
  ├─→ User: Navigate to Program Manager → Create Programs
  │
  ├─→ Component: CreateProgramForm.jsx
  │   ├─ User fills: Title, Description, Budget, Dates
  │   ├─ Form validates in real-time
  │   └─ User clicks "Create Program"
  │
  ├─→ Service Call: programService.createProgram(data)
  │   └─ API Call: POST /api/programs/create
  │
  ├─→ Backend Processing
  │   ├─ Validate input
  │   ├─ Check for duplicates
  │   └─ Save to database
  │
  ├─→ Success Response
  │   ├─ Show success toast notification
  │   ├─ Reset form
  │   └─ Optionally switch to "All Programs" view
  │
  ├─→ "All Programs" List View
  │   ├─ Table loads with filtering options
  │   ├─ Shows: ID, Title, Description (truncated), Dates, Budget, Status
  │   ├─ "More" button shows if description > 100 chars
  │   └─ Action buttons: Update, Delete
  │
  ├─→ View Full Description
  │   ├─ User clicks "More" button
  │   ├─ Modal opens with full title and description
  │   └─ User can close modal
  │
  ├─→ Update Program
  │   ├─ User clicks "Update" button
  │   ├─ Update dialog opens with current data
  │   ├─ User modifies fields
  │   ├─ User clicks "Update Program"
  │   ├─ API Call: PUT /api/programs/update/{id}
  │   ├─ Success message shown
  │   └─ List refreshes automatically
  │
  ├─→ Delete Program
  │   ├─ User clicks "Delete" button
  │   ├─ Confirmation dialog appears
  │   ├─ User confirms deletion
  │   ├─ API Call: DELETE /api/programs/{id}
  │   ├─ Success message shown
  │   └─ List refreshes automatically
  │
  └─→ END
```

### Budget Allocation Flow

```
Program Created
  │
  ├─→ Program Manager: Navigate to Create Budget
  │
  ├─→ Component: CreateBudgetForm.jsx
  │   ├─ Form loads with program selection dropdown
  │   ├─ User selects program
  │   ├─ Form displays program details and max budget
  │   ├─ User enters allocation amount
  │   ├─ System validates: allocation ≤ program budget
  │   └─ User submits allocation
  │
  ├─→ Service Call: budgetService.createBudget(data)
  │   └─ API Call: POST /api/budgets/create
  │
  ├─→ Budget Tracking
  │   ├─ Update program's allocated budget
  │   ├─ Track remaining available budget
  │   └─ Generate audit trail
  │
  ├─→ View Budget Summary
  │   ├─ Component: BudgetSummary.jsx
  │   ├─ Display allocated vs available budget
  │   ├─ Show allocation breakdown by category
  │   └─ Export budget report
  │
  └─→ Reports reflect budget changes
```

### Compliance Tracking Flow

```
Program Active
  │
  ├─→ Compliance Officer: Navigate to Compliance
  │
  ├─→ Component: ComplianceSummary.jsx
  │   ├─ Display compliance status per program:
  │   │  ├─ Documents status
  │   │  ├─ Subsidy details
  │   │  ├─ Tax details
  │   │  └─ Funding program details
  │   │
  │   └─ User can upload documents
  │
  ├─→ Compliance Check
  │   ├─ API Call: GET /api/compliance/{programId}
  │   ├─ System validates:
  │   │  ├─ Required documents present
  │   │  ├─ Data consistency
  │   │  └─ Deadline compliance
  │   │
  │   └─ Update compliance status
  │
  ├─→ Document Management
  │   ├─ User uploads supporting documents
  │   ├─ API Call: POST /api/documents/upload
  │   ├─ Documents stored and indexed
  │   └─ Compliance status updated
  │
  └─→ Generate Compliance Report
     └─ Component: Reports generate compliance metrics
```

### Audit Process Flow

```
Program Active
  │
  ├─→ Auditor: Navigate to Audit
  │
  ├─→ Component: AuditSummary.jsx
  │   ├─ Display audit summary statistics
  │   ├─ List recent audits
  │   └─ Show audit status breakdown
  │
  ├─→ Create New Audit
  │   ├─ User selects program to audit
  │   ├─ System retrieves program data:
  │   │  ├─ Budget allocations
  │   │  ├─ Compliance status
  │   │  ├─ Activities
  │   │  └─ Previous audits
  │   │
  │   └─ Auditor enters findings:
  │      ├─ Issues identified
  │      ├─ Recommendations
  │      └─ Status (Completed/Pending)
  │
  ├─→ Service Call: auditApi.createAudit(data)
  │   └─ API Call: POST /api/audits/create
  │
  ├─→ Audit Report Generation
  │   ├─ Component: DisplayOneAudit.jsx
  │   ├─ Shows audit details:
  │   │  ├─ Audit date and auditor
  │   │  ├─ Findings
  │   │  ├─ Status
  │   │  └─ Recommendations
  │   │
  │   └─ Generate audit report for compliance team
  │
  └─→ Dashboard reflects audit status
```

### Citizen Application Flow

```
Citizen User
  │
  ├─→ Navigate to Browse Programs
  │
  ├─→ View Available Programs
  │   ├─ API Call: GET /api/programs/public
  │   ├─ Display program list with eligibility info
  │   └─ User clicks on program for details
  │
  ├─→ Application Form
  │   ├─ Component: CitizenApplicationForm
  │   ├─ Collect:
  │   │  ├─ Personal information
  │   │  ├─ Household details
  │   │  ├─ Income information
  │   │  ├─ Supporting documents
  │   │  └─ Application date
  │   │
  │   └─ System validates eligibility
  │
  ├─→ Submit Application
  │   ├─ Service Call: CitizenApi.submitApplication(data)
  │   ├─ API Call: POST /api/applications/create
  │   │
  │   └─ Status: Submitted → Pending Review
  │
  ├─→ Track Application Status
  │   ├─ Component: ApplicationTracker
  │   ├─ API Call: GET /api/applications/{id}/status
  │   ├─ Display status updates:
  │   │  ├─ Under Review
  │   │  ├─ Documents Requested
  │   │  ├─ Approved
  │   │  ├─ Rejected
  │   │  └─ Processing
  │   │
  │   └─ System sends notifications for status changes
  │
  ├─→ Approval & Benefits
  │   ├─ Admin approves application
  │   ├─ Generate approval certificate
  │   ├─ Citizen downloads certificate
  │   └─ Benefits become active
  │
  └─→ END
```

---

## V. Error Handling

### Error Types & Response Handling

| Error Type | HTTP Code | Frontend Handling | User Message |
|------------|-----------|------------------|--------------|
| Validation Error | 400 | Show form errors | "Please check the highlighted fields" |
| Unauthorized | 401 | Redirect to login | "Session expired, please login again" |
| Forbidden | 403 | Show access denied | "You don't have permission to access this" |
| Not Found | 404 | Show 404 page | "Resource not found" |
| Server Error | 500 | Show error toast | "Server error occurred, please try again" |
| Network Error | N/A | Show retry button | "Network connection failed" |

### Error Handling Flow

```
API Request
  │
  ├─→ axiosInstance interceptor catches error
  │
  ├─→ Error Classification
  │   ├─ Network error? → Show retry option
  │   ├─ Auth error (401)? → Clear storage, redirect to login
  │   ├─ Validation error (400)? → Display form errors
  │   └─ Server error (500)? → Show error message with support contact
  │
  ├─→ Error Logging
  │   ├─ Log to console in development
  │   ├─ Send to error tracking service in production
  │   └─ Store in local logs for debugging
  │
  ├─→ User Notification
  │   ├─ Toast notification with error message
  │   ├─ Modal for critical errors
  │   └─ Form field validation messages
  │
  └─→ Recovery Options
     ├─ Retry button for transient failures
     ├─ Go back option for not found
     ├─ Contact support for critical issues
     └─ Auto-clear error after 5 seconds
```

### Global Error Handling

```jsx
// axiosInstance.js error interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      storage.clear();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 500) {
      showError('Server error occurred');
    }
    
    if (!error.response) {
      showError('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);
```

---

## VI. Development & Deployment

### Environment Setup

**Development**: http://localhost:5173
**Production**: To be configured

### Key Environment Variables
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix code
npm run lint
```

### Build Process

```
Source Code (React/JSX)
  ↓
Vite Bundler
  ↓
Optimized Bundle
  ↓
Assets (CSS, JS, Images)
  ↓
Production Build
```

---

## Summary

The Finance Gov Register system provides a comprehensive platform for:

1. **Program Management**: Create, update, and delete financial programs
2. **Budget Tracking**: Allocate and monitor budget usage
3. **Compliance Management**: Track and verify program compliance
4. **Audit Trail**: Maintain audit logs and generate audit reports
5. **Citizen Services**: Allow citizens to apply for assistance
6. **Reporting & Analytics**: Generate detailed system reports

All components work together through a centralized API gateway, with proper error handling, authentication, and role-based access control to ensure a secure and reliable system.

