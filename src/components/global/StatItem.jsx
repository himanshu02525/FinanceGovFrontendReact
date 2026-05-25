import React from 'react';

export default function StatItem({ label, value, className = '' }) {
  return (
    <div className={`d-flex justify-content-between align-items-center py-1 ${className}`}>
      <small className="text-muted">{label}</small>
      <div className="fw-semibold">{value}</div>
    </div>
  );
}
