import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, LogOut, LogIn } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const resolveDisplayName = (userObject) => {
    if (!userObject) return '';
    const cachedProfile = localStorage.getItem('citizenProfile');
    if (cachedProfile) {
      try {
        const parsedProfile = JSON.parse(cachedProfile);
        if (parsedProfile?.name) return parsedProfile.name;
      } catch (e) {
        // ignore
      }
    }
    if (userObject.name) return userObject.name;
    if (userObject.username && !userObject.username.includes('@')) return userObject.username;
    return userObject.email || '';
  };

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUser = localStorage.getItem('user');

    setIsLoggedIn(!!token);
    setRole(storedRole);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      const updatedRole = localStorage.getItem('role');
      const updatedUser = localStorage.getItem('user');

      setIsLoggedIn(!!updatedToken);
      setRole(updatedRole);
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    window.location.href = '/';
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const getRoleDisplay = (roleStr) => {
    if (!roleStr) return '';
    return roleStr.replace('ROLE_', '').replace('_', ' ');
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="header-container">
        <div className="header-brand">
          <motion.div
            className="header-logo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 size={32} />
          </motion.div>
          <div className="brand-text">
            <h1><span className="finance">Finance</span><span className="gov">Gov</span></h1>
          </div>
        </div>

        <div className="header-info">
          {isLoggedIn ? (
            <div className="user-info">
              <div className="role-badge">
                {getRoleDisplay(role)}
              </div>
              {user && (
                <span className="username">
                  {resolveDisplayName(user)}
                </span>
              )}
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            window.location.pathname !== '/login' && (
              <button className="login-btn" onClick={handleLogin} title="Login">
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
