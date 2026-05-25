import React from 'react';

// Use a clean arrow function component
const DataUnavailable = ({ title, description = "We couldn't find any records for this section at the moment." }) => {
  return (
    <div className="col-12 mb-4">
      <div 
        className="card border-0 shadow-sm" 
        style={{ 
          background: "#f8f9fa", 
          border: "1px dashed #42494fff",
          borderRadius: "12px" 
        }}
      >
        <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
          <div className="text-center" style={{ maxWidth: "450px" }}>
            <h5 className="fw-semibold text-dark mb-1">{title}</h5>
            <p className="text-muted small mb-0">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUnavailable;