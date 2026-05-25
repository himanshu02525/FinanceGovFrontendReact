// src/roles/Citizen/aeshaModule3/CitizenPrograms.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';
import Footer from '../../layout/Footer'; 
import './CitizenPrograms.css';

const DescriptionCell = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;
  if (text.length <= maxLength) return <p className="prog-description">{text}</p>;

  return (
    <div className="description-container">
      <p className="prog-description">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
        <button className="read-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? ' Show Less' : ' Read More'}
        </button>
      </p>
    </div>
  );
};

const CitizenPrograms = ({ defaultView = 'available' }) => {
  const [programs, setPrograms] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [view, setView] = useState(defaultView);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('ALL');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const activeEntityId = Number(localStorage.getItem('activeEntityId'));

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch available programs
      const progRes = await axiosInstance.get('/programs/fetchAll');
      setPrograms(Array.isArray(progRes.data) ? progRes.data : [progRes.data]);

      // Fetch applications for this specific citizen based on activeEntityId
      if (activeEntityId) {
        const appRes = await axiosInstance.get(`/applications/fetchByEntity/${activeEntityId}`);
        setMyApplications(Array.isArray(appRes.data) ? appRes.data : []);
      }
    } catch (err) {
      if (err.response?.status !== 404) triggerToast("Failed to sync data.", "error");
      else setMyApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setView(defaultView); }, [defaultView]);
  useEffect(() => { fetchData(); }, [view]);

  const getProgram = (programId) => {
    return programs.find(p => Number(p.programId) === Number(programId));
  };

  const isAlreadyApplied = (programId) => {
    return myApplications.some(app => Number(app.programId) === Number(programId));
  };

  const getProgramStatus = (program) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(program.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(program.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    // Check if end date has passed
    if (endDate < today) {
      return { status: 'CLOSED', isDisabled: true, displayText: 'Closed' };
    }
    
    // Check if start date is far in the future (more than 7 days away)
    const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    if (daysUntilStart > 7) {
      return { status: 'COMING_SOON', isDisabled: true, displayText: 'Coming Soon' };
    }
    
    // If start date hasn't reached yet but within 7 days
    if (startDate > today) {
      return { status: 'NOT_STARTED', isDisabled: true, displayText: 'Not Started' };
    }
    
    // Program is active
    return { status: 'ACTIVE', isDisabled: false, displayText: program.status };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredApplications = applicationStatusFilter === 'ALL'
    ? myApplications
    : myApplications.filter(app => app.status === applicationStatusFilter);

  const filteredPrograms = programFilter === 'ALL' 
    ? programs
    : programFilter === 'APPLIED'
      ? programs.filter(prog => isAlreadyApplied(prog.programId))
      : programs.filter(prog => !isAlreadyApplied(prog.programId));

  const handleApplyClick = async (program) => {
    setApplyingId(program.programId);
    try {
      const loggedInUserId = Number(localStorage.getItem('userId'));
      const request = {
        userId: loggedInUserId,
        entityId: activeEntityId,
        programId: program.programId,
        submittedDate: new Date().toISOString().split('T')[0]
      };
      await axiosInstance.post('/applications/save', request);
      triggerToast(`Application for ${program.title} submitted successfully!`);
      fetchData();
    } catch (err) {
      triggerToast("Application failed.", "error");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="programs-view">
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className={`toast-notification ${toast.type}`}
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="view-fixed-header">
        <div className="view-header">
          <div className="header-text">
            <h2>{view === 'available' ? 'Available Programs' : 'My Applications'}</h2>
            <p>{view === 'available' ? 'Browse and apply for financial assistance.' : 'Track your submitted requests.'}</p>
          </div>
          <button className="refresh-btn" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 
            {loading ? ' Syncing...' : ' Refresh List'}
          </button>
        </div>
      </div>

      <div className="scrollable-content-area">
        {view !== 'available' && (
          <div className="mb-3">
            <label className="form-label">Filter by Status</label>
            <select 
              className="form-select" 
              value={applicationStatusFilter} 
              onChange={(e) => setApplicationStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        )}

        {view === 'available' && (
          <div className="mb-3">
            <label className="form-label">Filter Programs</label>
            <select 
              className="form-select" 
              value={programFilter} 
              onChange={(e) => setProgramFilter(e.target.value)}
            >
              <option value="ALL">All Programs</option>
              <option value="AVAILABLE">Available to Apply</option>
              <option value="APPLIED">Already Applied</option>
            </select>
          </div>
        )}

        <div className="programs-table-container">
          <div className={`table-header ${view === 'available' ? 'available-grid' : 'applications-grid'}`}>
            <span key="col1">{view === 'available' ? 'PROGRAM DETAILS' : 'PROGRAM NAME'}</span>
            {view === 'available' && <span key="col-start">START DATE</span>}
            {view === 'available' && <span key="col-end">END DATE</span>}
            <span key="col2">{view === 'available' ? 'BUDGET' : 'SUBMITTED DATE'}</span>
            <span key="col3">{view === 'available' ? 'STATUS' : 'STATUS'}</span>
            {view === 'available' && <span key="col4">ACTION</span>}
          </div>

          <div className="table-body">
            {loading ? (
              <div className="loading-state">Updating records...</div>
            ) : view === 'available' ? (
              filteredPrograms.map(prog => {
                const applied = isAlreadyApplied(prog.programId);
                const programStatus = getProgramStatus(prog);
                return (
                  <div key={prog.programId} className="table-row available-grid">
                    <div className="prog-info">
                      <span className="prog-name">{prog.title}</span>
                      <DescriptionCell text={prog.description} />
                    </div>
                    <div className="prog-start-date">{formatDate(prog.startDate)}</div>
                    <div className="prog-end-date">{formatDate(prog.endDate)}</div>
                    <div className="prog-budget">₹{Number(prog.budget).toLocaleString('en-IN')}</div>
                    <div className="prog-status">
                      <span className={`status-badge ${programStatus.status?.toLowerCase()}`}>{programStatus.displayText}</span>
                    </div>
                    <div className="prog-actions">
                      <button 
                        className={`apply-now-btn ${applied ? 'applied' : ''} ${programStatus.isDisabled ? 'disabled' : ''}`}
                        disabled={programStatus.isDisabled || applied || applyingId === prog.programId}
                        onClick={() => handleApplyClick(prog)}
                      >
                        {applyingId === prog.programId ? <Loader2 size={14} className="animate-spin" /> : 
                         applied ? "Applied" : programStatus.isDisabled ? programStatus.displayText : "Apply"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              filteredApplications.map(app => (
                <div key={app.applicationId} className="table-row applications-grid">
                  <div className="prog-id">{getProgram(app.programId)?.title || `Program #${app.programId}`}</div>
                  <div className="app-date">{app.submittedDate}</div>
                  <div className="app-status">
                    <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPrograms;