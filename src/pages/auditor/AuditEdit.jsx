import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EmptyState, Loader, CharacterAllow } from "../../core/registry";
// Import your service helper instead of axios
import * as auditApi from "../../api/auditApi";

const AuditEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [audit, setAudit] = useState(null);
  const [form, setForm] = useState({ status: "PENDING" });
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (id) {
      loadAuditById(id);
    }
  }, [id]);

  const loadAuditById = async (auditId) => {
    setLoading(true);
    try {
      // Use auditApi.getById helper
      const data = await auditApi.getById(auditId);
      if (data) {
        setAudit(data);
        setForm({ status: data.status || "PENDING" });
        setNotes(data.findings || "");
      } else {
        setErrorMsg("Audit not found.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to load audit.");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    if (!form.status) err.status = "Status required";
    if (notes.length > 1000) err.findings = "Max 1000 chars";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      // Use auditApi.update helper
      await auditApi.update(id, {
        status: form.status,
        findings: notes,
      });
      
      toast.success("Audit updated successfully");
      navigate("/audit/list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update audit.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (errorMsg) return <EmptyState message={errorMsg} />;
  if (!audit) return null; // Safety check if data hasn't loaded yet

  return (
    <div className="container py-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-4">Edit Audit #{audit.auditId}</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">STATUS</label>
              <select
                className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
              {errors.status && <div className="invalid-feedback">{errors.status}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">FINDINGS / NOTES</label>
              <textarea
                className={`form-control ${errors.findings ? 'is-invalid' : ''}`}
                rows="5"
                maxLength={1000}
                placeholder="Enter audit findings here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              {errors.findings && <div className="invalid-feedback">{errors.findings}</div>}

              <div className="mt-1">
                <CharacterAllow
                  count={notes.length}
                  limit={1000}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4">
                Update Audit
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => navigate("/audit/list")}
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

export default AuditEdit;