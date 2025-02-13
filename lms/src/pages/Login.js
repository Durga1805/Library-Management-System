import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { GoogleLogin } from '@react-oauth/google';
import { initSession } from '../utils/sessionManager';

const Login = () => {
  const [emailOrUserid, setEmailOrUserid] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Attempting login for:', emailOrUserid);
      const response = await axiosInstance.post('/api/login', {
        emailOrUserid,
        password
      });

      console.log('Login response:', response.data);

      // Store user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('dept', response.data.dept);

      // Initialize session
      initSession();

      // Handle redirection based on role
      switch(response.data.role) {
        case 'student':
          navigate('/userpage');
          break;
        case 'staff':
          navigate(response.data.dept === 'Library' ? '/libstaffpage' : '/staffpage');
          break;
        case 'admin':
          navigate('/adminpage');
          break;
        default:
          navigate('/');
      }

    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      setMessage(
        error.response?.data?.message || 
        'Unable to connect to server. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <h1 className="text-white text-xl font-bold">Library Management System</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-200 mx-2">Home</Link>
            <Link to="/about" className="text-white hover:text-gray-200 mx-2">About</Link>
          </nav>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen" style={{
        backgroundImage: `url(${require('../assets/lms3.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: '4rem'
      }}>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email / User ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={emailOrUserid}
                onChange={(e) => setEmailOrUserid(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
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

          <div className="text-center mt-4">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
