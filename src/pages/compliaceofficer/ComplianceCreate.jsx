import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as complianceApi from "../../api/complianceApi";

const ComplianceCreate = ({ onCreated, onCancel }) => {
  const navigate = useNavigate();

  const [complianceForm, setComplianceForm] = useState({
    entityId: '',
    referenceId: '',
    type: 'TAX',
  });
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const getReferenceLabel = () => {
    switch (complianceForm.type) {
      case 'TAX':
        return 'Tax ID';
      case 'SUBSIDY':
        return 'Subsidy ID';
      case 'PROGRAM':
        return 'Program ID';
      default:
        return 'Reference ID';
    }
  };

  const handleInputChange = (field, value) => {
    setComplianceForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!complianceForm.entityId.trim()) errors.entityId = 'Entity ID is required';
    if (!complianceForm.referenceId.trim()) {
      errors.referenceId = `${getReferenceLabel()} is required`;
    }
    if (notes.length > 1000) {
      errors.notes = 'Notes must not exceed 1000 characters';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    try {
      await complianceApi.create({
        ...complianceForm,
        notes,
      });
      toast.success('Compliance record created successfully.');
      if (onCreated) onCreated();
      navigate('/compliance/list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create compliance record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Create Compliance Entry</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small">
                ENTITY ID <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${formErrors.entityId ? 'is-invalid' : ''}`}
                inputMode="numeric"
                value={complianceForm.entityId}
                onChange={(e) =>
                  handleInputChange('entityId', e.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter Entity ID"
              />
              {formErrors.entityId && (
                <div className="invalid-feedback">{formErrors.entityId}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small">COMPLIANCE TYPE</label>
              <select
                className="form-select"
                value={complianceForm.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="TAX">TAX</option>
                <option value="SUBSIDY">SUBSIDY</option>
                <option value="PROGRAM">PROGRAM</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small">
                {getReferenceLabel().toUpperCase()} <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${formErrors.referenceId ? 'is-invalid' : ''}`}
                inputMode="numeric"
                value={complianceForm.referenceId}
                onChange={(e) =>
                  handleInputChange('referenceId', e.target.value.replace(/\D/g, ''))
                }
                placeholder={`Enter ${getReferenceLabel()}`}
              />
              {formErrors.referenceId && (
                <div className="invalid-feedback">{formErrors.referenceId}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small">NOTES</label>
              <textarea
                className={`form-control ${formErrors.notes ? 'is-invalid' : ''}`}
                rows="3"
                maxLength={1000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: 'none' }}
                placeholder="Optional notes..."
              />
              {formErrors.notes && <div className="invalid-feedback">{formErrors.notes}</div>}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => (onCancel ? onCancel() : navigate(-1))}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Create Record'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCreate;