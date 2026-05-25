import React from 'react';
import './RecordsTable.css';

const RecordsTable = ({
  columns = [],
  data = [],
  className = '',
}) => {

  const getNestedValue = (obj, path) => {
    return path
      ? path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
      : undefined;
  };

  return (
    /* Added custom inline styles to handle the 90vh max-height limit and vertical scrolling */
    <div 
      className={`table-responsive ${className}`}
      style={{ maxHeight: '90vh', overflowY: 'auto', overflowX: 'auto' }}
    >
      <table className="records-table table table-striped table-hover border text-center align-middle mb-0">
        
        {/* Added position-sticky so the table header stays at the top while scrolling */}
        <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || col.label || index} className="p-3">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={row.id || row.auditId || rowIdx}>
                {columns.map((col, colIdx) => {
                  const cellValue = col.key ? getNestedValue(row, col.key) : undefined;
                  const content = typeof col.render === 'function'
                    ? col.render(cellValue, row)
                    : cellValue;

                  return (
                    <td 
                      key={`${rowIdx}-${colIdx}`}
                      className={`p-3 ${col.className || ''}`}
                    >
                      {/* d-flex wrapper ensures even custom elements (buttons/icons) are centered */}
                      <div className="d-flex justify-content-center align-items-center">
                        {content}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-muted py-4">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;