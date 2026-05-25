import React, { useEffect, useState } from 'react';
import { uploadDoc, updateDoc, fetchAllDocuments } from '../../api/CitizenAreef';
import { getEntityId } from '../../api/storage';
import './CitizenModule.css';

const initialUploadForm = {
  docType: 'PAN',
  file: null,
};

const DOC_TYPES = ['PAN', 'AADHAR', 'PASSPORT', 'OTHERS', 'FINANCIAL_STATEMENT'];

export const Documents = () => {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const formatDate = (date) => date.toISOString().slice(0, 10);

  useEffect(() => {
    const storedProfile = localStorage.getItem('citizenProfile');
    const storedEntityId = localStorage.getItem('entityId') || localStorage.getItem('activeEntityId');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else if (storedEntityId) {
      setProfile({ entityId: Number(storedEntityId) });
    }
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetchAllDocuments();
        setDocuments(response || []);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setDocumentsLoading(false);
      }
    };
    loadDocuments();
  }, []);

  // Helper to view documents (open backend download endpoint)
  const handleView = (entityIdParam, docType) => {
    const fileUrl = `http://localhost:9091/documents/downloadDoc/${entityIdParam}/${encodeURIComponent(docType)}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadForm((prev) => ({
        ...prev,
        file,
      }));
      setMessage('');
      setErrorMessage('');
    } else {
      setMessage('Please upload a PDF file only.');
      setUploadForm((prev) => ({ ...prev, file: null }));
    }
  };

  const handleDocTypeChange = (e) => {
    setUploadForm((prev) => ({ ...prev, docType: e.target.value }));
  };

  const entityId = profile?.entityId || getEntityId();
  const entityType = profile?.type || null;
  
  const getAllowedDocTypes = () => {
    if (entityType === 'CITIZEN') {
      return DOC_TYPES.filter((type) => type !== 'FINANCIAL_STATEMENT');
    }
    if (entityType === 'BUSINESS') {
      return ['FINANCIAL_STATEMENT'];
    }
    return [];
  };

  const allowedDocTypes = getAllowedDocTypes();

  const getDocumentEntityId = (doc) => doc.entityId ?? doc.entity?.entityId ?? doc.entity?.id;
  const filteredDocuments = documents.filter((doc) => {
    const docEntityId = getDocumentEntityId(doc);
    return String(docEntityId) === String(entityId);
  });

  const getAvailableDocTypes = () => {
    return allowedDocTypes.filter(type => {
      const existing = filteredDocuments.find(doc => doc.docType === type);
      return !existing || existing.verificationStatus === 'REJECTED';
    });
  };

  const availableDocTypes = getAvailableDocTypes();

  useEffect(() => {
    if (availableDocTypes.length === 0) {
      return;
    }

    if (!availableDocTypes.includes(uploadForm.docType)) {
      setUploadForm((prev) => ({
        ...prev,
        docType: availableDocTypes[0],
      }));
    }
  }, [availableDocTypes, uploadForm.docType]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!entityId) {
      setErrorMessage('Please complete registration before uploading documents.');
      return;
    }

    if (!uploadForm.file) {
      setMessage('Upload a PDF document before submitting.');
      return;
    }

    setSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const payload = {
        docType: uploadForm.docType,
        uploadedDate: formatDate(new Date()),
        file: uploadForm.file,
      };
      
      const existingRejected = filteredDocuments.find(
        (doc) => doc.docType === uploadForm.docType && doc.verificationStatus?.toUpperCase() === 'REJECTED'
      );
      const existingAny = filteredDocuments.find(
        (doc) => doc.docType === uploadForm.docType
      );

      if (existingRejected) {
        await updateDoc(entityId, uploadForm.docType, payload);
      } else if (!existingAny) {
        await uploadDoc(entityId, payload);
      } else {
        setErrorMessage(`Document of type ${uploadForm.docType} already exists.`);
        return;
      }
      setMessage('Document uploaded successfully.');
      const refreshed = await fetchAllDocuments();
      setDocuments(refreshed || []);
      setUploadForm((prev) => ({
        ...prev,
        file: null,
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Upload failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReupload = (doc) => {
    if (!availableDocTypes.includes(doc.docType)) {
      setErrorMessage(`${doc.docType} cannot be re-uploaded at this time.`);
      return;
    }
    setUploadForm({
      docType: doc.docType,
      file: null,
    });
    setMessage(`Re-upload document for ${doc.docType}.`);
  };

  const loading = profileLoading || documentsLoading;

  if (loading) {
    return (
      <div className="page-wrapper">
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper text-dark">
      <div className="page-header">
        <h1>Document Management</h1>
        <p>Upload your documents for verification. PDF only.</p>
      </div>

      {!entityId ? (
        <div className="section-card">
          <p>Please complete registration first before uploading documents.</p>
        </div>
      ) : (
        <>
          <div className="section-card">
            <h2>Upload New Document</h2>
            <form className="registration-form" onSubmit={handleUploadSubmit}>
              <select name="docType" value={uploadForm.docType} onChange={handleDocTypeChange}>
                {availableDocTypes.map((docType) => (
                  <option key={docType} value={docType}>
                    {docType}
                  </option>
                ))}
              </select>

              <input type="file" accept=".pdf" onChange={handleUploadChange} />
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div className="section-card">
            <h2>Your Documents</h2>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>File</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">No documents uploaded yet.</td>
                  </tr>
                )}
                {filteredDocuments.map((doc) => (
                  <tr key={doc.docType}>
                    <td className="fw-bold">{doc.docType}</td>
                    <td>{doc.fileURI}</td>
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
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-sm" 
                          style={{ backgroundColor: '#e2e8f0', color: '#475569' }}
                          onClick={() => handleView(getDocumentEntityId(doc), doc.docType)}
                        >
                          View
                        </button>
                        {doc.verificationStatus === 'REJECTED' && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleReupload(doc)}
                          >
                            Re-upload
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Documents;