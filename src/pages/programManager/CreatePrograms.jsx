import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import CreateProgramForm from './CreateProgramForm';
import { PageLoader } from '../../components/global/Loader';
import { ConfirmDialog } from '../../components/global/ConfirmDialog';
import { UpdateProgramDialog } from './UpdateProgramDialog';
import programService from '../../api/programService';
import { formatCurrency, formatDate, showSuccess, showError } from '../../api/helpers';
import './Pages.css';

export const CreatePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    itemId: null,
    isLoading: false,
  });
  const [updateDialog, setUpdateDialog] = useState({
    isOpen: false,
    program: null,
    isLoading: false,
  });
  const [viewDetailModal, setViewDetailModal] = useState({
    isOpen: false,
    program: null,
  });

  // Function to calculate program status based on end date
  const getProgramStatus = (program) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(program.endDate);
    endDate.setHours(0, 0, 0, 0);
    
    return endDate < today ? 'CLOSED' : 'ACTIVE';
  };

  // Load programs when component mounts or when switching to list view
  useEffect(() => {
    if (viewMode === 'list') {
      loadPrograms();
    }
  }, [viewMode]);

  const handleSuccess = async (newProgram) => {
    // Add new program to list
    setPrograms(prev => [newProgram, ...prev]);
    
    // Refresh the list
    loadPrograms();
  };

  const loadPrograms = async () => {
    setLoadingList(true);
    try {
      const data = await programService.getAllPrograms();
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (programId) => {
    console.log(' DELETE BUTTON CLICKED');
    console.log('Program ID passed:', programId);
    console.log('Type of ID:', typeof programId);
    setDeleteConfirm({ isOpen: true, itemId: programId, isLoading: false });
  };

  const handleUpdate = (program) => {
    setUpdateDialog({ isOpen: true, program, isLoading: false });
  };

  const confirmUpdate = async (updatedData) => {
    if (!updateDialog.program?.programId) {
      console.error('No program ID to update');
      return;
    }

    setUpdateDialog(prev => ({ ...prev, isLoading: true }));
    try {
      await programService.updateProgram(updateDialog.program.programId, updatedData);
      showSuccess('Program updated successfully!');
      
      // Close dialog
      setUpdateDialog({ isOpen: false, program: null, isLoading: false });
      
      // Reload programs list
      await loadPrograms();
    } catch (error) {
      console.error('Error updating program:', error);
      const errorMessage = error.message || 'Failed to update program. Please try again.';
      showError(errorMessage);
      setUpdateDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.itemId) {
      console.error('No item ID to delete');
      return;
    }

    setDeleteConfirm(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Deleting program:', deleteConfirm.itemId);
      const response = await programService.deleteProgram(deleteConfirm.itemId);
      console.log('Delete response:', response);
      
      // Close dialog first
      setDeleteConfirm({ isOpen: false, itemId: null, isLoading: false });
      
      // Then reload the list to get fresh data
      await loadPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      let errorMessage = 'Failed to delete program. Please try again.';
      
      // Check if it's a foreign key constraint error
      if (error.response?.status === 409 || 
          error.message?.includes('foreign key') || 
          error.message?.includes('constraint') ||
          error.response?.data?.includes('foreign key')) {
        errorMessage = 'Cannot delete this program. It has associated subsidy applications or allocations. Please delete those first.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
      setDeleteConfirm(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <div className="header-content">
          <Plus size={32} />
          <div>
            <h2>Create Financial Programs</h2>
            <p className="text-muted">Create and manage financial assistance programs</p>
          </div>
        </div>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setViewMode(viewMode === 'form' ? 'list' : 'form')}
        >
          {viewMode === 'form' ? 'All Programs' : 'New Program'}
        </button>
      </div>

      <div className="page-content single-column">
        {/* Form Section - Show only when viewMode is 'form' */}
        {viewMode === 'form' && (
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <div className="card-header">
                <h4>Program Details Form</h4>
              </div>
              <div className="card-body">
                <CreateProgramForm onSuccess={handleSuccess} />
              </div>
            </div>
          </motion.div>
        )}

        {/* List Section - Show only when viewMode is 'list' */}
        {viewMode === 'list' && (
          <motion.div
            className="list-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <div className="card-header">
                <h4>All Programs</h4>
              </div>
              <div className="card-body">
                {/* Status Filter */}
                <div className="mb-3">
                  <label className="form-label">Filter by Status</label>
                  <select 
                    className="form-select" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {loadingList && <PageLoader fullScreen={false} />}
                {!loadingList && programs && programs.length > 0 ? (
                  (() => {
                    const filteredPrograms = programs.filter(program => {
                      const programStatus = getProgramStatus(program);
                      if (statusFilter === 'ALL') return true;
                      return programStatus === statusFilter;
                    });

                    return filteredPrograms.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Program ID</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Budget</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPrograms.map((program) => (
                              <motion.tr
                                key={program.programId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <td>#{program.programId}</td>
                                <td className="fw-bold">{program.title}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={program.description}>
                                      {program.description.length > 100
                                        ? program.description.substring(0, 100) + '...'
                                        : program.description}
                                    </span>
                                    {program.description.length > 100 && (
                                      <motion.button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setViewDetailModal({ isOpen: true, program })}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ flexShrink: 0, padding: '0.4rem 0.6rem', fontSize: '0.70rem', fontWeight: '500' }}
                                      >
                                        More
                                      </motion.button>
                                    )}
                                  </div>
                                </td>
                                <td>{formatDate(program.startDate)}</td>
                                <td>{formatDate(program.endDate)}</td>
                                <td className="fw-bold">
                                  {formatCurrency(program.budget)}
                                </td>
                                <td>
                                  <span
                                    className={`status-badge ${
                                      getProgramStatus(program) === 'ACTIVE'
                                        ? 'status-active'
                                        : 'status-closed'
                                    }`}
                                  >
                                    {getProgramStatus(program)}
                                  </span>
                                </td>
                                <td>
                                  <motion.button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleUpdate(program)}
                                    disabled={updateDialog.isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Update
                                  </motion.button>
                                  <motion.button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(program.programId)}
                                    disabled={deleteConfirm.isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                      style={{ marginTop: '0.2rem' , padding: '0.4rem 0.8rem', fontSize: '0.90rem', fontWeight: '500' }}
                                  >
                                    Delete
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-state-simple">
                        <p>No programs found with the selected filter.</p>
                      </div>
                    );
                  })()
                ) : (
                  !loadingList && (
                    <div className="empty-state-simple">
                      <p>No programs found. Create your first program using the form.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* View Program Details Modal */}
      {viewDetailModal.isOpen && viewDetailModal.program && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setViewDetailModal({ isOpen: false, program: null })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e4d8b', fontSize: '1.5rem' }}>
                {viewDetailModal.program.title}
              </h3>
              <p style={{ margin: 0, color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {viewDetailModal.program.description}
              </p>
            </div>
            <button
              onClick={() => setViewDetailModal({ isOpen: false, program: null })}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1e4d8b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Update Program Dialog */}
      <UpdateProgramDialog
        isOpen={updateDialog.isOpen}
        program={updateDialog.program}
        isLoading={updateDialog.isLoading}
        onConfirm={confirmUpdate}
        onCancel={() => setUpdateDialog({ isOpen: false, program: null, isLoading: false })}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteConfirm.isLoading}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null, isLoading: false })}
      />
    </motion.div>
  );
};

export default CreatePrograms;
