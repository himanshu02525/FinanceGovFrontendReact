import React from 'react';

const StatusBadge = ({ type = 'status', value }) => {
  const v = (value || '').toString();
  const upper = v.toUpperCase();

  if (type === 'result') {
    switch (upper) {
      case 'PASS': return <span className="badge bg-success">{v}</span>;
      case 'FAIL': return <span className="badge bg-danger">{v}</span>;
      case 'IN_PROGRESS': return <span className="badge bg-warning text-dark">{v}</span>;
      default: return <span className="badge bg-secondary">{v}</span>;
    }
  }

  // default: audit status mapping
  switch (upper) {
    case 'COMPLETED': return <span className="badge bg-success">{v}</span>;
    case 'IN_PROGRESS':
    case 'IN-PROGRESS': return <span className="badge bg-warning text-dark">{v}</span>;
    case 'FAILED':
    case 'FAIL': return <span className="badge bg-danger">{v}</span>;
    case 'PENDING':
    default: return <span className="badge bg-secondary">{v}</span>;
  }
};

export default StatusBadge;
