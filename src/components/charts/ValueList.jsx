import React from 'react';

export const ValueList = ({ title, data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="p-1 w-100">
      {title && (
        <h6 className="text-muted small fw-bold text-uppercase mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
          {title}
        </h6>
      )}
      {data.map((item, i) => (
        <div key={i} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
          <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>
            {item.name || item.label}
          </span>
          <strong className="text-dark">{item.value ?? 'N/A'}</strong>
        </div>
      ))}
    </div>
  );
};
export default ValueList;