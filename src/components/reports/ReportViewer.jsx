import React from 'react';
import { SubsidyMetricsCard, ProgramMetricsCard, TaxMetricsCard, MetricsGrid, GenericMetricsCard } from '../../core/registry';
export default function ReportViewer({ scope, metrics = {} }) {
  if (!scope) return null;

  const reportScope = scope;
  const reportMetrics = metrics || {};

  const scopeRendererMap = {
    TAX: () => <TaxMetricsCard data={reportMetrics.taxMetrics || reportMetrics} generatedAt={reportMetrics.generatedAt} />,
    PROGRAM: () => <ProgramMetricsCard data={reportMetrics.programMetrics || reportMetrics} generatedAt={reportMetrics.generatedAt} />,
    SUBSIDY: () => <SubsidyMetricsCard data={reportMetrics.subsidyMetrics || reportMetrics} generatedAt={reportMetrics.generatedAt} />,
    OVERALL: () => <GenericMetricsCard card={reportMetrics} generatedAt={reportMetrics.generatedAt}/>
  };

  const Renderer = scopeRendererMap[reportScope?.toUpperCase()] || (() => <div className="text-muted">Unknown scope</div>);

  return (
    <MetricsGrid>
      <Renderer />
    </MetricsGrid>
  );
}