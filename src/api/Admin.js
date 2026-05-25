import axiosInstance from './axiosInstance';

// Update endpoints to use API Gateway routes with /entities and /documents paths
export const fetchAllCitizens = () =>
  axiosInstance.get('/entities/getAllEntity').then((response) => response.data);

export const approveCitizen = (entityId) =>
  axiosInstance.put(`/entities/approveCitizen/${entityId}`).then((response) => response.data);

export const fetchAllDocuments = () =>
  axiosInstance.get('/documents/getAllDocument').then((response) => response.data);

export const verifyDocument = (entityId, docType) =>
  axiosInstance.put(`/documents/verify/${entityId}/${docType}`).then((response) => response.data);

export const rejectDocument = (entityId, docType) =>
  axiosInstance.put(`/documents/reject/${entityId}/${docType}`).then((response) => response.data);

export const getDocumentPreview = (entityId, docType) =>
  axiosInstance.get(`/documents/downloadDoc/${entityId}/${docType}`, {
    responseType: 'blob'
  }).catch(() => {
    // Fallback to alternative endpoint if downloadDoc doesn't exist
    return axiosInstance.get(`/documents/getDoc/${entityId}/${docType}`, {
      responseType: 'blob'
    });
  });
