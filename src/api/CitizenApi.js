// src/api/citizenApi.js
import axiosInstance from './axiosInstance';

export const citizenApi = {
  // Fetch all programs for the citizen table
  getAllPrograms: () => axiosInstance.get('/programs/fetchAll'),

  // Citizen submits application
  submitApplication: (applicationData) => 
    axiosInstance.post('/applications/save', applicationData),

  // Optional: Fetch previous applications for context
//   getApplicationsByEntity: (entityId) => 
//     axios.get(`${API_BASE_URL}/applications/fetchByEntity/${entityId}`)
};