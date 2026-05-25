import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { RefreshCw, Search, History } from 'lucide-react';
import './OfficerAllApplications.css';

const OfficerAllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/applications/fetchAll');
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching application history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const filteredData = applications.filter(app => {
    const search = searchTerm.trim();
    const entityIdMatch = !search || app.entityId.toString().includes(search);
    const statusMatch = statusFilter === "all" || app.status.toUpperCase() === statusFilter.toUpperCase();
    return entityIdMatch && statusMatch;
  });

  return (
    <div className="history-view-container">
      {/* HEADER SECTION */}
      <div className="view-header-section mb-4">
        <div className="header-left">
          <h2 className="d-flex align-items-center gap-2">
            <History size={28} className="text-primary" /> 
            Application History
          </h2>
          <p className="text-muted">Full record of subsidy applications processed by the system.</p>
        </div>
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="search-action-bar mb-4">
        <div className="filter-controls">
          <div className="search-input-group">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="form-control search-field"
              placeholder="Search by Entity ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-control status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={fetchHistory}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Sync Records
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table officer-table mb-0">
            <thead className="table-light">
              <tr>
                <th>ENTITY ID</th>
                <th>PROGRAM ID</th>
                <th>SUBMISSION DATE</th>
                <th className="text-center">CURRENT STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-5">Loading history...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    {searchTerm ? `No records found for Entity ID: ${searchTerm}` : "No records found."}
                  </td>
                </tr>
              ) : (
                filteredData.map(app => (
                  <tr key={app.applicationId}>
                    <td className="fw-bold text-primary">{app.entityId}</td>
                    <td>{app.programId}</td>
                    <td>{app.submittedDate}</td>
                    <td className="text-center">
                      <span className={`status-pill ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerAllApplications;