import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Landmark, DollarSign, Wallet } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { getCitizenByUserId } from '../../api/CitizenAreef';
import { usePreloader } from '../../hooks/usePreloader';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showPreloaderScreen } = usePreloader();

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      const data = response.data;

      /* =========================
         Base STORAGE – SINGLE, CLEAN
         ========================= */

      if (!data || !data.token) {
        throw new Error('Invalid login response');
      }

      // Clear old auth data to avoid corruption
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('entityId');
      localStorage.removeItem('user');

      // Mandatory values
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', String(data.userId));
      localStorage.setItem('role', data.role);

      // Optional: entityId (ROLE_CITIZEN only)
      if (data.role === 'ROLE_CITIZEN' && data.entityId !== undefined) {
        localStorage.setItem('entityId', String(data.entityId));
        localStorage.setItem('activeEntityId', String(data.entityId));
      }

      // Normalized user object (ALWAYS stored)
      const userObject = {
        userId: data.userId,
        role: data.role,
        email: data.email ?? credentials.email,
        username: data.username ?? null
      };

      localStorage.setItem('user', JSON.stringify(userObject));

      // If citizen, fetch and cache the citizen profile so name is available immediately
      if (data.role === 'ROLE_CITIZEN') {
        try {
          const profileResp = await getCitizenByUserId(String(data.userId));
          const profileData = profileResp?.data || profileResp;
          if (profileData) {
            localStorage.setItem('citizenProfile', JSON.stringify(profileData));
            if (!localStorage.getItem('activeEntityId') && profileData.entityId !== undefined) {
              localStorage.setItem('activeEntityId', String(profileData.entityId));
            }
            if (!localStorage.getItem('entityId') && profileData.entityId !== undefined) {
              localStorage.setItem('entityId', String(profileData.entityId));
            }
          }
        } catch (err) {
          // ignore profile fetch failure here; UI will fetch later when user visits profile
          console.warn('Could not fetch citizen profile at login:', err);
        }
      }

      // Notify listeners (navbar, guards, etc.)
      window.dispatchEvent(new Event('storage'));

      console.log('Login stored correctly:', {
        token: data.token,
        userId: data.userId,
        role: data.role,
        entityId: data.entityId,
        user: userObject
      });

      toast.success('Login Successful!');

      // Show preloader immediately
      showPreloaderScreen();

      // Navigate immediately - don't wait for preloader
      switch (data.role) {
        case 'ROLE_ADMIN':
          navigate('/admin/dashboard');
          break;

        case 'ROLE_PROGRAM_MANAGER':
          navigate('/program-manager/dashboard');
          break;

        case 'ROLE_FINANCIAL_OFFICER':
          navigate('/officer/applications');
          break;

        case 'ROLE_CITIZEN':
          navigate('/registration');
          break;

        case 'ROLE_COMPLIANCE_OFFICER':
          navigate('/compliance');
          break;

        case 'ROLE_GOVERNMENT_AUDITOR':
          navigate('/audit');
          break;

        default:
          navigate('/');
      }

    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Adjusted animation engine to change initial starting bounds and boost the speed
  const floatAnimation = (initialY, delay, duration) => ({
    initial: { y: initialY, opacity: 0, scale: 0.8 },
    animate: {
      y: '-15vh',
      opacity: [0, 0.65, 0.65, 0], 
      rotate: 360,
      scale: [0.8, 1.1, 1.1, 0.8],
      transition: { duration: duration, repeat: Infinity, delay: delay, ease: "linear" }
    }
  });

  return (
    <div className="auth-page">

      {/* ===== FLOATING BACKGROUND TRACKS (INSTANT ENTRY & HIGH VELOCITY) ===== */}
      <div className="floating-background-tracks">
        <motion.div className="floating-icon" {...floatAnimation('30vh', 0, 7)} style={{ left: '6%' }}><Coins size={44} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('65vh', 0, 5)} style={{ left: '22%' }}><TrendingUp size={52} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('15vh', 0, 8)} style={{ left: '47%' }}><Landmark size={40} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('80vh', 0, 6)} style={{ left: '70%' }}><DollarSign size={56} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('45vh', 0, 7.5)} style={{ left: '91%' }}><Wallet size={42} /></motion.div>
      </div>

      {/* Back Button */}
      <button
        className="auth-back-btn"
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="auth-wrapper">

        {/* LEFT PANEL */}
        <div className="auth-left">
          <h1 className="brand-title">
            <span className="finance">Finance</span>
            <span className="gov">Gov</span>
          </h1>

          <p className="tagline">
            National Financial Regulation & Economic Governance System
          </p>

          <ul>
            <li>✔ Secure Government Portal</li>
            <li>✔ Manage Financial Programs</li>
            <li>✔ Apply for Subsidies</li>
            <li>✔ Track Compliance & Reports</li>
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="login-card">

            <h2>Sign In</h2>
            <p className="subtitle">Access your secure dashboard</p>

            <form onSubmit={handleLogin}>

              <div className="mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>

              <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'LOGIN'}
              </button>

            </form>

            <div className="register-link">
              New user? <Link to="/register">Register here</Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;