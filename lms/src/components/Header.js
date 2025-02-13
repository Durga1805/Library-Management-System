import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { handleLogout } from '../utils/auth';
import axiosInstance from '../utils/axiosConfig';
import Notifications from './Notifications';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/users/profile');
      setUserName(response.data.name);
      if (response.data.profilePic) {
        setProfilePic(`http://localhost:8080${response.data.profilePic}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <header className="h-16 bg-gradient-to-r from-blue-500 to-red-700 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center">
       
        <h1 className="text-white text-xl font-bold ml-4">{title}</h1>
      </div>

      <div className="flex items-center space-x-4 relative">
        <span className="text-white">{userName}</span>
        <div className="relative" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
          <button className="flex items-center focus:outline-none">
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <FaUserCircle className="w-10 h-10 text-white" />
            )}
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              
              <button
                onClick={() => handleLogout(navigate)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <Notifications />
      </div>
    </header>
  );
};

export default Header;
