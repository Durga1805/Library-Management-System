// import React, { useEffect, useState } from 'react';
// import backgroundImage from '../assets/about.jpg'; // Import your background image

// const FeedbackList = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/feedback'); // Ensure the URL matches your backend route
//         if (!response.ok) {
//           throw new Error('Failed to fetch feedback');
//         }
//         const data = await response.json();
//         setFeedbacks(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeedbacks();
//   }, []);

//   if (loading) return <div>Loading feedback...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div
//       className="min-h-screen p-8 bg-cover bg-center"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//       }}
//     >
//       {/* Header Section */}
//       <header className="h-16 bg-gradient-to-r from-blue-500 to-red-700 flex items-center justify-between px-4">
//         <h1 className="text-white text-2xl font-bold">Feedback & Suggestions</h1>
//       </header>

//       <div className="bg-white p-6 rounded-lg shadow-md mt-8">
//         <h2 className="text-2xl font-semibold mb-4">All Feedback</h2>
//         <ul className="space-y-4">
//           {feedbacks.length > 0 ? (
//             feedbacks.map((feedback) => (
//               <li key={feedback._id} className="p-4 border border-gray-300 rounded-md">
//                 <p className="text-gray-700 mb-2">
//                   <strong>Comment:</strong> {feedback.comment}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Rating:</strong> {feedback.rating} / 5
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Submitted by:</strong> {feedback.username}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Submitted on:</strong> {new Date(feedback.createdAt).toLocaleString()} {/* Format date */}
//                 </p>
//               </li>
//             ))
//           ) : (
//             <li className="p-4 text-gray-700">No feedback available.</li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default FeedbackList;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import backgroundImage from '../assets/about.jpg';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // Example: set the profile picture if needed
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

  const handleBack = () => navigate('/userpage');
  const handleProfileClick = () => setIsDropdownOpen(!isDropdownOpen);
  const handleLogout = () => {
    // Add logout logic
    console.log('Logout clicked');
  };

  if (loading) return <div className="text-center text-lg mt-4">Loading feedback...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-4">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Header Section */}
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="container mx-auto h-full flex items-center px-4 justify-between">
          {/* Back Button */}
          <button onClick={handleBack} className="text-white hover:text-gray-200 mr-4">
            &larr; Back
          </button>
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <div className="relative" id="profileDropdown">
            {/* Profile Picture with Dropdown */}
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul>
                  <li>
                    <Link to="/edit-user-details" className="block px-4 py-2 text-black hover:bg-gray-200">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/view-profile" className="block px-4 py-2 text-white hover:bg-gray-200">
                      View Profile
                    </Link>
                  </li>
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
