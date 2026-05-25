import React, { useEffect, useState } from 'react';
import { apiClient } from '@api/aravind';
import { getEntityId, getMissingIdsMessage } from '@api/storage';
import { statusBadgeClass, disclosureStatusLabels } from '@api/status';
 
const MyDisclosures = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
 
  const entityId = getEntityId();
 
  const loadDisclosures = async () => {
    setError(null);
    if (!entityId) {
      setError(getMissingIdsMessage());
      return;
    }
 
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/disclosure/entity/${entityId}`);
      setDisclosures(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load disclosure history.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadDisclosures();
  }, []);
 
  const filteredDisclosures = statusFilter === 'ALL'
    ? disclosures
    : disclosures.filter(d => d.status === statusFilter);
 
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Disclosure History</h2>
          <p className="text-muted">Fetch disclosure records for your entity ID.</p>
        </div>
        <button className="btn btn-outline-primary" onClick={loadDisclosures} disabled={loading}>
          Refresh
        </button>
      </div>
 
      {error && <div className="alert alert-danger">{error}</div>}
 
      <div className="mb-3">
        <label className="form-label">Filter by Status</label>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="SUBMITTED">Pending</option>
          <option value="VALIDATED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
 
      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-hover mb-0" style={{ tableLayout: 'auto' }}>
          <thead className="table-light">
            <tr>
              <th style={{ width: '25%', textAlign: 'left' }}>Type</th>
              <th style={{ width: '30%', textAlign: 'center' }}>Status</th>
              <th style={{ width: '45%', textAlign: 'left' }}>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Loading records…
                </td>
              </tr>
            ) : disclosures.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No disclosure records found.
                </td>
              </tr>
            ) : (
              filteredDisclosures.map((record) => (
                <tr key={record.disclosureId}>
                  <td style={{ textAlign: 'left' }}>{record.type}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge bg-${statusBadgeClass(record.status)}`}>
                      {disclosureStatusLabels[record.status] || record.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'left' }}>{new Date(record.submissionDate).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default MyDisclosures;
 
 