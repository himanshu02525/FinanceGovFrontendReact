import React from 'react';
import {CustomBarBudget,CustomBarVertical, CustomPie,Loader,SummarySection, EmptyState, StatusCard ,ValueList,SectionHeader} from '../../core/registry';


import './Dashboard.css';

const Dashboard = ({ analyticsData, isLoading, error }) => {
  if (isLoading) return <Loader message="Loading dashboard analytics..." />;
  if (error) return <EmptyState message={error} />;

  const taxDetails = analyticsData?.taxDetails || {};
  const subsidyDetails = analyticsData?.subsidyDetails || {};
  const programDetails = analyticsData?.programDetails || {};

  const hasData = programDetails.totalPrograms || subsidyDetails.applicationsReceived || taxDetails.summary;
  if (!analyticsData || !hasData) {
    return <EmptyState message="We couldn't retrieve the complete dashboard data. Please try refreshing the page." />;
  }

  // --- DATA TRANSFORMS & CARD ARCHITECTURES ---
  const taxSummaryCards = [
    { label: "Revenue Collected", value: `${taxDetails.summary?.revenueCollected?.toLocaleString('en-IN') ?? '0'}`, colorClass: "text-primary", borderColor: "#0d6efd" },
    { label: "Total Taxpayers", value: taxDetails.summary?.totalTaxpayers?.toLocaleString('en-IN') ?? 0, colorClass: "text-primary", borderColor: "#0d6efd" },
    { label: "Total Records", value: taxDetails.summary?.totalRecords?.toLocaleString('en-IN') ?? 0, colorClass: "text-primary", borderColor: "#0d6efd" }
  ];

  const taxStatusChartData = taxDetails.status ? [
    { name: 'Paid', label: 'Paid', value: taxDetails.status.paid || 0 },
    { name: 'Pending', label: 'Pending', value: taxDetails.status.pending || 0 },
    { name: 'Overdue', label: 'Overdue', value: taxDetails.status.overdue || 0 },
    { name: 'Rejected', label: 'Rejected', value: taxDetails.status.rejected || 0 },
  ] : [];

  const extraTaxMetricsList = [
    { name: 'Compliance Rate', label: 'Compliance Rate', value: `${taxDetails.metrics?.complianceRate ?? 0}%` },
    { name: 'Overdue Weight', label: 'Overdue Weight', value: `${taxDetails.metrics?.overduePercentage ?? 0}%` },
    { name: 'Pending Weight', label: 'Pending Weight', value: `${taxDetails.metrics?.pendingPercentage ?? 0}%` }
  ];

  const taxRecordMetricsData = [
    { name: 'Highest Tax', label: 'Highest Tax', value: taxDetails.revenue?.highestTax ?? 0 },
    { name: 'Average Tax', label: 'Average Tax', value: taxDetails.revenue?.averageTax ?? 0 },
    { name: 'Lowest Tax', label: 'Lowest Tax', value: taxDetails.revenue?.lowestTax ?? 0 }
  ];

  const taxRecordMetricsList = [
    { name: 'Highest Tax', label: 'Highest Tax', value: `${(taxDetails.revenue?.highestTax ?? 0).toLocaleString('en-IN')}` },
    { name: 'Average Tax', label: 'Average Tax Amount', value: `${(taxDetails.revenue?.averageTax ?? 0).toLocaleString('en-IN')}` },
    { name: 'Lowest Tax', label: 'Lowest Tax', value: `${(taxDetails.revenue?.lowestTax ?? 0).toLocaleString('en-IN')}` }
  ];

  const subsidySummaryCards = [
    { label: "Amount Distributed", value: `${subsidyDetails.amountDistributed?.toLocaleString('en-IN') ?? '0'}`, colorClass: "text-success", borderColor: "#198754" },
    { label: "Applications Received", value: subsidyDetails.applicationsReceived?.toLocaleString('en-IN') ?? 0, colorClass: "text-success", borderColor: "#198754" }
  ];

  const subsidyVolumeData = [
    { name: 'Approved Subsidies', label: 'Approved Subsidies', value: subsidyDetails.approvedSubsidies || 0 },
    { name: 'Granted', label: 'Granted', value: subsidyDetails.grantedCount || 0 },
    { name: 'Rejected Subsidies', label: 'Rejected Subsidies', value: subsidyDetails.rejectedSubsidies || 0 },
  ].filter(d => d.value > 0);

  const totalSubsidies = (subsidyDetails.approvedSubsidies || 0) + (subsidyDetails.grantedCount || 0) + (subsidyDetails.rejectedSubsidies || 0);
  
  const subsidyVolumeDataList = [
    { name: 'Total Subsidies', label: 'Total Subsidies', value: totalSubsidies },
    { name: 'Approved Subsidies', label: 'Approved Subsidies', value: subsidyDetails.approvedSubsidies || 0 },
    { name: 'Granted Subsidies', label: 'Granted Subsidies', value: subsidyDetails.grantedCount || 0 },
    { name: 'Rejected Subsidies', label: 'Rejected Subsidies', value: subsidyDetails.rejectedSubsidies || 0 },
    { name: 'On Hold Subsidies', label: 'On Hold Subsidies', value: subsidyDetails.onHoldCount || 0 },
  ].filter(d => d.value > 0);

  const subsidyApplicationData = [
    { name: 'Approved', label: 'Approved', value: subsidyDetails.approvedApplications || 0 },
    { name: 'Pending', label: 'Pending', value: subsidyDetails.pendingApplications || 0 },
    { name: 'Rejected', label: 'Rejected', value: subsidyDetails.rejectedApplications || 0 },
  ].filter(d => d.value > 0);

  const subsidyApplicationDataList = [
    { name: 'Total Applications', label: 'Total Applications', value: subsidyDetails.applicationsReceived ?? 0 },
    { name: 'Approved', label: 'Approved', value: subsidyDetails.approvedApplications || 0 },
    { name: 'Pending', label: 'Pending', value: subsidyDetails.pendingApplications || 0 },
    { name: 'Rejected', label: 'Rejected', value: subsidyDetails.rejectedApplications || 0 },
  ].filter(d => d.value > 0);

  const programSummaryCards = [
    { label: "Total Budget Pool", value: `${programDetails.totalBudget?.toLocaleString('en-IN') ?? '0'}`, colorClass: "text-warning", borderColor: "#ffc107" },
    { label: "Total Programs Setup", value: programDetails.totalPrograms ?? 0, colorClass: "text-warning", borderColor: "#ffc107" }
  ];

  const remainingBudget = Math.max(0, (programDetails.totalBudget || 0) - (subsidyDetails.amountDistributed || 0));
  
  const budgetChartData = programDetails.totalBudget > 0 ? [
    { name: 'Total Budget', label: 'Total Budget', value: programDetails.totalBudget },
    { name: 'Distributed', label: 'Distributed', value: subsidyDetails.amountDistributed || 0 },
    { name: 'Remaining Fund', label: 'Remaining Fund', value: remainingBudget }
  ] : [];

  const programConditionData = [
    { name: 'Active Programs', label: 'Active Programs', value: programDetails.activePrograms ?? 0 },
    { name: 'Closed Programs', label: 'Closed Programs', value: programDetails.closedPrograms ?? 0 }
  ];

  const programConditionDataList = [
    { name: 'Total Programs', label: 'Total Programs', value: programDetails.totalPrograms ?? 0 },
    { name: 'Active Programs', label: 'Active Programs', value: programDetails.activePrograms ?? 0 },
    { name: 'Closed Programs', label: 'Closed Programs', value: programDetails.closedPrograms ?? 0 }
  ];

  const programStatusList = [
    { name: 'Total Budget', label: 'Total Budget', value: `${programDetails.totalBudget?.toLocaleString('en-IN') ?? '0'}` },
    { name: 'Distributed Budget', label: 'Distributed Budget', value: `${subsidyDetails.amountDistributed?.toLocaleString('en-IN') ?? '0'}` },
    { name: 'Remaining Budget', label: 'Remaining Budget', value: `${remainingBudget.toLocaleString('en-IN')}` }
  ];

  return (
    <div className="container-fluid p-4 bg-light">
      
      {/* SECTION 1: PROGRAMS & BUDGET */}
      <div className="mb-5">
        {Object.keys(programDetails).length > 0 ? (
          <>
            <SectionHeader colorClass="bg-warning" title="Programs & Budgetary Allocation" />
            <SummarySection cards={programSummaryCards} />
            <div className="row g-4">
              <div className="col-12">
                <StatusCard
                  title="Budget Allocation Status"
                  listTitle="Financial Plan Overview"
                  data={budgetChartData}
                  ChartComponent={CustomBarBudget}
                  ListComponent={() => <ValueList title="Budget Summary" data={programStatusList} />}
                />
              </div>
              <div className="col-12">
                <StatusCard
                  title="Program State Structure"
                  listTitle="Operational Program States"
                  data={programConditionData}
                  ChartComponent={CustomPie}
                  ListComponent={() => <ValueList title="Program Metrics" data={programConditionDataList} />}
                />
              </div>
            </div>
          </>
        ) : (
          <EmptyState message="No program information is available at this moment." />
        )}
      </div>

      {/* SECTION 2: SUBSIDY TRACKING */}
      <div className="mb-5">
        {Object.keys(subsidyDetails).length > 0 ? (
          <>
            <SectionHeader colorClass="bg-success" title="Subsidy Tracking & Applications" />
            <SummarySection cards={subsidySummaryCards} />
            <div className="row g-4">
              <div className="col-12">
                <StatusCard
                  title="Subsidy Allotment Overview"
                  listTitle="Subsidy Allotment Metrics"
                  data={subsidyVolumeData}
                  ChartComponent={CustomPie}
                  ListComponent={() => <ValueList title="Subsidy Allotment" data={subsidyVolumeDataList} />}
                />
              </div>
              <div className="col-12">
                <StatusCard
                  title="Subsidy Applications Lifecycle"
                  listTitle="Application Status Volumes"
                  data={subsidyApplicationData}
                  ChartComponent={CustomBarVertical}
                  ListComponent={() => <ValueList title="Subsidy Applications" data={subsidyApplicationDataList} />}
                />
              </div>
            </div>
          </>
        ) : (
          <EmptyState message="No subsidy information is available at this moment." />
        )}
      </div>

      {/* SECTION 3: TAXATION INFRASTRUCTURE */}
      <div className="mb-5">
        {Object.keys(taxDetails).length > 0 ? (
          <>
            <SectionHeader colorClass="bg-primary" title="Taxation Infrastructure" />
            <SummarySection cards={taxSummaryCards} />
            <div className="row g-4">
              <div className="col-12">
                <StatusCard
                  title="Tax Compliance Breakdown & Metrics"
                  listTitle="Financial Record Health"
                  data={taxStatusChartData}
                  ChartComponent={CustomPie}
                  ListComponent={() => (
                    <>
                      <ValueList title="Status" data={taxStatusChartData} />
                      <ValueList title="Auditing Weights" data={extraTaxMetricsList} />
                    </>
                  )}
                />
              </div>
              <div className="col-12">
                <StatusCard
                  title="Tax Benchmarks Comparison"
                  listTitle="Extreme Tax Record Bounds"
                  data={taxRecordMetricsData}
                  ChartComponent={CustomBarBudget}
                  ListComponent={() => <ValueList title="Record Statistics" data={taxRecordMetricsList} />}
                />
              </div>
            </div>
          </>
        ) : (
          <EmptyState message="No tax information is available at this moment." />
        )}
      </div>

    </div>
  );
};

export default Dashboard;
