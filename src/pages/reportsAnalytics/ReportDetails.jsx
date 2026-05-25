import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton, EmptyState, Loader, ReportViewer, reportApi } from '../../core/registry';

export default function ReportDetails() {
  const { id: routeReportId } = useParams();
  const [reportDetails, setReportDetails] = useState(null);
  const [parsedMetrics, setParsedMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  useEffect(() => {
    const getReportData = async () => {
      if (!routeReportId) return;
      try {
        setIsLoading(true);
        const data = await reportApi.fetchReportById(routeReportId);

        setReportDetails(data);
        const metrics = typeof data.metrics === 'string'
          ? JSON.parse(data.metrics)
          : (data.metrics || []);
        setParsedMetrics(metrics);
      } catch (err) {
        setLoadError(err.message || "Failed to fetch report details");
      } finally {
        setIsLoading(false);
      }
    };

    getReportData();
  }, [routeReportId]);
  if (isLoading) {
    return <Loader message='Loading report...' />;
  }
  if (loadError) {
    return (
      <EmptyState
        title="Failed to load report"
        message={loadError}
      />
    );
  }

  const safeReport = reportDetails || {};

  return (
    <div className="container py-4">
      <BackButton />
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-2">Report ID: {safeReport.reportId || 'N/A'}</h4>
          <ReportViewer
            scope={safeReport.scope}
            metrics={parsedMetrics}
          />
        </div>
      </div>
    </div>
  );
}