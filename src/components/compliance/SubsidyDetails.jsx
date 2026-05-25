import React from 'react';

const SubsidyDetails = ({ subsidy }) => {
  if (!subsidy) return null;
  return (
    <div className="card record-section">
      <div className="card-body text-start">
        <h6 className="card-title">Subsidy Details</h6>
        <div className="row g-3">
        <div className="col-sm-4"><strong>Subsidy ID:</strong> <div>{subsidy.subsidyId}</div></div>
        <div className="col-sm-4"><strong>Entity ID:</strong> <div>{subsidy.entityId}</div></div>
        <div className="col-sm-4"><strong>Program ID:</strong> <div>{subsidy.programId}</div></div>
        <div className="col-sm-4"><strong>Amount:</strong> <div>{subsidy.amount}</div></div>
        <div className="col-sm-4"><strong>Status:</strong> <div>{subsidy.status}</div></div>
        <div className="col-sm-4">
          <strong>Date:</strong> 
          <div>{subsidy.date ? new Date(subsidy.date).toLocaleDateString() : 'N/A'}</div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SubsidyDetails;
