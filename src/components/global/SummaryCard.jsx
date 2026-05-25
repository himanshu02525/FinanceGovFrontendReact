import React from 'react';

const SummaryCard = ({ label, value, colorClass = "text-muted", borderColor = "#e0e0e0" }) => {
  return (
    <div className="col-md-3">
      <div 
        className="card shadow-sm border-0 px-3 py-5 d-flex justify-content-center" 
        style={{ 
          minHeight: '45px', 
          borderLeft: `4px solid ${borderColor}`,
          backgroundColor: '#fff' 
        }}
      >
        <div className="d-flex flex-column justify-content-between align-items-center">
          <small 
            className={`${colorClass} fw-bold text-uppercase`} 
            style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}
          >
            {label}
          </small>
          <span className="fw-bold h5 mb-0 text-dark mt-1">
            {value ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;