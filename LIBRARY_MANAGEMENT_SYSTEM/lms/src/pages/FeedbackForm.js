import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);          // For storing the final rating
  const [hoverRating, setHoverRating] = useState(0); // For hover effect on stars
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to submit feedback.');
        return;
      }

      // Submit feedback
      await axios.post('/api/feedback', { comment, rating }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Using JWT for authentication
        },
      });

      alert('Feedback submitted successfully! Logging out...');
      
      // Clear session and log out
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    }
  };

  // Function to render star icons for rating
  const Star = ({ starId, rating, onMouseEnter, onMouseLeave, onClick }) => {
    let styleClass = 'fa fa-star';
    if (rating >= starId) {
      styleClass += ' checked'; // Highlight the star if it's active
    }

    return (
      <i
        className={styleClass}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        style={{ color: rating >= starId ? '#ffc107' : '#e4e5e9', cursor: 'pointer', fontSize: '24px' }}
      ></i>
    );
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${require('../assets/about.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md bg-opacity-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Submit Feedback</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="4"
            required
          ></textarea>
        </div>
        
        {/* Star Rating System */}
        <div className="mb-4 text-center">
          <label htmlFor="rating" className="block text-gray-700 mb-2">
            Rating
          </label>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              starId={star}
              rating={hoverRating || rating}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <p className="text-gray-700 mb-4">
          {rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Average' :
           rating === 4 ? 'Good' : 
           rating === 5 ? 'Excellent' : ''}
        </p>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
