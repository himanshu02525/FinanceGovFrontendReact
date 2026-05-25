import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, Users, ShieldCheck, ArrowRight, 
  Home as HomeIcon, ChevronDown, ChevronUp, 
  Coins, TrendingUp, DollarSign, Wallet, 
  Globe, FileText, Activity, Shield
} from 'lucide-react';
import { toast } from 'react-toastify';
import './Home.css';

export const Home = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const [expandedCard, setExpandedCard] = useState(null);

  const handleViewPrograms = () => {
    if (!isAuthenticated) {
      toast.error("Unable to access programs. Please login first.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } else {
      window.location.href = '/programs';
    }
  };

  const verticals = [
    {
      title: "Beneficiary Led Construction",
      desc: "Provides financial assistance to individual families to construct new houses on their own land.",
      moreInfo: "Eligible families receive technical support and phased fund releases based on construction milestones to ensure quality housing standards.",
      tag: "Direct Support"
    },
    {
      title: "Affordable Housing in Partnership",
      desc: "Central assistance for owning a house in partnership with public and private agencies.",
      moreInfo: "This vertical encourages private sector participation through incentives, ensuring urban poor have access to modern residential amenities.",
      tag: "PPP Module"
    },
    {
      title: "Affordable Rental Housing",
      desc: "Constructing rental housing for urban poor and industrial workers to ensure mobility.",
      moreInfo: "Focuses on providing dignified living spaces near workplaces for migrants and industrial labor, reducing slum proliferation.",
      tag: "Urban Mobility"
    },
    {
      title: "Interest Subsidy Scheme",
      desc: "Subsidy provided on home loans sanctioned for eligible low-income groups.",
      moreInfo: "Up to 6.5% interest subvention is provided on home loans, significantly reducing the EMI burden for first-time home buyers.",
      tag: "Credit Linked"
    }
  ];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="home-dashboard-wrapper">
      {/* High-Contrast Floating Particle Canvas */}
      <div className="floating-background-tracks">
        <motion.div className="floating-icon" {...floatAnimation(0, 22)} style={{ left: '6%' }}><Coins size={44} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(4, 17)} style={{ left: '22%' }}><TrendingUp size={52} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(1, 26)} style={{ left: '47%' }}><Landmark size={40} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(6, 19)} style={{ left: '70%' }}><DollarSign size={56} /></motion.div>
        <motion.div className="floating-icon" {...floatAnimation(2, 24)} style={{ left: '91%' }}><Wallet size={42} /></motion.div>
      </div>

      <div className="container-fluid p-0 position-relative content-layer">
        
        {/* ================= HERO REGION ================= */}
        <div className="container min-vh-90 d-flex align-items-center py-5">
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="row w-100 align-items-center"
          >
            <div className="col-lg-8 text-start">
              <motion.div variants={itemVariants} className="badge-gov mb-4 d-inline-flex align-items-center gap-2">
                <span className="live-pulse"></span> Security-Cleared Core Infrastructure
              </motion.div>
              
              {/* Feature Icon + Cleaned Structured Title Block */}
              <motion.div variants={itemVariants} className="d-flex align-items-center gap-3 mb-4 header-alignment-block">
                <div className="hero-inline-icon-wrapper">
                  <Activity size={38} className="text-gold pulse-icon" />
                </div>
                <h1 className="display-4 fw-extrabold main-hero-title m-0">
                  National Financial <br />
                  <span className="gradient-text">Economic Governance</span>
                </h1>
              </motion.div>
              
              <motion.p variants={itemVariants} className="text-muted-custom mb-5">
                A highly optimized, transparent transactional center engineered for processing state fiscal allocations, real-time auditing, and sovereign infrastructure funding modules.
              </motion.p>
              
              <motion.div variants={itemVariants} className="d-flex flex-wrap gap-4 align-items-center mb-5">
                <button className="btn-hero" onClick={handleViewPrograms}>
                  Launch Programs Console <ArrowRight size={20} className="ms-2 arrow-icon" />
                </button>
                <div className="security-notice d-flex align-items-center gap-2">
                  <ShieldCheck size={18} className="text-success-glow" />
                  <span>ISO 27001 Cryptographic Safeguards</span>
                </div>
              </motion.div>

              {/* Data Strip Cards */}
              <motion.div variants={itemVariants} className="row g-4 metric-strip-row">
                <div className="col-sm-6 col-md-5">
                  <div className="metric-strip-item">
                    <div className="icon-box"><Users size={22} /></div>
                    <div>
                      <h3>250k+</h3>
                      <p>Active Node Terminals</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-5">
                  <div className="metric-strip-item">
                    <div className="icon-box"><Activity size={22} /></div>
                    <div>
                      <h3>99.99%</h3>
                      <p>Availability Benchmark</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Redesigned Sleek Asymmetric Graphic Wing */}
            <div className="col-lg-4 d-none d-lg-block position-relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="hero-asymmetric-graphic"
              >
                <div className="graphic-glow-ring"></div>
                <div className="graphic-glow-ring secondary-ring"></div>
                <Globe size={140} className="central-hud-icon" strokeWidth={1.2} />
                <div className="orbiting-nodes">
                  <span className="node n1"><Shield size={18} /></span>
                  <span className="node n2"><FileText size={18} /></span>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* ================= BENTO MATRIX GRID ================= */}
        <section className="programs-showcase-section py-5">
          <div className="container">
            
            <div className="row mb-4">
              <div className="col-12 text-start">
                <span className="section-super-tag">Operational Matrix Allocation</span>
                <h2 className="section-title-premium mt-1">Strategic Architecture Modules</h2>
              </div>
            </div>

            <div className="bento-grid-container">
              
              {/* Core Master Module Box (Bento Layout) */}
              <div className="bento-box feature-box crystal-card row g-0 rounded-5 overflow-hidden mb-5">
                <div className="col-md-4 bento-hero-graphics p-5 d-flex flex-column justify-content-center align-items-center">
                  <div className="floating-housing-wrapper shadow-lg">
                    <HomeIcon size={64} className="housing-icon-main" strokeWidth={1.5} />
                  </div>
                  <h4 className="mt-4 fw-bold hud-label text-center">FinanceGov Housing System</h4>
                </div>
                
                <div className="col-md-8 p-4 p-md-5 text-start border-start-md">
                  <span className="badge-program-tag mb-3">Priority Structural Target</span>
                  <h3 className="fw-bold bento-main-heading mb-3">National Housing Subsidy — Urban 2.0</h3>
                  <p className="desc-text-dark-custom">
                    This automated micro-allocation portal manages state assets assigned to 1 crore registered urban residential workflows. By coordinating instant bank validation queues and distributed ledgers, it guarantees complete transparency across regional accounts.
                  </p>
                  
                  <div className="bento-footer-metrics mt-4 pt-4 border-top-dark d-flex flex-wrap gap-4">
                    <div>
                      <span className="label-sm d-block">Maximum Unit Allocation</span>
                      <strong className="val-md text-gold">₹2.50 Lakh Base Subsidy</strong>
                    </div>
                    <div>
                      <span className="label-sm d-block">Equity Filter Inclusions</span>
                      <strong className="val-md text-silver-bright">EWS Matrix Verification Protocols</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Module Stack Component Cards */}
              <div className="row g-4">
                {verticals.map((item, idx) => (
                  <div className="col-xl-3 col-md-6" key={idx}>
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="card modular-bento-item crystal-card p-4 h-100 d-flex flex-column text-start"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="vertical-mini-tag">{item.tag}</span>
                        <div className="card-dot-indicator"></div>
                      </div>
                      
                      <h5 className="fw-bold vertical-card-title mb-3">{item.title}</h5>
                      <p className="small vertical-card-desc mb-4 flex-grow-1">{item.desc}</p>
                      
                      <AnimatePresence>
                        {expandedCard === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-3"
                          >
                            <p className="small expanded-info-text-custom p-3 rounded-3">{item.moreInfo}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        className="btn-read-more-premium"
                        onClick={() => toggleExpand(idx)}
                      >
                        <span>{expandedCard === idx ? "Collapse Shell" : "Inspect Framework"}</span>
                        {expandedCard === idx ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                      </button>
                    </motion.div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;