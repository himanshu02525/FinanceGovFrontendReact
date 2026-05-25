import React from 'react';

const FundingProgramDetails = ({ program }) => {
  if (!program) return null;

  return (
    <div className="card record-section shadow-sm">
      <div className="card-body text-start">
        <h6 className="card-title mb-4 border-bottom pb-2">Funding Program Details</h6>
 <div className="row g-3">
        <div className="col-sm-6"><strong>Program ID:</strong> <div>{program.programId}</div></div>
        <div className="col-sm-6"><strong>Title:</strong> <div>{program.title}</div></div>
        <div className="col-sm-6"><strong>Budget:</strong> <div>{program.budget}</div></div>
        <div className="col-sm-6"><strong>Status:</strong> <div className="text-capitalize">{program.status}</div></div>
        <div className="col-12">
          <strong>Description:</strong> 
          <div className="text-muted small">{program.description}</div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FundingProgramDetails;