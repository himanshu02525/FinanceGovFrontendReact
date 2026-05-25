import React, { useEffect, useState } from "react";
import * as auditApi from "../../api/auditApi"; 
import { Loader, SummaryCard } from "../../core/registry";

const AuditSummary = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAuditSummary = async () => {
    setLoading(true);
    try {
      const data = await auditApi.getSummary();
      setSummary(data || {});
    } catch (error) {
      console.error("Error fetching audit summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditSummary();
  }, []);

  const statsConfig = [
    { 
      label: "All", 
      value: summary?.All, 
      borderColor: "#6c757d", 
      colorClass: "text-muted" 
    },
    { 
      label: "Pending", 
      value: summary?.PENDING, 
      borderColor: "#ffc107", 
      colorClass: "text-warning" 
    },
    { 
      label: "In Progress", 
      value: summary?.IN_PROGRESS, 
      borderColor: "#0dcaf0", 
      colorClass: "text-info" 
    },
    { 
      label: "Completed", 
      value: summary?.COMPLETED, 
      borderColor: "#198754", 
      colorClass: "text-success" 
    },
  ];

  if (loading) {
    return <Loader message="Loading Stats..." />;
  }

  return (
    <div className="row g-2 mb-4">
      {statsConfig.map((stat, index) => (
        <SummaryCard 
          key={index}
          label={stat.label}
          value={stat.value}
          borderColor={stat.borderColor}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
};

export default AuditSummary;