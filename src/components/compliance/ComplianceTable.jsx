import React, { useState } from 'react';
import { Modal } from '../../components/global/Modal';
import { RecordsTable, StatusBadge, Loader } from '../../core/registry';
import * as complianceApi from "../../api/complianceApi";
import { toast } from "react-toastify";

const ComplianceTable = ({ records = [], loading = false, onRefresh }) => {
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const openDetails = (rec) => setSelected(rec);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this compliance record?')) return;
    
    setDeletingId(id);
    try {
      await complianceApi.remove(id);
      toast.success("Record deleted successfully");
      onRefresh && onRefresh();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader message="Loading compliance records..." />;

  return (
    <div>
      <RecordsTable
        data={records}
        columns={[
          { label: 'ID', key: 'complianceId' },
          { label: 'Entity ID', key: 'entityId' },
          { label: 'Type', key: 'type' },
          {
            label: 'Result',
            key: 'result',
            render: (v) => <StatusBadge type="result" value={v} />,
          },
          {
            label: 'Created Date',
            key: 'createdAt',
            render: (v) => (v ? new Date(v).toLocaleString() : ''),
          },
          {
            label: 'Actions',
            render: (_, row) => (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openDetails(row)}
                >
                  Details
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  disabled={deletingId === row.complianceId}
                  onClick={() => handleDelete(row.complianceId)}
                >
                  {deletingId === row.complianceId ? '...' : 'Delete'}
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Compliance #${selected?.complianceId || ''}`}
        size="md"
      >
        {selected && (
          <div>
            <div className="mb-3">
              <p className="mb-1"><strong>Entity:</strong> {selected.entityId}</p>
              <p className="mb-1"><strong>Reference:</strong> {selected.referenceId}</p>
              <p className="mb-1"><strong>Type:</strong> {selected.type}</p>
              <p className="mb-1"><strong>Result:</strong> {selected.result}</p>
              <p className="mb-1">
                <strong>Created:</strong>{' '}
                {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
              </p>
            </div>
            
            <hr />

            {selected.type === 'TAX' && selected.taxResponseDTO && (
              <div className="alert alert-light border">
                <h6 className="fw-bold">Tax Response</h6>
                <p className="mb-1 small text-muted">Tax ID: {selected.taxResponseDTO.taxId}</p>
                <p className="mb-1 small text-muted">Year: {selected.taxResponseDTO.year}</p>
                <p className="mb-1 small text-muted">Amount: {selected.taxResponseDTO.amount}</p>
                <p className="mb-0 small text-muted">Status: {selected.taxResponseDTO.status}</p>
              </div>
            )}

            {selected.type === 'SUBSIDY' && selected.subsidyResponse && (
              <div className="alert alert-light border">
                <h6 className="fw-bold">Subsidy</h6>
                <p className="mb-1 small text-muted">Subsidy ID: {selected.subsidyResponse.subsidyId}</p>
                <p className="mb-1 small text-muted">Amount: {selected.subsidyResponse.amount}</p>
                <p className="mb-1 small text-muted">Date: {selected.subsidyResponse.date}</p>
                <p className="mb-0 small text-muted">Program ID: {selected.subsidyResponse.programId}</p>
              </div>
            )}

            {selected.type === 'PROGRAM' && selected.financialProgramResponse && (
              <div className="alert alert-light border">
                <h6 className="fw-bold">Program</h6>
                <p className="mb-1 small text-muted">Program ID: {selected.financialProgramResponse.programId}</p>
                <p className="mb-1 small text-muted">Title: {selected.financialProgramResponse.title}</p>
                <p className="mb-0 small text-muted">Budget: {selected.financialProgramResponse.budget}</p>
              </div>
            )}

            <div className="mt-4 text-end">
              <button
                className="btn btn-secondary px-4"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComplianceTable;