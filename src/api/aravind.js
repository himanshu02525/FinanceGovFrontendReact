import axiosInstance from './axiosInstance';

// Consolidate all API clients to use the single axiosInstance
// All disclosure, tax, and entity endpoints go through API Gateway
export const apiClient = axiosInstance;
export const entityClient = axiosInstance;
