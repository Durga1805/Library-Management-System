import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditUserDetails = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    phone: '',
    email: '',
    password: '',
    profilePic: ''
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedPhone = localStorage.getItem('userPhone');
    const storedProfilePic = localStorage.getItem('profilePic');
    setUserDetails({
      email: storedEmail || '',
      phone: storedPhone || '',
      password: '',
      profilePic: storedProfilePic || ''
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails({
          ...userDetails,
          profilePic: reader.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PNG or JPG image.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userEmail', userDetails.email);
    localStorage.setItem('userPhone', userDetails.phone);
    localStorage.setItem('profilePic', userDetails.profilePic);

    console.log('User details updated:', userDetails);
    navigate('/userpage');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          
          {/* Back Button */}
          <button 
            onClick={handleBack} 
            className="text-white hover:text-gray-200 mr-4"
          >
            &larr; Back
          </button>

          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>

          <nav className="flex space-x-4 items-center">
            
            {/* Profile Picture in Header */}
            {userDetails.profilePic ? (
              <img 
                src={userDetails.profilePic} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white">P</span>
              </div>
            )}

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Form Section */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-20">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Edit User Details</h2>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              value={userDetails.email} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={userDetails.phone} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              value={userDetails.password} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Profile Picture (PNG or JPG)</label>
            <input 
              type="file" 
              name="profilePic" 
              accept="image/png, image/jpeg" 
              onChange={handleImageChange} 
              className="w-full p-2 border rounded-md"
            />
            {userDetails.profilePic && (
              <img 
                src={userDetails.profilePic} 
                alt="Profile Preview" 
                className="mt-4 w-32 h-32 rounded-full object-cover" 
              />
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
