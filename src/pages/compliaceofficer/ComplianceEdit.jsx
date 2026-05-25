import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EmptyState, Loader } from '../../core/registry';
import * as complianceApi from "../../api/complianceApi";

const ComplianceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({ result: 'PENDING', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      loadComplianceById(id);
    }
  }, [id]);

  const loadComplianceById = async (complianceId) => {
    setLoading(true);
    try {
      const data = await complianceApi.getById(complianceId);
      if (data) {
        setRecord(data);
        setForm({
          result: data.result || 'PENDING',
          notes: data.notes || '',
        });
      } else {
        setErrorMsg('Compliance record not found.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load compliance record.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    if (!form.result || String(form.result).trim() === '') err.result = 'Result is required';
    if (form.notes && form.notes.length > 1000) err.notes = 'Notes max 1000 chars';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    setLoading(true);
    const response = await complianceApi.update(id, form);

    // Shows backend success message
    toast.success(response.data?.message || 'Update successful');
    navigate('/compliance/list');
    
  } catch (err) {
    // This specifically targets the { message: '...' } object in your log
    const backendMessage = err.response?.data?.message;
    
    // If backendMessage exists, show it. Otherwise, show the generic error or status
    toast.error(backendMessage || err.message || 'An unexpected error occurred');
    
    // Optional: Log it so you can see the exact object if it fails again
    console.error("Backend Rejected Request:", backendMessage);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <Loader />;
  if (errorMsg) return <EmptyState message={errorMsg} />;
  if (!record) return null;

  return (
    <div className="container py-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-4">Edit Compliance #{record.complianceId}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small">RESULT</label>
              <select
                className={`form-select ${errors.result ? 'is-invalid' : ''}`}
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
              >
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="PENDING">PENDING</option>
              </select>
              {errors.result && <div className="invalid-feedback">{errors.result}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold small">NOTES</label>
              <textarea
                maxLength={1000}
                rows="4"
                className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{ resize: 'none' }}
              />
              <div className="d-flex justify-content-between mt-1">
                <div className="text-muted small">{String(form.notes || '').length}/1000</div>
                {errors.notes && <div className="text-danger small">{errors.notes}</div>}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? 'Updating...' : 'Update Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplianceEdit;