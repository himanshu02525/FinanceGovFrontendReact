import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronLeft,
  Plus,
  Zap,
  BarChart2,
  BarChart3,
  X,
  HandCoins,
  UserCheck,
  SquarePlus,
  FileText,
  Users,
  UserPlus,
  ClipboardList,
  Settings,
  FileCheck,
  User,
  LayoutDashboard,
  Search,
  History,
  CreditCard,
  Package,
  CheckSquare
} from 'lucide-react';
import './Sidebar.css';
 
// Role-based navigation configuration
const getNavigationByRole = (role, status) => {
  const roleMap = {
    'ROLE_ADMIN': [
      { id: 401, label: 'Admin Dashboard', to: '/admin/dashboard', icon: BarChart2 },
      { id: 402, label: 'Admin Analytics', to: '/admin/analytics', icon: BarChart3 },
      { id: 403, label: 'All Users', to: '/admin/users', icon: Users },
      { id: 404, label: 'Create Officer', to: '/admin/create-officer', icon: UserPlus },
      { id: 405, label: 'Citizen Management', to: '/admin/citizen-management', icon: UserCheck },
      { id: 406, label: 'Document Verification', to: '/admin/document-verification', icon: FileCheck },
      { id: 407, label: 'Audit Logs', to: '/admin/audit-logs', icon: ClipboardList },
      { id: 408, label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
    'ROLE_PROGRAM_MANAGER': [
      { id: 301, label: 'Dashboard', to: '/program-manager/dashboard', icon: LayoutDashboard },
      { id: 302, label: 'Create Programs', to: '/create-programs', icon: SquarePlus },
      { id: 303, label: 'Create Budget', to: '/create-budget', icon: HandCoins },
      { id: 304, label: 'Allocate Resources', to: '/allocate-resources', icon: Zap },
      { id: 305, label: 'View Summary', to: '/budget-summary', icon: BarChart2 },
    ],
    'ROLE_COMPLIANCE_OFFICER': [
      { id: 101, label: 'Compliance Dashboard', to: '/compliance', icon: BarChart2 },
      { id: 102, label: 'All Compliance', to: '/compliance/list', icon: ClipboardList },
      // { id: 103, label: 'Create Compliance', to: '/compliance/create', icon: Plus },
    ],
    'ROLE_FINANCIAL_OFFICER': [
      { id: 501, label: 'Approve Applications', to: '/officer/applications', icon: FileCheck },
      { id: 502, label: 'View Applications', to: '/officer/all-applications', icon: ClipboardList },
      { id: 503, label: 'Citizen Search', to: '/officer/citizen-search', icon: Search },
      { id: 504, label: 'Verify Taxation', to: '/officer/verify-taxation', icon: Zap },
      { id: 505, label: 'Verify Disclosure', to: '/officer/verify-disclosure', icon: FileText },
    ],
    'ROLE_CITIZEN': [],
    'ROLE_GOVERNMENT_AUDITOR': [
      { id: 201, label: 'Audit Dashboard', to: '/audit', icon: BarChart2 },
      { id: 202, label: 'All Audits', to: '/audit/list', icon: Zap },
      { id: 203, label: 'Create Audit', to: '/audit/create', icon: Plus },
      { id: 205, label: 'Reports Dashboard', to: '/reports', icon: BarChart2 },
      { id: 204, label: 'Create Report', to: '/reports/create', icon: Plus },
      { id: 206, label: 'Analytics Dashboard', to: '/reports/analytics', icon: BarChart2 },
    ],
  };
 
  if (role === 'ROLE_CITIZEN') {
    return getCitizenNavigation(status);
  }
 
  return roleMap[role] || [];
};
 
const getCitizenStatus = () => {
  const storedProfile = localStorage.getItem('citizenProfile');
  if (!storedProfile) return null;
  try {
    const parsed = JSON.parse(storedProfile);
    return parsed?.status?.toUpperCase() || null;
  } catch (error) {
    console.error('Failed to parse citizen profile for status:', error);
    return null;
  }
};
 
const getCitizenNavigation = (status) => {
  const base = [
    { id: 601, label: 'Citizen Registration', to: '/registration', icon: UserCheck },
    { id: 604, label: 'Upload Documents', to: '/documents', icon: FileText },
    { id: 610, label: 'Profile', to: '/profile', icon: User },
  ];
 
  if (status === 'ACTIVE') {
    return [
      ...base,
      { id: 602, label: 'View Programs', to: '/citizen/programs', icon: Package },
      { id: 603, label: 'My Applications', to: '/citizen/my-applications', icon: CheckSquare },
      { id: 605, label: 'Create Disclosure', to: '/citizen/create-disclosure', icon: FileText },
      { id: 606, label: 'Create Taxation', to: '/citizen/create-taxation', icon: Plus },
      { id: 607, label: 'My Taxation History', to: '/citizen/my-taxation-history', icon: History },
      { id: 608, label: 'Tax Payment', to: '/citizen/payment-screen', icon: CreditCard },
      { id: 609, label: 'My Disclosure History', to: '/citizen/my-disclosure-history', icon: History },
    ];
  }
 
  return base;
};
 
export const Sidebar = ({ onToggle, initialState = true }) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
 
  const getDisplayName = (userObject) => {
    if (!userObject) return 'Guest';
 
    const cachedProfile = localStorage.getItem('citizenProfile');
    if (cachedProfile) {
      try {
        const parsedProfile = JSON.parse(cachedProfile);
        if (parsedProfile?.name) return parsedProfile.name;
      } catch (error) {
        console.error('Error parsing citizen profile for display name:', error);
      }
    }
 
    if (userObject.name) return userObject.name;
    if (userObject.username && !userObject.username.includes('@')) return userObject.username;
    return 'Guest';
  };
 
  useEffect(() => {
    // Get role from localStorage and set navigation
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    setNavigationItems(getNavigationByRole(storedRole, getCitizenStatus()));
 
    // Listen for storage changes (to detect login from other components)
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role');
      setRole(updatedRole);
      setNavigationItems(getNavigationByRole(updatedRole, getCitizenStatus()));
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
 
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
 
  const handleProfileClick = () => {
    navigate('/profile');
  };
 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);
 
  useEffect(() => {
    if (role !== 'ROLE_CITIZEN') return;
 
    const refreshCitizenNav = () => {
      setNavigationItems(getNavigationByRole(role, getCitizenStatus()));
    };
 
    const intervalId = setInterval(refreshCitizenNav, 5000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshCitizenNav();
      }
    };
 
    window.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [role]);
 
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };
 
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };
 
  // Don't show sidebar if not logged in
  if (!role) {
    return null;
  }
 
  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        className="sidebar-toggle-mobile"
        onClick={toggleMobileSidebar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>
 
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="sidebar-overlay"
            onClick={toggleMobileSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
 
      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isOpen ? 'expanded' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''
          }`}
        initial={false}
        animate={{
          width: isOpen ? '280px' : '80px',
        }}
        transition={{ duration: 0.1 }}
 
 
      >
        {/* Desktop Toggle Button */}
        <motion.button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </motion.button>
 
        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon size={20} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </motion.div>
            );
          })}
        </nav>
 
        {/* Footer Info */}
        {isOpen && role === 'ROLE_CITIZEN' && (
          <motion.div
            className="sidebar-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button type="button" className="sidebar-info sidebar-user-info sidebar-profile-button" onClick={handleProfileClick}>
              <div className="user-profile-icon">
                <User size={20} />
              </div>
              <div>
                <p className="sidebar-user-name">{getDisplayName(user)}</p>
              </div>
            </button>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
};
 
export default Sidebar;