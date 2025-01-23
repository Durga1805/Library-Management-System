import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/about.jpg'; // Import your background image

const FeedbackForm = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profilePic = localStorage.getItem('profilePic');
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'User';
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Comment:', comment);
    console.log('Rating:', rating);
    console.log('UserId:', userId);
    console.log('UserName:', name);

    // Validate required fields
    if (!comment || rating === 0 || !userId || !name) {
      setMessage("Please provide a comment, rating, and ensure user information is available.");
      return;
    }

    console.log("Payload:", { comment, rating, userId, name });

    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, rating, userId, name }), // Ensure 'name' and 'userId' are correctly sent
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Feedback submitted successfully');
        setComment('');
        setRating(0);
      } else {
        console.error("Server response error:", data);
        setMessage(data.error || 'Error submitting feedback');
      }
    } catch (error) {
      console.error("Error in submitting feedback:", error);
      setMessage('Error submitting feedback');
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePic');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBack = () => {
    navigate('/userpage');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <button onClick={handleBack} className="text-white hover:text-gray-200 mr-4">
            &larr; Back
          </button>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4 items-center">
            <h6 className="text-white hover:text-gray-200">{name ? name : 'User'}</h6>
            <div className="relative" ref={dropdownRef}>
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <span className="text-white">P</span>
                </div>
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center pt-20 p-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Submit Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Comment:</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Rating:</label>
              <div className="flex space-x-1 text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    onClick={() => handleStarClick(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={index < rating ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.137 6.576a1 1 0 00.95.69h6.905c.969 0 1.371 1.24.588 1.81l-5.457 3.967a1 1 0 00-.364 1.118l2.136 6.576c.3.921-.755 1.688-1.539 1.118l-5.457-3.967a1 1 0 00-1.175 0l-5.457 3.967c-.783.57-1.838-.197-1.539-1.118l2.136-6.576a1 1 0 00-.364-1.118L2.611 11.003c-.783-.57-.38-1.81.588-1.81h6.905a1 1 0 00.95-.69l2.137-6.576z"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit Feedback
            </button>
          </form>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
