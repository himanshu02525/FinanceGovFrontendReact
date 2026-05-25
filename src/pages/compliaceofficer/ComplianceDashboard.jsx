import React, { useEffect, useState } from 'react';
import * as complianceApi from "../../api/complianceApi";
import { Loader, RefetchButton, ComplianceSummary } from '../../core/registry';

const ComplianceDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplianceRecords = async () => {
    setLoading(true);
    try {
      const data = await complianceApi.getAll();
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching compliance records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceRecords();
  }, []);

  if (loading) return <Loader message="Loading compliance..." />;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Compliance Dashboard</h3>
        <RefetchButton onClick={fetchComplianceRecords} />
      </div>

      <ComplianceSummary compliance={records} />
    </div>
  );
};

export default ComplianceDashboard;