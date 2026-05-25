import React from 'react';

export default function ScopeSelector({ value, onChange }) {
    return (
        <select
            className="form-select form-select-sm py-2"
            style={{ 
                width: 'auto',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid #d1d5db' 
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="TAX">Tax</option>
            <option value="PROGRAM">Program</option>
            <option value="SUBSIDY">Subsidy</option>
        </select>
    );
}