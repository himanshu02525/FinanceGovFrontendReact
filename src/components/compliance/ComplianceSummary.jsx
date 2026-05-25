import React, { useEffect, useState } from 'react';
import * as complianceApi from "../../api/complianceApi";
import { Loader ,SummaryCard} from "../../core/registry";

const ComplianceSummary = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await complianceApi.getSummary();
      setSummary(data || {});
    } catch (err) {
      console.error('Error fetching compliance summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <Loader message="Loading Summary..." />;
  }

  // Define the stat configuration
  const stats = [
    { label: "All ", value: summary.All, color: "text-muted" },
    { label: "Pending", value: summary.PENDING, color: "text-warning" },
    { label: "In Progress", value: summary.IN_PROGRESS, color: "text-info" },
    { label: "Completed", value: summary.PASS, color: "text-success" },
    { label: "Failed", value: summary.FAIL, color: "text-danger" },
  ];

  return (
    <div className="row g-2 mb-3">
      {stats.map((stat, idx) => (
        <SummaryCard 
          key={idx}
          label={stat.label}
          value={stat.value}
          colorClass={stat.color}
        />
      ))}
    </div>
  );
};

export default ComplianceSummary;