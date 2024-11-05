import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddStaff() {
  const [formData, setFormData] = useState({
    userid: '',
    name: '',
    dob: '',
    address: '',
    phoneno: '',
    email: '',
    dept: '',
    status: 'active',
    password: '',
  });

  const [errors, setErrors] = useState({
    userid: '',
    name: '',
    dob: '',
    address: '',
    phoneno: '',
    email: '',
    dept: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'dob':
        const birthYear = new Date(value).getFullYear();
        if (birthYear < 1800 || birthYear > 2009) {
          message = 'Date of Birth must be between 1800 and 2009.';
        }
        break;
      case 'password':
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(value)) {
          message =
            'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.';
        }
        break;
      case 'phoneno':
        const phoneRegex = /^[6789]\d{9}$/;
        if (!phoneRegex.test(value)) {
          message = 'Invalid phone number.';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          message = 'Please enter a valid email address.';
        }
        break;
      default:
        message = '';
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: message,
    }));
  };

  const validateForm = () => {
    const formIsValid = !Object.values(errors).some((error) => error !== '');
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the validation errors.');
      return;
    }

    try {
      const response = await fetch('https://library-management-system-backend-4gdn.onrender.com/api/addstaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Staff registered successfully!');
        setFormData({
          userid: '',
          name: '',
          dob: '',
          address: '',
          phoneno: '',
          email: '',
          dept: '',
          status: 'active',
          password: '',
        });
        setErrors({});
      } else {
        alert('Error registering staff!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering staff!');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/staff-management');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${require('../assets/lms2.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/manage-staffs" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '5rem',
        }}
      >
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Add Staff</h2>
          <form onSubmit={handleSubmit}>
            {/* User ID */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="userid">
                User ID
              </label>
              <input
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                className={`shadow border ${errors.userid ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                placeholder="Enter User ID"
                required
              />
              {errors.userid && <p className="text-red-500 text-xs italic">{errors.userid}</p>}
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`shadow border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                placeholder="Enter Name"
                required
              />
              {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="dob">
                Date of Birth
              </label>
              <input
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`shadow border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="date"
                required
              />
              {errors.dob && <p className="text-red-500 text-xs italic">{errors.dob}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`shadow border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="email"
                placeholder="Enter Email"
                required
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneno">
                Phone Number
              </label>
              <input
                name="phoneno"
                value={formData.phoneno}
                onChange={handleChange}
                className={`shadow border ${errors.phoneno ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                placeholder="Enter Phone Number"
                required
              />
              {errors.phoneno && <p className="text-red-500 text-xs italic">{errors.phoneno}</p>}
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`shadow border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                placeholder="Enter Address"
                required
              />
              {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="dept">
                Department
              </label>
              <input
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                className={`shadow border ${errors.dept ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="text"
                placeholder="Enter Department"
                required
              />
              {errors.dept && <p className="text-red-500 text-xs italic">{errors.dept}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`shadow border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                type="password"
                placeholder="Enter Password"
                required
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Register
              </button>
              <Link
                to="/"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStaff;
