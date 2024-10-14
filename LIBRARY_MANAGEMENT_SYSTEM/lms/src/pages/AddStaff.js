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
    status: 'active', // Default status is 'active'
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const today = new Date().toISOString().split("T")[0]; // Get today's date

    if (!formData.userid.trim()) {
      newErrors.userid = "User ID is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (formData.dob > today) {
      newErrors.dob = "Date of birth cannot be in the future";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneno.trim()) {
      newErrors.phoneno = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneno)) {
      newErrors.phoneno = "Phone number must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.dept.trim()) {
      newErrors.dept = "Department is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and contain at least one letter and one number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if form is invalid
    }

    try {
      const response = await fetch('http://localhost:5000/api/addstaff', {
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
      } else {
        alert('Error registering staff!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering staff!');
    }
  };

  const handleLogout = () => {
    navigate('/login');
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
      {/* Header with Logout and Back Button */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/manage-users" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Form Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '5rem', // Add padding for header space
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter User ID"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter Name"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Enter Email"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter Phone Number"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter Address"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter Department"
                required
              />
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
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Enter Password"
                required
              />
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
