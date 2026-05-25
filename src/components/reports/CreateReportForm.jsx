import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  CharacterAllow,
  ScopeSelector,
  reportApi
} from '../../core/registry';

const FIELD_STYLE = {
  height: '46px',
  fontSize: '0.95rem',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  padding: '0.5rem 1rem',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: '#ffffff',
  width: '100%'
};

function useCharacterLimit(initialValue, maxLength) {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) setValue(newValue);
  };
  return { value, setValue, handleChange, count: value.length, limit: maxLength };
}

export default function CreateReportForm({ onSuccess }) {
  const [selectedScope, setSelectedScope] = useState('TAX');
  const [reportYear, setReportYear] = useState('');
  const [programId, setProgramId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const notesManager = useCharacterLimit('', 255);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setReportYear('');
    setProgramId('');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsGenerating(true);

    try {
      const params = {
        scope: selectedScope,
        reportName: notesManager.value.trim() || null,
        year: selectedScope === 'TAX' ? (reportYear || null) : null,
        id: selectedScope === 'PROGRAM' ? (programId || null) : null,
      };

      const data = await reportApi.generateReport(params);
      if (typeof onSuccess === 'function') onSuccess(data);
      toast.success(`${selectedScope} report generated`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div
      className="p-4 rounded-4 mx-auto shadow-sm"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #f1f5f9',
        maxWidth: '600px'
      }}
    >
      <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
        
        {/* Row 1: Report Identifier */}
        <div className="d-flex flex-column gap-2">
          <label className="fw-bold small text-uppercase text-muted tracking-wide">
            Report Identifier
          </label>
          <input
            type="text"
            className="form-control custom-focus"
            style={FIELD_STYLE}
            value={notesManager.value}
            onChange={notesManager.handleChange}
            autoComplete="off"
            placeholder="Enter report name"
          />
          <CharacterAllow count={notesManager.count} limit={notesManager.limit} />
        </div>

        {/* Row 2: Scope and Dynamic Input (Strict 50/50 split) */}
        <div className="row g-3 align-items-end">
          {/* Always 50% width */}
          <div className="col-6">
            <label className="fw-bold small text-uppercase text-muted tracking-wide mb-2 d-block">
              Scope <span className='text-danger'>*</span>
            </label>
            <ScopeSelector 
              value={selectedScope} 
              onChange={handleScopeChange} 
            />
          </div>

          <div className="col-6">
            {selectedScope === 'TAX' && (
              <div className="animate-in">
                <label className="fw-bold small text-uppercase text-muted tracking-wide mb-2 d-block">
                  Fiscal Year
                </label>
                <select
                  className="form-select custom-focus"
                  style={FIELD_STYLE}
                  value={reportYear}
                  onChange={(e) => setReportYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {selectedScope === 'PROGRAM' && (
              <div className="animate-in">
                <label className="fw-bold small text-uppercase text-muted tracking-wide mb-2 d-block">
                  Program ID
                </label>
                <input
                  type="number"
                  className="form-control custom-focus"
                  style={FIELD_STYLE}
                  placeholder="ID"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                />
              </div>
            )}

            {selectedScope === 'SUBSIDY' && (
              <div className="d-flex align-items-center" style={{ height: '46px' }}>
                <span className="text-muted small italic opacity-75">No params needed</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          type="submit"
          disabled={isGenerating}
          style={{
            width:'max-content',
            height: '40px',
            fontWeight: '700',
            borderRadius: '12px',
            backgroundColor: '#2563eb',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}
        >
          {isGenerating ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            `Generate ${selectedScope} Report`
          )}
        </button>
      </form>

      <style>{`
        .custom-focus:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
          outline: none;
        }
        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(5px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}