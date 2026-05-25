import React, { useEffect, useState } from 'react';
import {
  EmptyState,
  RefetchButton,
  Loader,
  reportApi,
  Dashboard
} from '../../core/registry';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportApi.getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return (
    <div>
      <RefetchButton onClick={fetchAnalyticsData} />
      <Dashboard
        analyticsData={analyticsData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default AnalyticsDashboard;