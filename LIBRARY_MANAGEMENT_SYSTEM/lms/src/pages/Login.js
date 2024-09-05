import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Regular expression for password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, include at least one capital letter, one special character, and one number.');
      return;
    }

    // Example credentials check for admin
    if (username === 'admin@mca.in' && password === 'Admin@2025') {
      // Navigate to AdminPage
      navigate('/Adminpage');
    } else {
      // Navigate to UserPage
      navigate('/userpage');
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${require('../assets/lms3.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Display error message if validation fails */}
        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>

        <Link to="forgot-password">
          <p className="text-sm text-gray-600 hover:text-gray-800 transition duration-200 mt-4">Forgot your password?</p>
        </Link>
      </form>
    </div>
  );
};

export default Login;
