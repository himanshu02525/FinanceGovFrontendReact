import React from 'react';
import { EmptyState, ReportCard } from '../../core/registry';

export default function ReportsList({ reports = [], emptyMessage = 'No reports available' }) {
  const reportItems = reports || [];

  if (reportItems.length === 0) {
    return (
      <div className="py-5 text-center">
        <EmptyState title="No Reports" message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="reports-container py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
      </div>
      
      <div className="reports-list">
        {reportItems.map((reportItem) => (
          <ReportCard key={reportItem.reportId || reportItem.id} report={reportItem} />
        ))}
      </div>
    </div>
  );
}