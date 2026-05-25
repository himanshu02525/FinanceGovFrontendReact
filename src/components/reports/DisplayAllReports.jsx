import React, { useEffect, useState } from 'react';
import { EmptyState, Loader, ReportsList, reportApi } from '../../core/registry';


function DisplayAllReports() {
  const [allReports, setAllReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadReports() {
      setIsLoadingReports(true);
      setLoadError(null);
      
      try {
        const responseData = await reportApi.fetchAll();
        if (!mounted) return;
        const normalizedList = Array.isArray(responseData)
          ? responseData
          : responseData?.reports ?? responseData?.items ?? [];
          
        setAllReports(normalizedList);
      } catch (err) {
        console.error('Fetching reports failed:', err);
        if (mounted) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load reports");
        }
      } finally {
        if (mounted) setIsLoadingReports(false);
      }
    }

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoadingReports) {
    return <Loader message="Retrieving report history..." />;
  }

  if (loadError) {
    return (
      <EmptyState 
        title="Connection Error" 
        message={loadError} 
      />
    );
  }

  return (
    <div className="reports-display-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Generated Reports</h4>
        <span className="badge bg-secondary">{allReports.length} Total</span>
      </div>
      
      <ReportsList reports={allReports} />
    </div>
  );
}

export default DisplayAllReports;