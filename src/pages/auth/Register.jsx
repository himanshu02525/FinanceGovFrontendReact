import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Coins, TrendingUp, Landmark, DollarSign, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';
import './Auth.css';
 
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
 
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
 
  // ✅ FIELD VALIDATION
  const validateField = (name, value) => {
    let error = "";
 
    if (name === "username") {
      if (!value.trim()) error = "Username is required";
      else if (value.length < 4 || value.length > 20)
        error = "Username must be 4–20 characters";
    }
 
    if (name === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email is required";
      else if (!value.includes("@"))
        error = "Email must contain '@'";
      else if (!regex.test(value))
        error = "Enter valid format: example@domain.com";
    }
 
    if (name === "phone") {
      if (!value) error = "Phone is required";
      else if (!/^[0-9]{10}$/.test(value))
        error = "Enter valid 10-digit phone number";
    }
 
    if (name === "password") {
      const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
 
      if (!value) error = "Password is required";
      else if (!regex.test(value))
        error = "Min 8 chars, include uppercase, lowercase, number & special char";
    }
 
    setErrors(prev => ({ ...prev, [name]: error }));
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
 
    validateField(name, value);
  };
 
  // ✅ SUBMIT
  const handleRegister = async (e) => {
    e.preventDefault();
 
    const hasErrors = Object.values(errors).some(err => err);
    if (hasErrors) {
      toast.error("Please fix errors before submitting");
      return;
    }
 
    setIsSubmitting(true);
 
    try {
      await axiosInstance.post('/api/auth/register', formData);
      toast.success("Registration Successful!");
      navigate('/login');
 
    } catch (err) {
      console.log("Backend Error:", err.message);
 
      let message = err.message   || "Registration failed. Please try again.";
 
      // ✅ Get backend message
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (typeof err.response?.data === "string") {
        message = err.response.data;
      }
 
      // ✅ Show toast
      toast.error(message);
 
      // ✅ Map error to field (VERY IMPORTANT 🔥)
      const newErrors = {};
 
      if (message.toLowerCase().includes("username")) {
        newErrors.username = message;
      }
 
      if (message.toLowerCase().includes("email")) {
        newErrors.email = message;
      }
 
      if (message.toLowerCase().includes("phone")) {
        newErrors.phone = message;
      }
 
      setErrors(prev => ({
        ...prev,
        ...newErrors
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const floatAnimation = (initialY, delay, duration) => ({
    initial: { y: initialY, opacity: 0, scale: 0.8 },
    animate: {
      y: '-15vh',
      opacity: [0, 0.65, 0.65, 0],
      rotate: 360,
      scale: [0.8, 1.1, 1.1, 0.8],
      transition: { duration, repeat: Infinity, delay, ease: "linear" }
    }
  });
 
  return (
    <div className="auth-page">
 
      {/* Floating Icons */}
      <div className="floating-background-tracks">
        <motion.div className="floating-icon" {...floatAnimation('30vh', 0, 7)} style={{ left: '6%' }}><Coins size={44}/></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('65vh', 0, 5)} style={{ left: '22%' }}><TrendingUp size={52}/></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('15vh', 0, 8)} style={{ left: '47%' }}><Landmark size={40}/></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('80vh', 0, 6)} style={{ left: '70%' }}><DollarSign size={56}/></motion.div>
        <motion.div className="floating-icon" {...floatAnimation('45vh', 0, 7.5)} style={{ left: '91%' }}><Wallet size={42}/></motion.div>
      </div>
 
      {/* Back */}
      <button className="auth-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18}/> Back to Home
      </button>
 
      <div className="auth-wrapper">
 
        {/* LEFT */}
        <div className="auth-left">
          <h1 className="brand-title">
            <span className="finance">Finance</span>
            <span className="gov">Gov</span>
          </h1>
 
          <p className="tagline">
            National Financial Regulation & Economic Governance System
          </p>
        </div>
 
        {/* RIGHT */}
        <div className="auth-right text-start">
          <div className="login-card">
 
            <h2>Create Account</h2>
 
            <form onSubmit={handleRegister}>
 
              <div className="mb-3">
                <label>Full Name</label>
                <input name="username" onChange={handleChange}
                  className={errors.username ? "input-error" : ""}/>
                {errors.username && <small className="error">{errors.username}</small>}
              </div>
 
              <div className="mb-3">
                <label>Email</label>
                <input name="email" onChange={handleChange}
                  className={errors.email ? "input-error" : ""}/>
                {errors.email && <small className="error">{errors.email}</small>}
              </div>
 
              <div className="mb-3">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <small className="error">{errors.phone}</small>}
              </div>
 
              <div className="mb-3">
                <label>Password</label>
                <input type="password" name="password"
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}/>
                {errors.password && <small className="error">{errors.password}</small>}
              </div>
 
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "REGISTER"}
              </button>
 
            </form>
 
            <div className="register-link">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
 
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Register;