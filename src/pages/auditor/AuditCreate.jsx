import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CharacterAllow } from "../../core/registry";
import * as auditApi from "../../api/auditApi";

const AuditCreate = () => {
  const [form, setForm] = useState({
    officerId: "",
    scope: "PROGRAM",
  });

  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = {};

    if (!form.officerId || String(form.officerId).trim() === "") {
      err.officerId = "Officer ID is required";
    }

    if (notes.length > 1000) {
      err.findings = "Findings max 1000 chars";
    }

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      
      // Use auditApi.create helper instead of axios.post
      await auditApi.create({
        officerId: Number(form.officerId),
        scope: form.scope,
        findings: notes,
      });

      toast.success("Audit record created successfully");
      navigate("/audit/list");
    } catch (error) {
  const backendMessage = error.response?.data?.message;
  const rawData = typeof error.response?.data === 'string' ? error.response.data : null;
  const finalMessage = backendMessage || rawData || error.message || "Failed to create audit";

  toast.error(finalMessage);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="container py-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-4">Create Audit</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small">
                OFFICER ID <span className="text-danger">*</span>
              </label>
              <input
                className={`form-control ${errors.officerId ? 'is-invalid' : ''}`}
                inputMode="numeric"
                pattern="\d*"
                value={form.officerId}
                onChange={(e) =>
                  setForm({ ...form, officerId: e.target.value })
                }
              />
              {errors.officerId && (
                <div className="invalid-feedback">{errors.officerId}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small">SCOPE</label>
              <select
                className="form-select"
                value={form.scope}
                onChange={(e) =>
                  setForm({ ...form, scope: e.target.value })
                }
              >
                <option value="TAX">TAX</option>
                <option value="PROGRAM">PROGRAM</option>
                <option value="SUBSIDY">SUBSIDY</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small">FINDINGS</label>
              <textarea
                className={`form-control ${errors.findings ? 'is-invalid' : ''}`}
                rows="4"
                maxLength={1000}
                style={{ resize: "none" }}
                placeholder="Enter audit findings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="mt-1">
                <CharacterAllow
                  count={notes.length}
                  limit={1000}
                />
              </div>
              {errors.findings && (
                <div className="invalid-feedback">{errors.findings}</div>
              )}
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  "Create Audit"
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => navigate("/audit/list")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditCreate;