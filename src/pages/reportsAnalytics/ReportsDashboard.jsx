import React, { useEffect, useState, useCallback } from 'react';
import {
  Loader,
  EmptyState,
  ReportsList,
  RefetchButton,
  reportApi
} from '../../core/registry';

function ReportsDashboard() {
  const [allReports, setAllReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [loadError, setLoadError] = useState(null);

const fetchAllReports = useCallback(async () => {
  setIsLoadingReports(true);
  setLoadError(null);

  try {
    const data = await reportApi.fetchAll();

    const normalizedList = Array.isArray(data)
      ? data
      : data?.reports ?? data?.items ?? [];

    setAllReports(normalizedList);
  } catch (err) {
    if (err?.response?.status === 404) {
      setAllReports([]); // Treat it as an empty list
      setLoadError(err?.response?.data  || err?.response?.message); 
      return;
    }

  setLoadError(backendMessage || "An unexpected error occurred while retrieving reports.");
  } finally {
    setIsLoadingReports(false);
  }
}, []);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  if (isLoadingReports && allReports.length === 0) {
    return <Loader message="Accessing report repository..." />;
  }

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold mb-0 text-dark">Reporting History</h4>
        </div>

        <RefetchButton
          onClick={fetchAllReports}
          loading={isLoadingReports}
          title="Sync Reports"
        />
      </div>

      {loadError ? (
        <EmptyState
          title="Data Retrieval Error"
          message={
            <span style={{ 
              whiteSpace: "pre-wrap", 
              display: "block", 
              fontFamily: "monospace", 
              fontSize: "0.85rem",
              textAlign: "left" 
            }}>
              {loadError}
            </span>
          }
        />
      ) : allReports.length === 0 ? (
        <EmptyState
          title="No Reports Found"
          message="Start by generating a new analytics report to see it listed here."
        />
      ) : (
        <div className="reports-list">
          <ReportsList reports={allReports} />
        </div>
      )}
    </div>
  );
}

export default ReportsDashboard;