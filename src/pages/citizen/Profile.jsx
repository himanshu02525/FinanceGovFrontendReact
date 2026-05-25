import React, { useEffect, useState } from 'react';
import { getCitizenById, getCitizenByUserId, updateCitizen } from '../../api/CitizenAreef';
import './CitizenModule.css';

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CITIZEN',
    contactInfo: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // ✅ Extract real email from login session
  const getLoginEmail = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.email;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const storedProfile = localStorage.getItem('citizenProfile');
      const storedUserId = localStorage.getItem('userId');
      
      if (!storedProfile && !storedUserId) {
        setLoading(false);
        return;
      }

      const parsedProfile = storedProfile ? JSON.parse(storedProfile) : null;
      const entityId = parsedProfile?.entityId;

      if (!entityId && storedUserId) {
        try {
          const response = await getCitizenByUserId(storedUserId);
          const profileData = response?.data || response;
          setProfile(profileData);
          setFormData({
            name: profileData.name || '',
            type: profileData.type || 'CITIZEN',
            contactInfo: profileData.contactInfo || '',
            address: profileData.address || ''
          });
          localStorage.setItem('citizenProfile', JSON.stringify(profileData));
          return;
        } catch (err) {
          if (err.response?.status === 404) {
            setLoading(false);
            return;
          }
          setError('Failed to load profile from server');
          setLoading(false);
          return;
        }
      }

      if (entityId) {
        try {
          const response = await getCitizenById(entityId);
          const profileData = response?.data || response;
          setProfile(profileData);
          setFormData({
            name: profileData.name || '',
            type: profileData.type || 'CITIZEN',
            contactInfo: profileData.contactInfo || '',
            address: profileData.address || ''
          });
          localStorage.setItem('citizenProfile', JSON.stringify(profileData));
        } catch (err) {
          setError('Failed to load profile from server');
          setProfile(parsedProfile);
        }
      } else {
        setProfile(parsedProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setStatusMessage('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name || '',
        type: profile.type || 'CITIZEN',
        contactInfo: profile.contactInfo || '',
        address: profile.address || ''
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile?.entityId) {
      setError('Cannot save profile: entity ID is missing.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...profile,
        userId: profile.userId || localStorage.getItem('userId'),
        name: formData.name,
        type: formData.type,
        contactInfo: formData.contactInfo,
        address: formData.address
      };

      const response = await updateCitizen(profile.entityId, payload);
      const updatedProfile = response?.data || payload;
      setProfile(updatedProfile);
      localStorage.setItem('citizenProfile', JSON.stringify(updatedProfile));
      setStatusMessage('Profile saved successfully.');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-wrapper"><p>Loading profile...</p></div>;

  if (!profile) {
    return (
      <div className="page-wrapper">
        <div className="page-header text-center">
          <h1>Citizen Profile</h1>
          <p>Please complete registration first to view your profile details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1>Citizen Profile</h1>
          <p>Review your application details and current verification status.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {statusMessage && <div className="alert alert-success">{statusMessage}</div>}

      <div className="profile-grid">
        <div className="profile-card">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="profile-row">
                <label>Name</label>
                <input
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="profile-row">
                <label>Type</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="CITIZEN">Citizen</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>
              <div className="profile-row">
                <label>Address</label>
                <input
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="profile-row">
                <label>Contact Info</label>
                <input
                  className="form-control"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                />
              </div>
              <div className="profile-actions">
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-secondary ml-2" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-row">
                <strong>Name</strong>
                <p>{profile.name}</p>
              </div>
              <div className="profile-row">
                <strong>Email</strong>
                {/* ✅ Dynamic Email: API -> Login Storage -> Fallback */}
                <p>{profile.email || getLoginEmail() || 'user@example.com'}</p>
              </div>
              <div className="profile-row">
                <strong>Type</strong>
                <p>{profile.type}</p>
              </div>
              <div className="profile-row">
                <strong>Address</strong>
                <p>{profile.address || 'Not provided'}</p>
              </div>
              <div className="profile-row">
                <strong>Contact Info</strong>
                <p>{profile.contactInfo}</p>
              </div>
              <div className="profile-row">
                <strong>Status</strong>
                <p>
                  <span className={`badge-status ${profile.status === 'ACTIVE' ? 'badge-approved' : 'badge-pending'}`}>
                    {profile.status || 'PENDING'}
                  </span>
                </p>
              </div>
              <div className="profile-actions">
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;