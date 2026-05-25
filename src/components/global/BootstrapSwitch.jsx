import React from 'react';

const BootstrapSwitch = ({ label, id, checked, onChange }) => {
  return (
    <div className="form-check form-switch">
      <input 
        className="form-check-input" 
        type="checkbox" 
        role="switch" 
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default BootstrapSwitch;