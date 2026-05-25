import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCitizenByUserId, createCitizen } from '../../api/CitizenAreef';

const CitizenRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'CITIZEN',
  });
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyStatus = async () => {
      const storedUserId = localStorage.getItem('userId');
      const localProfile = localStorage.getItem('citizenProfile');

      if (localProfile) {
        setIsRegistered(true);
        setIsCheckingUser(false);
        return;
      }

      if (storedUserId) {
        try {
          const response = await getCitizenByUserId(storedUserId);
          if (response) {
            localStorage.setItem('citizenProfile', JSON.stringify(response.data || response));
            setIsRegistered(true);
          }
        } catch (error) {
          console.log("No existing profile found on server.");
        }
      }
      setIsCheckingUser(false);
    };
    verifyStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: Number(localStorage.getItem('userId')),
        name: formData.name,
        type: formData.type,
        address: formData.address,
        contactInfo: formData.phone,
      };
      const response = await createCitizen(payload);
      localStorage.setItem('citizenProfile', JSON.stringify(response.data));
      toast.success('Registration Successful!');
      setIsRegistered(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Registration failed. Please try again.');
    }
  };

  if (isCheckingUser) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="container mt-5">
        <div className="card shadow-sm border-0 p-5 text-center bg-white">
          <div className="mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              <UserCheck size={40} />
            </div>
          </div>
          <h2 className="fw-bold text-dark">Registration Completed</h2>
          <p className="fs-5 mx-auto" style={{ maxWidth: '600px'}}>
            Your citizen profile is active. You have already completed the registration process. 
            The next step is to ensure your identity documents are uploaded for verification.
          </p>
          
          <div className="mt-4 d-flex gap-3 justify-content-center">
            <button 
              onClick={() => navigate('/documents')} 
              className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
            >
              <FileText size={18} /> Upload Documents
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="btn btn-outline-secondary px-4 py-2"
            >
              View Profile <ArrowRight size={18} className="ms-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">Citizen Registration</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input 
                className="form-control" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              <input 
                className="form-control" 
                required 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Home Address</label>
              <textarea 
                className="form-control" 
                required 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Type</label>
              <select
                className="form-control"
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="CITIZEN">CITIZEN</option>
                <option value="BUSINESS">BUSINESS</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary px-5 mt-3">Register Profile</button>
        </form>
      </div>
    </div>
  );
};

export default CitizenRegistration;