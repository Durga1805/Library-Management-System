import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import backgroundImage from '../assets/about.jpg';
import { FaBars } from 'react-icons/fa';
import Header from '../components/Header';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false); // For dropdown
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchFeedbacks = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/api/feedback');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch feedback');
  //       }
  //       const data = await response.json();
  //       setFeedbacks(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFeedbacks();
  // }, []);

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  // if (loading) return <div className="text-center text-lg mt-4">Loading feedback...</div>;
  // if (error) return <div className="text-center text-lg text-red-500 mt-4">Error: {error}</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar Section */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
        <Link to="/adminpage" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Dashboard</Link>
          <Link to="/add-users" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Add Users</Link>
          <Link to="/searchuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Search Users</Link>
          <Link to="/listuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">List Users</Link>
          <Link to="/list-feedback" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Feedback </Link>
        </nav>
      </aside>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex-1 flex flex-col">
  <Header title="Feedback" />

        {/* Main Content */}
        <div className="container mx-auto pt-24 px-4">
          <h1 className="text-3xl text-white font-bold mb-6 text-center"></h1>

          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md max-h-[60vh] overflow-y-auto">
            {feedbacks.map((feedback, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                <p className="font-semibold text-gray-800">{feedback.user}</p>
                <p className="text-gray-600">{feedback.comment}</p>
                <p className="mt-2"><strong>Rating:</strong> {feedback.rating} / 5</p>
                <p className="text-gray-600">
                  <strong>Submitted on:</strong> {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FeedbackList;
