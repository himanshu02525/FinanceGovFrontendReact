import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Landmark, DollarSign, Wallet } from "lucide-react";
import "./Auth.css";
import { ArrowLeft } from "lucide-react";


const ForgotPassword = () => {

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  //  SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(
        `/api/auth/request-otp?email=${email}`
      );

      toast.success("OTP sent ✅");
      setStep(2);
    } catch {
      toast.error("Failed to send OTP ❌");
    }
  };

  //  RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(
        "/api/auth/verify-and-update-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      toast.success("Password updated ✅");
      navigate("/login");
    } catch {
      toast.error("Invalid OTP ❌");
    }
  };

  const floatAnimation = (delay, duration) => ({
    initial: { y: '110vh', opacity: 0, scale: 0.7 },
    animate: {
      y: '-10vh',
      opacity: [0, 0.65, 0.65, 0], 
      rotate: 360,
      scale: [0.7, 1.1, 1.1, 0.7],
      transition: { duration: duration, repeat: Infinity, delay: delay, ease: "linear" }
    }
  });

  return (
    <div className="auth-page">

      {/* ===== FLOATING BACKGROUND TRACKS ===== */}
      <div className="floating-background-tracks">
        <motion.div className="floating-icon" {...floatAnimation(0, 22)} style={{ left: '6%' }}><Coins size={44} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(4, 17)} style={{ left: '22%' }}><TrendingUp size={52} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(1, 26)} style={{ left: '47%' }}><Landmark size={40} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(6, 19)} style={{ left: '70%' }}><DollarSign size={56} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(2, 24)} style={{ left: '91%' }}><Wallet size={42} /></motion.div>
      </div>

      <div className="auth-wrapper">

        {/*  KEEP LEFT PANEL (IMPORTANT FOR GOOD UI) */}
        <div className="auth-left">

          <h1 className="brand-title">
            <span className="finance">Finance</span>
            <span className="gov">Gov</span>
          </h1>

          <p className="tagline">
            Secure password recovery system
          </p>

          <ul>
            <li>✔ Email OTP verification</li>
            <li>✔ Secure password update</li>
            <li>✔ Encrypted authentication</li>
          </ul>

        </div>

        {/* ✅ RIGHT PANEL */}
        <div className="auth-right">

          <div className="login-card">

            <h2>Reset Password</h2>

            <p className="subtitle">
              {step === 1
                ? "Enter your email to receive OTP"
                : "Enter OTP and new password"}
            </p>

            {/* ✅ STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">
                  Send OTP
                </button>

              </form>
            )}

            {/* ✅ STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleResetPassword}>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button type="submit">
                  Reset Password
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;