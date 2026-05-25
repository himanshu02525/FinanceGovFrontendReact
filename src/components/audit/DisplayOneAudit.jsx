import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DisplayOneAudit.css';
import { StatusBadge, DetailCard, RefetchButton } from '../../core/registry';

const DisplayOneAudit = ({ audit, onRefresh }) => {
  const navigate = useNavigate();

  return (
    <div className="audit-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Audit Details</h3>
        <RefetchButton onClick={onRefresh}/>
      </div>

      <DetailCard
        title={`Audit #${audit.auditId}`}
        subtitle={`Scope: ${audit.scope}`}
        badge={<StatusBadge value={audit.status} />}
        date={audit.createdAt ? new Date(audit.createdAt).toLocaleString() : ''}
        onBack={() => navigate(-1)}
        actions={
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/audit/${audit.auditId}/edit`)}
          >
            Update
          </button>
        }
      >
        <div className="audit-grid">
          {console.log(audit)}
          <div className="field">
            <strong>Officer ID</strong>
            <div>{audit.officerId}</div>
          </div>
          <div className="field">
            <strong>Audit ID</strong>
            <div>{audit.auditId}</div>
          </div>
        </div>

        <div className="mt-3">
          <h6>Findings</h6>
          <div className="notes-box wrap-text">
            {audit.findings || '—'}
          </div>
        </div>
      </DetailCard>
    </div>
  );
};

export default DisplayOneAudit;