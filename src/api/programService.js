import axiosInstance from './axiosInstance';
const PROGRAM_API = '/programs';
// Create 
// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => {
    console.log('✓ Program API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  error => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`✗ API Error [${status}]:`, {
        status,
        data,
        url: error.config?.url,
      });
      
      // Format error message
      const errorMessage = data?.message || data?.error || 'An error occurred';
      const errorCode = data?.errorCode || 'UNKNOWN_ERROR';
      
      return Promise.reject({
        status,
        message: errorMessage,
        code: errorCode,
        details: data?.details || null,
        timestamp: data?.timestamp,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('✗ No response received:', {
        url: error.config?.url,
        method: error.config?.method,
        error: error.request,
      });
      return Promise.reject({
        status: 0,
        message: 'No response from server. Please check your connection.',
        code: 'NO_RESPONSE',
      });
    } else {
      // Error in request setup
      console.error('✗ Request setup error:', {
        message: error.message,
        url: error.config?.url,
      });
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        code: 'REQUEST_ERROR',
      });
    }
  }
);

const programService = {
  /**
   * Create a new financial program
   * @param {Object} data - Program data
   * @param {string} data.title - Program title
   * @param {string} data.description - Program description
   * @param {number} data.budget - Program budget
   * @param {string} data.startDate - Start date (ISO format, optional - defaults to current date)
   * @param {string} data.endDate - End date (ISO format)
   * @param {string} data.status - Status (optional - defaults to ACTIVE)
   * @returns {Promise<Object>} - Response with programId, title, description, budget, status
   */
  createProgram: async (data) => {
    try {
      const response = await axiosInstance.post(`${PROGRAM_API}/save`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all financial programs
   * @returns {Promise<Array>} - Array of all programs
   */
  getAllPrograms: async () => {
    try {
      const response = await axiosInstance.get(`${PROGRAM_API}/fetchAll`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get program by ID
   * @param {number} programId - Program ID
   * @returns {Promise<Object>} - Program details
   */
  getProgramById: async (programId) => {
    try {
      const response = await axiosInstance.get(`${PROGRAM_API}/fetch/${programId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a program
   * @param {number} programId - Program ID to update
   * @param {Object} data - Updated program data
   * @returns {Promise<Object>} - Updated program details
   */
  updateProgram: async (programId, data) => {
    try {
      const response = await axiosInstance.put(`${PROGRAM_API}/update/${programId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a program
   * @param {number} programId - Program ID to delete
   * @returns {Promise<Object>} - Response with message
   */
  deleteProgram: async (programId) => {
    try {
      console.log('📤 SENDING DELETE REQUEST');
      
      const response = await axiosInstance.delete(`${PROGRAM_API}/delete/${programId}`);
      
      return response.data;
    } catch (error) {
      
      throw error;
    }
  },

  /**
   * Get programs by status
   * @param {string} status - Program status (ACTIVE or CLOSED)
   * @returns {Promise<Array>} - Array of programs with specified status
   */
  getProgramsByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`${PROGRAM_API}/fetchByStatus/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get program summary/metrics
   * @returns {Promise<Object>} - Summary data
   */
  getProgramSummary: async () => {
    try {
      const response = await axiosInstance.get(`${PROGRAM_API}/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default programService;
