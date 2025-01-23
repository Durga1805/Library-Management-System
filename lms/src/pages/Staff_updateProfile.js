import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Staff_updateProfile() {
    const navigate = useNavigate();

  // Profile-related fields
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState(localStorage.getItem('name') || '');
  
  // Optional fields
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(localStorage.getItem('dateOfBirth') || '');
  const [address, setAddress] = useState(localStorage.getItem('address') || '');
  const [userId] = useState(localStorage.getItem('userId') || ''); // Fetch userId from localStorage

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // For header dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle dropdown toggle
  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('token'); // Clear token on logout
    navigate('/');
  };

  // Save updated data to the backend on form submit
  const handleSave = async (e) => {
    e.preventDefault();

    if (!profilePic) {
      alert('Profile picture is mandatory.');
      return;
    }

    if (password && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (password) formData.append('password', password);
    if (profilePic instanceof File) formData.append('profilePic', profilePic);

    setLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        // Update local storage with new data if needed
        localStorage.setItem('name', name);
        localStorage.setItem('phone', phone);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file); // Store file for upload
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
          <Link to="/staffpage" className="text-white hover:text-gray-300">LMS</Link>
          </div>
          <nav className="flex space-x-4 items-center">
            {/* Profile Picture with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)} // Preview image
                  alt="Profile"
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <span className="text-white">P</span>
                </div>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul>
                    <li>
                      <Link
                        to="/edit-staff-details"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/s_view-profile"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

          {loading && <div className="text-center text-blue-500">Updating profile...</div>}
          {errorMessage && <div className="text-center text-red-500">{errorMessage}</div>}

          <form onSubmit={handleSave}>
            {/* Profile Picture (Mandatory) */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                {profilePic ? (
                  <img
                    src={URL.createObjectURL(profilePic)} // Preview image
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-white">P</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  required
                />
              </div>
            </div>

            {/* Name (Mandatory) */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Optional: Phone */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Optional: Email */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
              />
            </div>

            {/* Optional: Password */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your new password"
              />
            </div>

            {/* Optional: Confirm Password */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Confirm your new password"
              />
            </div>

            {/* Optional: Date of Birth */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Optional: Address */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Staff_updateProfile
