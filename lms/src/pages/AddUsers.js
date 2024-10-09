import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg'; 

const AddUsers = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle logout logic
  const handleLogout = () => {
    // Clear authentication tokens (if any) and redirect to login
    navigate('/login');
  };

  const handleAddUsers = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'An unknown error occurred.';
        throw new Error(` Duplicate key in data collection`);
      }

      const data = await response.json();
      setMessage('Users successfully added!');
      console.log('Success:', data);
    } catch (error) {
      setMessage(`Error adding users: ${error.message}`);
      // console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className='flex items-center'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            
            <Link to="/manage-users" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
        
      </header>
      {/* Main Content Section */}
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <form
          onSubmit={handleAddUsers}
          className="w-full max-w-xl p-8 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center space-y-6"
        >
          <h2 className="text-2xl font-bold text-blue-700">Student Registration</h2>
          <input
            type="file"
            name="csvFile"
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? 'Loading...' : 'Add Users'}
          </button>
          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
