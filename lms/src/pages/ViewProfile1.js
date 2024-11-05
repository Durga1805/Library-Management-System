// ViewProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewProfile1 = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch profile details from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        const response = await axios.get(`/api/users/profile/${userId}`); // Fetch user profile by userId
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch user profile.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Navigate to edit profile page
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center">
          {profile.profilePic ? (
            <img 
              src={`data:image/jpeg;base64,${profile.profilePic}`} 
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-white text-lg">P</span>
            </div>
          )}
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <button 
              onClick={handleEditProfile} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">Profile Details</h3>
          <div className="mt-4 space-y-2">
            <div>
              <strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}
            </div>
            <div>
              <strong>Phone Number:</strong> {profile.phoneno || 'N/A'}
            </div>
            <div>
              <strong>Department:</strong> {profile.dept}
            </div>
            <div>
              <strong>Status:</strong> {profile.status}
            </div>
            <div>
              <strong>Address:</strong> {profile.address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile1;
