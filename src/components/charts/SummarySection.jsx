import React from 'react';
import { SummaryCard } from '../../core/registry';

export const SummarySection = ({ cards }) => (
  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-3">
    {cards.map((stat, i) => (
      <div className="col flex-grow-1 style-container-override" key={i} style={{ minWidth: '240px' }}>
        <div className="w-100 d-inline-block">
          <SummaryCard {...stat} />
        </div>
      </div>
    ))}
  </div>
);
export default SummarySection;