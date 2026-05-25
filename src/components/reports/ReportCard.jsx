import React from 'react';
import { Link } from 'react-router-dom';

export default function ReportCard({ report }) {
  if (!report) return null;

  const generatedAtSource = report.generatedDate || new Date();
  const safeReportId = report.reportId || 'N/A';

  const formattedDate = new Date(generatedAtSource).toLocaleDateString();
  const formattedTime = new Date(generatedAtSource).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className=" shadow-sm border mb-3 py-2" style={{ height: 'max-content', borderRadius: '0' }}>
      <div className="card-body p-2 my-2">
        <div className="d-flex justify-content-between align-items-center px-3 py-1 bg-light border-bottom">
          <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
            Report - {report.reportId} - {report.reportName}
          </span>
          <span className="text-dark small fw-medium">
            Generated: {formattedDate} {formattedTime}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <div className="d-flex align-items-center">
            <span className="fw-bold me-2" style={{ fontSize: '0.9rem' }}>Scope:</span>
            <span className="text-uppercase" style={{ fontSize: '0.9rem' }}>{report.scope}</span>
          </div>

          <Link
            to={`/reports/${report.reportId}`}
            className="btn btn-sm btn-primary rounded-0 px-4 py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}