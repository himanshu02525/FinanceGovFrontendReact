import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';

export const DocumentList = ({ documents = [], entityId }) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState('');

  // Normalize documents to a safe array format
  const docList = Array.isArray(documents) ? documents : [];

  // Helper to extract the core ID from diverse payload patterns
  const getDocumentEntityId = (idSource) => {
    if (!idSource) return '';
    if (typeof idSource === 'object') {
      return idSource.entityId || idSource.id || idSource.entity?.entityId || idSource.entity?.id || '';
    }
    return idSource;
  };

  // Automatically sync/reset selection when the entityId or documents array updates
  useEffect(() => {
    if (!entityId || docList.length === 0) {
      setSelectedDocumentType('');
      return;
    }

    // Default to the first available document type if current selection isn't valid anymore
    if (!docList.some((doc) => doc.docType === selectedDocumentType)) {
      setSelectedDocumentType(docList[0].docType || '');
    }
  }, [entityId, docList, selectedDocumentType]);

  // Handle the external preview stream redirect
  const handlePreviewDocument = () => {
    const activeId = getDocumentEntityId(entityId);
    const docExists = docList.some((item) => item.docType === selectedDocumentType);
    
    if (!activeId || !selectedDocumentType || !docExists) {
      alert('Invalid entity ID or document missing from selection.');
      return;
    }

    const encodedType = encodeURIComponent(selectedDocumentType);
    const previewUrl = `http://localhost:9091/documents/downloadDoc/${activeId}/${encodedType}`;
    
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ marginTop: '10px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
      <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
        <strong><FileText size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Verification Documents:</strong> 
        {docList.length > 0 ? ` ${docList.length} files attached` : ' No digital documents attached to this entity profile'}
      </p>

      {docList.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', minWidth: '180px', background: '#fff' }}
          >
            {docList.map((doc, idx) => (
              <option key={doc.docType || idx} value={doc.docType}>
                {doc.docType}
              </option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={handlePreviewDocument}
            className="btn-search"
            style={{ padding: '10px 18px', minWidth: '150px', cursor: 'pointer' }}
          >
            Preview Document
          </button>
        </div>
      )}
    </div>
  );
};
export default DocumentList;