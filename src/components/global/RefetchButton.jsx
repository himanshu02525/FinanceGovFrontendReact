import React from 'react';
import { CachedIcon } from '../../core/registry';

export default function RefetchButton({ onClick, loading = false, title = 'Refresh' }) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      className="btn btn-link btn-sm ms-auto p-0 border-0 text-decoration-none"
      onClick={onClick}
      disabled={loading}
      style={{ display: 'inline-flex', alignItems: 'center',float: 'right' }}
    >
      {loading ? (
        <span 
          className="spinner-border spinner-border-sm text-primary" 
          role="status" 
          aria-hidden="true"
        ></span>
      ) : (
        <CachedIcon />
      )}
    </button>
  );
}