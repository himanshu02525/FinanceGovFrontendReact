import React from 'react';

export const SectionHeader = ({ colorClass, title }) => (
  <div className="d-flex align-items-center mb-3">
    <div className={`${colorClass} rounded-circle me-2`} style={{ width: '8px', height: '18px' }}></div>
    <h5 className="mb-0 fw-bold text-dark">{title}</h5>
  </div>
);
export default SectionHeader;