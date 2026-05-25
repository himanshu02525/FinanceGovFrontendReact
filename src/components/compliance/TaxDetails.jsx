import React from 'react';

const TaxDetails = ({ tax }) => {
  if (!tax) return null;
  return (
    <div className="card record-section">
      <div className="row g-3">
        <div className="col-sm-4"><strong>Tax ID:</strong> <div>{tax.taxId}</div></div>
        <div className="col-sm-4"><strong>Entity ID:</strong> <div>{tax.entityId}</div></div>
        <div className="col-sm-4"><strong>Year:</strong> <div>{tax.year}</div></div>
        <div className="col-sm-4"><strong>Amount:</strong> <div>{tax.amount}</div></div>
        <div className="col-sm-4"><strong>Status:</strong> <div>{tax.status}</div></div>
        <div className="col-sm-4">
          <strong>Created:</strong> 
          <div>{tax.createdAt ? new Date(tax.createdAt).toLocaleString() : 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default TaxDetails;
