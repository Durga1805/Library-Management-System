


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import backgroundImage from '../assets/about.jpg';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Example: set the profile picture if needed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/feedback');
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  
  const handleLogout = () => {
    // Add logout logic
    console.log('Logout clicked');
  };

  if (loading) return <div className="text-center text-lg mt-4">Loading feedback...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-4">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl  text-white  font-bold  mb-6 text-center">Feedback and Suggestions</h1>
        
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md max-h-[60vh] overflow-y-auto">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">{feedback.user}</p>
              <p className="text-gray-600">{feedback.comment}</p>
              <p className="mt-2"><strong>Rating:</strong> {feedback.rating} / 5</p>
              <p className="text-gray-600">
                 <strong>Submitted on:</strong> {new Date(feedback.createdAt).toLocaleString()} {/* Format date */}
                 </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
