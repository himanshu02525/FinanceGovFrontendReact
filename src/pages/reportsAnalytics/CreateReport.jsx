import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateReportForm, BackButton } from '../../core/registry';

export default function CreateReport() {
  const navigate = useNavigate();
  
  const handleReportSuccess = (data) => {
    if (data?.reportId) {
      navigate(`/reports/${data.reportId}`);
    } else {
      navigate('/reports/list');
    }
  };

  return (
    <div className="container py-4">
      
      <div className="d-flex align-items-center position-relative mb-4 pb-2 border-bottom">
        <div className="position-absolute start-0">
          <BackButton />
        </div>
        <div className="w-100 text-center">
          <h4 className="fw-bold text-dark mb-1">Generate New Report</h4>
          <p className="text-muted small mb-0">Configure parameters to generate your analytical report</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-11 col-lg-10">
          
          <div className=" shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '12px', backgroundColor: '#ffffff' }}>
            <CreateReportForm onSuccess={handleReportSuccess} />
          </div>

          <div className="mt-4 text-center ">
            <div className="d-inline-flex align-items-center bg-light border rounded  py-2 text-start">
              <i className="bi bi-info-circle text-primary me-2 flex-shrink-0" style={{ fontSize: '1.1rem' }}></i>
              <small className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1' }}>
                <strong>Processing Notice:</strong> Reports may take a few moments to aggregate and build depending on your selected parameters and scope.
              </small>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}