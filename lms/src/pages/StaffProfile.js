import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { FaBars, FaBook, FaHistory,FaNewspaper, FaUser, FaCamera, FaKey, FaDownload, FaUserCircle } from 'react-icons/fa';
import { handleLogout } from '../utils/auth';
import { generateUserProfilePDF } from '../utils/pdfGenerator';

const StaffProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phoneno: '',
    address: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setMessage('Authentication information missing');
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get('/api/users/profile');
      console.log('Profile response:', response.data);

      if (response.data) {
        setUser(response.data);
        setEditData({
          name: response.data.name || '',
          email: response.data.email || '',
          phoneno: response.data.phoneno || '',
          address: response.data.address || ''
        });
        
        if (response.data.profilePic) {
          setProfilePic(`http://localhost:8080${response.data.profilePic}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error.response || error);
      const errorMessage = error.response?.data?.message || 'Error fetching profile';
      setMessage(errorMessage);
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/users/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfilePic(`http://localhost:8080${response.data.profilePic}`);
      setMessage('Profile picture updated successfully');
      
      // Refresh user data to get updated profile
      await fetchUserProfile();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setMessage(error.response?.data?.message || 'Error uploading profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (passwordData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setMessage('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(error.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put('/api/users/update-profile', editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setMessage('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const downloadProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await generateUserProfilePDF(user, profilePic);
      setMessage('Profile downloaded successfully');
    } catch (error) {
      console.error('Error downloading profile:', error);
      setMessage('Error downloading profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4 ${
        isMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link
                  to="/staffpage"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  Dashboard
                </Link>

        <nav className="flex flex-col space-y-3">
          {/* Books Dropdown */}
          <div className="relative">
            <button
              className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Books
              </span>
              <FaBars />
            </button>
            {isBooksDropdownOpen && (
              <div className="mt-2 py-2 bg-gray-700 rounded-md">
                <Link
                  to="/viewbooks"
                  className="block px-4 py-2 hover:bg-gray-600"
                >
                  View Books
                </Link>
               
              </div>
            )}
          </div>

          {/* Profile Settings */}
          <Link
            to="/staffprofile"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaUser className="mr-2" />
            Profile Settings
          </Link>

          {/* Borrowed Books */}
          <Link
            to="/my-books-details"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          <Link
            to="/lending-archives"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            Lending Archives
          </Link>
          <Link
            to="/staffnewspaper"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaNewspaper className="mr-2" />
            Newspapers
          </Link>
         
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Updated Header */}
        <header className="h-16 bg-gradient-to-r from-blue-500 to-red-700 flex items-center justify-between px-6 shadow-lg">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold ml-4">Profile Settings</h1>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4 relative">
            <span className="text-white">{user?.name}</span>
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

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {/* <Link
                    to="/studentprofile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link> */}
                  <button
                    onClick={() => handleLogout(navigate)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {message && (
            <div className={`max-w-3xl mx-auto mb-4 p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="w-32 h-32 text-gray-400" />
                )}
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                  <FaCamera className="text-white" />
                  <input type="file" className="hidden" onChange={handleProfilePicChange} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Profile Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              {editMode ? (
                <form onSubmit={handleProfileUpdate}>
                  {/* Edit form fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Add form fields for editing */}
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  {/* Add other profile fields */}
                </div>
              )}
            </div>

            {/* Password Change Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaKey className="mr-2" />
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={downloadProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading}
              >
                <FaDownload />
                <span>Download Profile</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffProfile; 