import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
  if (email === 'admin@mca.in' && password === 'Admin@2025'){
    navigate('/adminpage');
  }else{
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password });
      console.log(response.data);
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role || 'user'); // Store the role
        // Redirect based on role
        if (response.data.role === 'admin') {
          navigate('/userpage'); // Redirect to Admin Page
        } else {
          navigate('/userpage'); // Redirect to User Page
        }
      } else {
        setMessage(response.data.message || 'Invalid Email or Password');
      }
    } catch (error) {
      setMessage('Invalid Email or Password');
      console.error('Login Error:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }}
  };
  
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    setLoading(true); // Set loading state for Google login
    try {
      const response = await axios.post('http://localhost:8080/api/google-login', {
        tokenId: credential,
      });

      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role || 'user'); // Store the role

        // Redirect based on role
        if (response.data.role === 'admin') {
          navigate('/adminpage'); // Redirect to Admin Page
        } else {
          navigate('/userpage'); // Redirect to User Page
        }
      } else {
        setMessage('Google sign-in failed: ' + (response.data.message || ''));
      }
    } catch (error) {
      setMessage('Google sign-in failed');
      console.error('Google Login Error:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setMessage('Google sign-in failed');
    console.error('Google Login Error:', error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <>
        <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
          <div className='h-full container mx-auto flex items-center px-4 justify-between'>
            <h1 className="text-white text-xl font-bold">Library Management System</h1>
            <nav className="flex space-x-4">
              <Link to="/" className="text-white hover:text-gray-200 mx-2">Home</Link>
              <Link to="/about" className="text-white hover:text-gray-200 mx-2">About</Link>
            </nav>
          </div>
        </header>

        <div 
          className="flex items-center justify-center min-h-screen"
          style={{
            backgroundImage: `url(${require('../assets/lms3.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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

            <div className="mt-4 text-center">
              <Link to="/forgotpassword" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="mt-6">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </div>
          </div>
        </div>
      </>
    </GoogleOAuthProvider>
  );
};

export default Login;
