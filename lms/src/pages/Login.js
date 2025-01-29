// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';


// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
  
// <script type="text/javascript">
//   function preventBack() {
//       window.history.forward()
//   }
//   setTimeout("preventBack()", 0);
//   window.onunload = function () { null };
// </script>


//   // Function for email-password based login (for user login only)
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);  // Show loading during request
  
//     try {
//       const response = await axios.post('http://localhost:8080/api/login', { email, password });
//       if (response.data.success) {
//         // Store user details in localStorage
//         localStorage.setItem('userId', response.data.userId);
//         localStorage.setItem('name', response.data.name);
//         localStorage.setItem('email', response.data.email);
//         localStorage.setItem('phone', response.data.phone);
//         localStorage.setItem('address', response.data.address);
        
//         // Navigate to user page after successful login
//         navigate('/userpage');
//       } else {
//         setMessage(response.data.message || 'Invalid Email or Password');
//       }
//     } catch (error) {
//       setMessage('Invalid Email or Password');
//       console.error('Login Error:', error.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);  // Hide loading after request
//     }
//   };
  
//   const handleGoogleLogin = async (response) => {
//     try {
//       const res = await axios.post('http://localhost:8080/api/google-login', { token: response.credential });
//       console.log(res);
//       if (res.data.success) {
//         localStorage.setItem('userId', res.data.userId);
//         localStorage.setItem('name', res.data.name);
//         localStorage.setItem('email', res.data.email);
//         localStorage.setItem('phone', res.data.phone);
//         localStorage.setItem('address', res.data.address);
        
//         // Navigate to user page after successful login
//         navigate('/userpage');
//       } else {
//         setMessage(res.data.message || 'Google Login Failed');
//       }
//     } catch (error) {
//       setMessage('Google Login Failed');
//       console.error('Google Login Error:', error);
//     }
//   };
  

//   return (
//   <div>
//       <>
//         {/* Header */}
//         <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
//           <div className='h-full container mx-auto flex items-center px-4 justify-between'>
//             <h1 className="text-white text-xl font-bold">Library Management System</h1>
//             <nav className="flex space-x-4">
//               <Link to="/" className="text-white hover:text-gray-200 mx-2">Home</Link>
//               <Link to="/about" className="text-white hover:text-gray-200 mx-2">About</Link>
//             </nav>
//           </div>
//         </header>

//         {/* Login Form */}
//         <div 
//           className="flex items-center justify-center min-h-screen"
//           style={{
//             backgroundImage: `url(${require('../assets/lms3.jpg')})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             paddingTop: '4rem'
//           }}
//         >
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>
//             {message && <p className="text-red-500 text-center mb-4">{message}</p>}
            
//             <form onSubmit={handleLogin}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//                 <input 
//                   type="email" 
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
//                   value={email} 
//                   onChange={(e) => setEmail(e.target.value)} 
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//                 <input 
//                   type="password" 
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
//                   value={password} 
//                   onChange={(e) => setPassword(e.target.value)} 
//                   required
//                 />
//               </div>
//               <button 
//                 type="submit" 
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//                 disabled={loading}
//               >
//                 {loading ? 'Logging in...' : 'Login'}
//               </button>
//             </form>

//             {/* Forgot Password */}
//           <div className="text-center mt-4">
//             <Link to="/forgotpassword" className="text-sm text-blue-500 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>

//           <div className="mt-6 text-center">
//               <GoogleLogin 
//                 onSuccess={handleGoogleLogin}
//                 onError={() => setMessage('Google Login Failed')}
//               />
//             </div>

            
//           </div>
//         </div>
//       </>
//       </div>
//   );
// };

// export default Login;


// lms\src\pages\Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function for email-password based login (for user login only)
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);  // Show loading during request
  
    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('phone', response.data.phone);
        localStorage.setItem('address', response.data.address);
        
        navigate('/userpage');
      } else {
        setMessage(response.data.message || 'Invalid Email or Password');
      }
    } catch (error) {
      setMessage('Invalid Email or Password');
      console.error('Login Error:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);  // Hide loading after request
    }
  };
  
  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post('http://localhost:8080/api/google-login', { token: response.credential });
      console.log(res);
      if (res.data.status === 1) {
        localStorage.setItem('userId', res.data.data.userId);
        localStorage.setItem('name', res.data.data.name);
        localStorage.setItem('email', res.data.data.email);
        localStorage.setItem('phone', res.data.data.phone);
        localStorage.setItem('address', res.data.data.address);
        
        navigate('/userpage');
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
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
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
          {message && <p className="text-red-500 text-center mb-4">{message}</p>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input type="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setMessage('Google Login Failed')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
