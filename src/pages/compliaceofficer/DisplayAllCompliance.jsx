import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DisplayAllCompliance.css';
import { SearchBar, StatusBadge, RecordsTable, EmptyState, Loader, RefetchButton } from '../../core/registry';
import * as complianceApi from "../../api/complianceApi";

const DisplayAllCompliance = () => {
  const [filterText, setFilterText] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complianceApi.getAll();
      setRecords(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load compliance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const displayedRecords = useMemo(() => {
    let filtered = records || [];
    if (filterText && filterText.trim() !== '') {
      const s = filterText.toLowerCase();
      filtered = filtered.filter((r) =>
        Object.values(r).some((v) => String(v || '').toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [records, filterText]);

  return (
    <div>
      <div className="d-flex justify-content-end align-items-end mb-3">
        <RefetchButton onClick={loadRecords} />
      </div>
      <SearchBar
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        onClear={() => {
          setFilterText('');
          loadRecords();
        }}
        onSubmit={() => {}}
        placeholder="Search compliance records..."
      />

      {loading && <Loader message="Loading compliance records..." />}
      {!loading && error && (
        <EmptyState title="Failed to load records" message={String(error)} />
      )}
      {!loading && !error && (
        <RecordsTable
          data={displayedRecords}
          columns={[
            { label: 'ID', key: 'complianceId' },
            { label: 'Entity', key: 'entityId' },
            { label: 'Type', key: 'type' },
            { label: 'Result', key: 'result', render: (v) => <StatusBadge type="result" value={v} /> },
            { label: 'Created', key: 'createdAt', render: (v) => (v ? new Date(v).toLocaleString() : '') },
            {
              label: 'Action', render: (_, row) => (
                <div className="action-td">
                  <button className="btn btn-sm btn-link view-btn" onClick={() => navigate(`/compliance/${row.complianceId}`)}>View</button>
                  <button className="btn btn-sm btn-outline-primary ms-2 edit-btn" onClick={() => navigate(`/compliance/${row.complianceId}/edit`)}>Edit</button>
                </div>
              )
            }
          ]}
        />
      )}
    </div>
  );
};

export default DisplayAllCompliance;