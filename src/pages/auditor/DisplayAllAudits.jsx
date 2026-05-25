import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmptyState,
  RefetchButton,
  Loader,
  SearchBar,
  StatusBadge,
  RecordsTable,
} from "../../core/registry";
import * as auditApi from "../../api/auditApi";

const DisplayAllAudits = () => {
  const navigate = useNavigate();

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditApi.getAll();
      setAudits(data || []);
    } catch (err) {
      setError("Failed to fetch audits.");
      console.error("Error fetching audits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const displayedRecords = useMemo(() => {
    let filtered = audits || [];
    if (filterText.trim()) {
      const s = filterText.toLowerCase();
      filtered = filtered.filter((r) =>
        Object.values(r).some((v) => String(v || "").toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [audits, filterText]);

  // Actions
  const handleView = (id) => navigate(`/audit/${id}`);
  const handleEdit = (id) => navigate(`/audit/${id}/edit`);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && audits.length === 0) return <Loader message="Loading audits..." />;
  if (error) return <EmptyState message={error} />;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-secondary">Audit Management</h4>
        <RefetchButton onClick={fetchAudits} />
      </div>

      <div className="card shadow-sm border-0 p-3">
        <SearchBar
          placeholder="Filter audits..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <RecordsTable
          columns={[
            { key: "auditId", label: "ID" },
            {
              key: "scope",
              label: "Scope",
              render: (v) => (
                <span className="badge bg-light text-dark border">{v}</span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (v) => <StatusBadge type="status" value={v} />,
            },
            {
              key: "createdAt",
              label: "Created At",
              render: (v) => formatDate(v),
            },
            {
              label: "Actions",
              render: (_, row) => (
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    onClick={() => handleView(row.auditId)}
                  >
                    <i className="bi bi-eye"></i> View
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => handleEdit(row.auditId)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                </div>
              ),
            },
          ]}
          data={displayedRecords}
        />
      </div>
    </div>
  );
};

export default DisplayAllAudits;