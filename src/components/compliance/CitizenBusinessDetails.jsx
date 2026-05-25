import React from 'react';
import DocumentList from './DocumentList';

const CitizenBusinessDetails = ({ entity }) => {
  if (!entity) return null;

  const DetailItem = ({ label, value, className = "col-md-4" }) => (
    <div className={`${className} mb-3`}>
      <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
        {label}
      </div>
      <div className="text-dark fw-medium">{value || '—'}</div>
    </div>
  );

  return (
    <div className="card shadow-sm border-0 mb-4">
     <div className="card-header bg-light border-0 py-3 text-start">
        <h6 className="card-title mb-0 fw-bold text-primary">
          <i className="bi bi-person-badge me-2"></i>Citizen / Business Details
        </h6>
      </div>

      <div className="card-body">
        <div className="row text-start">
          <DetailItem label="Entity ID" value={entity.entityId} />
          <DetailItem label="Name" value={entity.name} className="col-md-8" />
          
          
          <DetailItem label="Contact Info" value={entity.contactInfo} />
          
          <div className="col-md-4 mb-3">
            <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
              Status
            </div>
            <span className={`badge rounded-pill mt-1 ${
              entity.status?.toLowerCase() === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'
            }`} style={{ padding: '0.5em 1em' }}>
              {entity.status}
            </span>
          </div>
          <DetailItem label="Type" value={entity.type} />
          <DetailItem label="Address" value={entity.address} className="col-md-8" />
          
        </div>
      </div>

      {/* Document List Section */}
      {entity.documents && entity.documents.length > 0 && (
        <div className="border-top">
           <DocumentList documents={entity.documents} entityId={entity.entityId} />
        </div>
      )}
    </div>
  );
};

export default CitizenBusinessDetails;