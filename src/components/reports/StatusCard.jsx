import React from 'react';

export default function StatusCard({ 
  title, 
  data, 
  ChartComponent, 
  ListComponent, 
  listTitle = "Details" 
}) {
  if (!data) return null;

  return (
    <div className="col-12 mb-4">
      {/* Kept your exact card, just removed 'overflow-hidden' so the left text isn't cut off */}
      <div className="card shadow border-0" style={{ borderRadius: '12px' }}>
        <div className="row align-items-center g-0">
          
          {/* LEFT SIDE: Chart (Kept col-md-6) */}
          <div className="col-md-6 p-4 border-end" style={{ minWidth: 0 }}>
            <h6 className="fw-bold text-secondary mb-3">{title}</h6>
            {/* Changed flex-center to block width so the chart's left axis stays visible */}
            <div className="w-100">
               <ChartComponent data={data} />
            </div>
          </div>
          
          {/* RIGHT SIDE: Information (Kept col-md-6) */}
          <div className="col-md-6 p-4 bg-light">
            <ListComponent title={listTitle} data={data} />
          </div>

        </div>
      </div>
    </div>
  );
}