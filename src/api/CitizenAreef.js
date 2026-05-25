import axiosInstance from './axiosInstance';
export const createCitizen = (data) => axiosInstance.post('/entities/createCitizen', data);
export const getCitizenById = (id) => axiosInstance.get(`/entities/getCitizenById/${id}`);
export const getCitizenByUserId = (userId) => axiosInstance.get(`/entities/getCitizenByUserId/${userId}`);
export const approveCitizen = (id) => axiosInstance.put(`/entities/approveCitizen/${id}`);
export const updateCitizen = (id, data) => axiosInstance.put(`/entities/updateCitizenById/${id}`, data);

/**
 * DOCUMENT MANAGEMENT ENDPOINTS
 */
export const uploadDoc = (entityId, docData) => {
  const form = new FormData();
  form.append('docType', docData.docType);
  form.append('uploadedDate', docData.uploadedDate);
  form.append('file', docData.file);

  return axiosInstance.post(`/documents/uploadDoc/${entityId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};
export const verifyDoc = (entityId, docType) => axiosInstance.put(`/documents/verify/${entityId}/${docType}`);
export const rejectDoc = (entityId, docType) => axiosInstance.put(`/documents/reject/${entityId}/${docType}`);
export const fetchAllDocuments = () =>
  axiosInstance.get('/documents/getAllDocument').then((response) => response.data);
export const updateDoc = (entityId, docType, docData) => {
  const form = new FormData();
  form.append('uploadedDate', docData.uploadedDate);
  if (docData.file) form.append('file', docData.file);

  return axiosInstance.put(`/documents/updateDoc/${entityId}/${encodeURIComponent(docType)}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};

export default axiosInstance;