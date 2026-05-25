import axiosInstance from './axiosInstance';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      if (response.data && response.data.token) {
        console.log(localStorage.getItem('userId')); // Debugging Check before setting
        
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userId', response.data.userId);
       
        if (response.data.role == "ROLE_CITIZEN") {
            localStorage.setItem('entityId', String(response.data.entityId));
        }
        const userObj = {
          userId: response.data.userId,
          role: response.data.role,
          email: response.data.email || credentials.email,
          username: response.data.username
        };

        localStorage.setItem('user', JSON.stringify(userObj));

        // Debugging Verify immediately after setting
        console.log("Saved userId:", localStorage.getItem('userId'));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Network Error");
    }
  },

  //  PUBLIC REGISTRATION 
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Registration Failed");
    }
  },

  // 3. OTP REQUEST 
  requestOtp: async (email) => {
    return await axiosInstance.post(`/api/auth/request-otp?email=${email}`);
  },

  // 4. VERIFY & UPDATE 
  updatePassword: async (otpData) => {
    return await axiosInstance.put('/api/auth/verify-and-update-password', otpData);
  },

  // 5. HELPER: LOGOUT
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  // 6. HELPER: GET LOCAL DATA
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};