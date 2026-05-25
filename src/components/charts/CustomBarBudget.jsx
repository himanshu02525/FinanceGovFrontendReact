import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const CustomBarBudget = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Custom Formatter formatting numbers into 'k' layout strings
  const formatValue = (v) => `${(v / 1000).toLocaleString('en-IN')}k`;

  // DYNAMIC MARGIN CALCULATION: Find the longest formatted value to prevent truncation
  const maxLabelLength = Math.max(
    ...data.map(item => formatValue(item.value || 0).length), 
    6 // Baseline length fallback
  );
  
  // Give ~8 pixels of spacing per character count to dynamic left margin
  const calculatedLeftMargin = Math.max(50, maxLabelLength * 8);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 10, bottom: 10, left: calculatedLeftMargin }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" style={{ fontSize: '12px' }} />
        <YAxis 
          tickFormatter={formatValue}
          style={{ fontSize: '11px' }}
        />
        <Tooltip formatter={(v) => [`${Number(v).toLocaleString('en-IN')}`, 'Amount']} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
          <Cell fill="#0d6efd" />
          <Cell fill="#198754" />
          <Cell fill="#6c757d" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default CustomBarBudget;