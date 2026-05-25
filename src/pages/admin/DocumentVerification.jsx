import React, { useState, useEffect } from 'react';
import './DocumentVerification.css';
import './Common.css'
import { fetchAllDocuments, verifyDocument, rejectDocument, getDocumentPreview } from '../../api/Admin';

export const DocumentVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const resolveDocumentEntityId = (doc) => {
    return (
      doc.entityId ||
      doc.entity?.entityId ||
      doc.entity?.id ||
      doc.citizenBusiness?.entityId ||
      doc.citizenBusiness?.id ||
      null
    );
  };

  const loadDocuments = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const docs = await fetchAllDocuments();
      setDocuments(docs || []);
      setErrorMessage(''); // Clear errors on successful load
    } catch (error) {
      console.error('Failed to load documents:', error);
      setErrorMessage('Unable to load documents from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDocuments(true);
  }, []);

  const handleOpenDocument = (doc) => {
    setSelectedDocument(doc);
    setDocumentPreviewUrl(null);
    setPreviewLoading(true);
    setErrorMessage(''); // Reset error message when opening new doc
    
    const entityId = resolveDocumentEntityId(doc);
    
    getDocumentPreview(entityId, encodeURIComponent(doc.docType))
      .then((response) => {
        // Fix: Ensure response is a valid blob before creating URL
        if (response && response.data) {
          const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setDocumentPreviewUrl(url);
        } else {
          throw new Error("Invalid file data received");
        }
      })
      .catch((error) => {
        console.error('Preview error:', error);
        setErrorMessage(`Error: Could not retrieve ${doc.docType} file. (Backend 500)`);
      })
      .finally(() => setPreviewLoading(false));
  };

  const handleCloseDocument = () => {
    if (documentPreviewUrl) URL.revokeObjectURL(documentPreviewUrl);
    setSelectedDocument(null);
    setDocumentPreviewUrl(null);
  };

  const handleAction = async (actionType, doc) => {
    const entityId = resolveDocumentEntityId(doc);
    const docType = encodeURIComponent(doc.docType);

    try {
      if (actionType === 'VERIFY') {
        await verifyDocument(entityId, docType);
      } else {
        await rejectDocument(entityId, docType);
      }
      handleCloseDocument();
      loadDocuments(); 
    } catch (error) {
      setErrorMessage(`Failed to ${actionType.toLowerCase()} document.`);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    return activeTab === 'ALL' || doc.verificationStatus === activeTab;
  });

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Admin: Document Verification</h1>
        <button className="btn btn-sm btn-secondary" onClick={() => loadDocuments(false)} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {errorMessage && (
        <div className="error-message" style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #f5c6cb' }}>
          {errorMessage}
        </div>
      )}

      <div className="tab-nav">
        {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map((tab) => (
          <button
            key={tab}
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="section-card">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Entity ID</th>
              <th>Document Type</th>
              <th>Uploaded Date</th>
              <th>Status</th>
              <th className="text-center">Review</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center">Loading...</td></tr>
            ) : filteredDocuments.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No documents in this category.</td></tr>
            ) : (
              filteredDocuments.map((doc) => (
                /* FIX: Using unique documentId to solve key collision warning */
                <tr key={doc.documentId || `${doc.entityId}-${doc.docType}-${doc.uploadedDate}`}>
                  <td>{resolveDocumentEntityId(doc)}</td>
                  <td className="fw-bold">{doc.docType}</td>
                  <td>{doc.uploadedDate}</td>
                  <td>
                    <span className={`badge-status ${
                      doc.verificationStatus === 'VERIFIED' ? 'badge-approved' :
                      doc.verificationStatus === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
                    }`}>
                      {doc.verificationStatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary" onClick={() => handleOpenDocument(doc)}>
                      View & Verify
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedDocument && (
        <div className="modal-overlay" onClick={handleCloseDocument}>
          <div className="modal-content large-modal" style={{ width: '80%', maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review: {selectedDocument.docType}</h2>
              <button className="modal-close" onClick={handleCloseDocument}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <p><strong>Entity ID:</strong> {resolveDocumentEntityId(selectedDocument)}</p>
                <p><strong>Date:</strong> {selectedDocument.uploadedDate}</p>
              </div>
              
              <div className="document-preview-container" style={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                {previewLoading ? (
                  <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
                    <p>Fetching PDF...</p>
                  </div>
                ) : documentPreviewUrl ? (
                  <iframe src={documentPreviewUrl} width="100%" height="500px" title="Preview" />
                ) : (
                  <div style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff5f5' }}>
                    <p style={{ color: '#721c24', fontWeight: 'bold' }}>Preview Unavailable</p>
                    <p style={{ fontSize: '0.85rem' }}>The file could not be found on the server.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '15px' }}>
              <button className="btn btn-secondary" onClick={handleCloseDocument}>Cancel</button>
              {selectedDocument.verificationStatus === 'PENDING' && (
                <>
                  <button className="btn btn-danger" onClick={() => handleAction('REJECT', selectedDocument)}>Reject</button>
                  <button className="btn btn-primary" onClick={() => handleAction('VERIFY', selectedDocument)}>Approve & Verify</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;