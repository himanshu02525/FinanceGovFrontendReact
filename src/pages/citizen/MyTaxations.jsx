import React, { useEffect, useState } from 'react';
import { apiClient } from '@api/aravind';
import { getEntityId, getMissingIdsMessage } from '@api/storage';
import { statusBadgeClass, taxStatusLabels } from '@api/status';
 
const MyTaxations = () => {
  const [taxations, setTaxations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
 
  const entityId = getEntityId();
 
  const loadTaxations = async () => {
    setError(null);
    if (!entityId) {
      setError(getMissingIdsMessage());
      return;
    }
 
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/taxation/taxrecords/entity/${entityId}`);
      setTaxations(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load taxation history.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadTaxations();
  }, []);
 
  const filteredTaxations = statusFilter === 'ALL'
    ? taxations
    : taxations.filter(t => t.status === statusFilter);
 
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Taxation History</h2>
          <p className="text-muted">Fetch taxation records for your entity ID.</p>
        </div>
        <button className="btn btn-outline-primary" onClick={loadTaxations} disabled={loading}>
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
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="OVERDUE_PAID">Overdue_Paid</option>
          <option value="REJECTED">Rejected</option>
          <option value="VERIFIED_INITIAL">Verified Initial</option>
          <option value="VERIFIED_FINAL">Verified Final</option>
        </select>
      </div>
 
      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-hover mb-0" style={{ tableLayout: 'auto' }}>
          <thead className="table-light">
            <tr>
              <th style={{ width: '12%', textAlign: 'center' }}>Year</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Amount</th>
              <th style={{ width: '25%', textAlign: 'center' }}>Status</th>
              <th style={{ width: '43%', textAlign: 'left' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading records…
                </td>
              </tr>
            ) : filteredTaxations.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No taxation records found.
                </td>
              </tr>
            ) : (
              filteredTaxations.map((record) => (
                <tr key={record.taxId}>
                  <td style={{ textAlign: 'center' }}>{record.year}</td>
                  <td style={{ textAlign: 'center' }}>₹{record.amount}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge bg-${statusBadgeClass(record.status)}`}>
                      {taxStatusLabels[record.status] || record.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'left' }}>{new Date(record.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default MyTaxations;
 
 