import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login'); // Redirects to the login page
  };

  return (
    <div>
      {/* Header with Logout */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 border border-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="bg-white bg-opacity-50 p-10 rounded-lg text-left w-1/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-black">LMS</h1>
          </div>
          <h2 className="text-2xl mb-8 text-black">Welcome Admin..!</h2>

          {/* Navigation Menu */}
          <ul>
            <li className="mb-4">
              <Link
                to="/manage-books"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Manage Books
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/manage-users"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Manage Students
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/manage-staffs"
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Manage Staffs
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Manage Periodicals
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Holidays
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Borrowing And Return
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                Visitor Tracking
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to=""
                className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
              >
                FeedBack & Suggestions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
