import React, { useEffect, useState } from 'react';
import * as auditApi from "../../api/auditApi";
import { Loader, RefetchButton, AuditSummary } from '../../core/registry';

const AuditDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const data = await auditApi.getAll();
      setAudits(data || []);
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  if (loading) return <Loader message="Loading audit..." />;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex align-items-center mb-3">
        <h3 className="me-auto mb-0">Audit</h3>
        <RefetchButton onClick={fetchAudits} />
      </div>

      <AuditSummary audits={audits} />
    </div>
  );
};

export default AuditDashboard;