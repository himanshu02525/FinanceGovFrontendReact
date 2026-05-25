import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import AllocateResourcesForm from './AllocateResourcesForm';
import { PageLoader } from '../../components/global/Loader';
import { ConfirmDialog } from '../../components/global/ConfirmDialog';
import resourceService from '../../api/resourceService';
import './Pages.css';

export const AllocateResources = () => {
  const location = useLocation();
  const [resources, setResources] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    // Check if we came from Dashboard with viewMode state 
    return location.state?.viewMode || 'form';
  });
  const [resourceStatusFilter, setResourceStatusFilter] = useState('ALL');
  const [programIdFilter, setProgramIdFilter] = useState('ALL');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    itemId: null,
    isLoading: false,
  });

  // Load resources when component mounts or when switching to list view
  useEffect(() => {
    if (viewMode === 'list') {
      loadResources();
    }
  }, [viewMode]);

  const handleSuccess = async (newResource) => {
    setResources(prev => [newResource, ...prev]);
    loadResources();
  };

  const loadResources = async () => {
    setLoadingList(true);
    try {
      const data = await resourceService.getAllAllocatedResources();
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (resourceId) => {
    setDeleteConfirm({ isOpen: true, itemId: resourceId, isLoading: false });
  };

  const filteredResources = resources.filter(resource => {
    const statusMatch = resourceStatusFilter === 'ALL' || resource.status === resourceStatusFilter;
    const programIdMatch = programIdFilter === 'ALL' || resource.programId.toString() === programIdFilter;
    const resourceTypeMatch = resourceTypeFilter === 'ALL' || resource.type === resourceTypeFilter;
    return statusMatch && programIdMatch && resourceTypeMatch;
  });

  // Get unique program IDs and resource types for filter dropdowns
  const uniqueProgramIds = ['ALL', ...new Set(resources.map(r => r.programId.toString()))];
  const uniqueResourceTypes = ['ALL', ...new Set(resources.map(r => r.type))];

  const confirmDelete = async () => {
    if (!deleteConfirm.itemId) {
      console.error('No item ID to delete');
      return;
    }

    setDeleteConfirm(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Deleting resource:', deleteConfirm.itemId);
      const response = await resourceService.deleteResource(deleteConfirm.itemId);
      console.log('Delete response:', response);
      
      // Close dialog first
      setDeleteConfirm({ isOpen: false, itemId: null, isLoading: false });
      
      // Then reload the list to get fresh data
      await loadResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
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
          <Zap size={32} />
          <div>
            <h2>Allocate Resources</h2>
            <p className="text-muted">Manage resources for your programs</p>
          </div>
        </div>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setViewMode(viewMode === 'form' ? 'list' : 'form')}
        >
          {viewMode === 'form' ? 'View Allocations' : 'New Allocation'}
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
                <h4>Resource Allocation Form</h4>
              </div>
              <div className="card-body">
                <AllocateResourcesForm onSuccess={handleSuccess} />
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
                <h4>All Allocated Resources</h4>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="mb-0">
                    <label className="form-label">Filter by Status</label>
                    <select 
                      className="form-select" 
                      value={resourceStatusFilter} 
                      onChange={(e) => setResourceStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="UTILIZED">Utilized</option>
                    </select>
                  </div>

                  <div className="mb-0">
                    <label className="form-label">Filter by Program ID</label>
                    <select 
                      className="form-select" 
                      value={programIdFilter} 
                      onChange={(e) => setProgramIdFilter(e.target.value)}
                    >
                      {uniqueProgramIds.map((id) => (
                        <option key={id} value={id}>
                          {id === 'ALL' ? 'All Programs' : `Program #${id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-0">
                    <label className="form-label">Filter by Resource Type</label>
                    <select 
                      className="form-select" 
                      value={resourceTypeFilter} 
                      onChange={(e) => setResourceTypeFilter(e.target.value)}
                    >
                      {uniqueResourceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === 'ALL' ? 'All Types' : type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {loadingList && <PageLoader fullScreen={false} />}
                {!loadingList && filteredResources && filteredResources.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Program ID</th>
                          <th>Resource Type</th>
                          <th>Quantity</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map((resource) => (
                          <motion.tr
                            key={resource.resourceId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td>{resource.programId}</td>
                            <td>
                              <span className="badge badge-primary">
                                {resource.type}
                              </span>
                            </td>
                            <td className="fw-bold">{resource.quantity}</td>
                            <td>
                              <span className={`badge badge-${resource.status === 'AVAILABLE' ? 'info' : 'warning'}`}>
                                {resource.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(resource.resourceId)}
                              >
                                Delete
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !loadingList && (
                    <div className="empty-state-simple">
                      <p>No resources allocated yet. Create your first allocation!</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Resource Allocation"
        message="Are you sure you want to delete this resource allocation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null, isLoading: false })}
        isLoading={deleteConfirm.isLoading}
        isDangerous={true}
      />
    </motion.div>
  );
};

export default AllocateResources;
