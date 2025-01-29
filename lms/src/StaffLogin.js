import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { GoogleLogin } from '@react-oauth/google';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use useEffect to prevent back navigation
  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };
    
    // Trigger preventBack on page load
    setTimeout(preventBack, 0);

    // Ensure this logic runs only when the component is mounted
    window.onunload = function () {
      return null;
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (email === "admin@gmail.com" && password === "admin") {
      navigate('/Adminpage');
    }

    try {
      const response = await axios.post('http://localhost:8080/api/staff-login', { email, password });
      if (response.data.success) {
        console.log(res.data);
        const { userId, token, name } = response.data;
         

        // Store user data in localStorage
        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour expiration
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);
        localStorage.setItem('tokenExpiration', expirationTime);

        navigate('/staffpage');
      } else {
        setMessage('Invalid Email or Password');
      }
    } catch (error) {
      setMessage('Error logging in');
      console.error('Login Error:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post('http://localhost:8080/api/googlelogin', { token: response.credential });
      console.log(res);
      if (res.data.status === 1) {
        localStorage.setItem('userId', res.data.data.userId);
        localStorage.setItem('name', res.data.data.name);
        localStorage.setItem('email', res.data.data.email);
        localStorage.setItem('phone', res.data.data.phone);
        localStorage.setItem('address', res.data.data.address);
        
        navigate('/staffpage');
      } else {
        setMessage(res.data.message || 'Google Login Failed');
      }
    } catch (error) {
      setMessage('Google Login Failed');
      console.error('Google Login Error:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <h1 className="text-white text-xl font-bold">Library Management System</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-200 mx-2">Home</Link>
            <Link to="/about" className="text-white hover:text-gray-200 mx-2">About</Link>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${require('../assets/lms3.jpg')})`, // Background image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: '5rem' // Adjust to account for the fixed header
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>
          {message && <p className="text-red-500 text-center mb-4">{message}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <Link to="/forgotpassword" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Google Login */}
          <div className="mt-6 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMessage('Google Login Failed')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
