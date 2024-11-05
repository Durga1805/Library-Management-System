import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/about.jpg'; // Import your background image

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/feedback'); // Ensure the URL matches your backend route
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

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Header Section */}
      <header className="h-16 bg-gradient-to-r from-blue-500 to-red-700 flex items-center justify-between px-4">
        <h1 className="text-white text-2xl font-bold">Feedback & Suggestions</h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Feedback</h2>
        <ul className="space-y-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <li key={feedback._id} className="p-4 border border-gray-300 rounded-md">
                <p className="text-gray-700 mb-2">
                  <strong>Comment:</strong> {feedback.comment}
                </p>
                <p className="text-gray-600">
                  <strong>Rating:</strong> {feedback.rating} / 5
                </p>
                <p className="text-gray-600">
                  <strong>Submitted by:</strong> {feedback.username}
                </p>
                <p className="text-gray-600">
                  <strong>Submitted on:</strong> {new Date(feedback.createdAt).toLocaleString()} {/* Format date */}
                </p>
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-700">No feedback available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackList;
