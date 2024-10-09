import React from 'react';
import { Link } from 'react-router-dom';

const StaffPage = () => {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage:  `url(${require('../assets/Staff.jpg')})`,
      }}
    >
      <div className="bg-white bg-opacity-50 p-10 rounded-lg text-left">
        <h1 className="text-4xl font-bold mb-6 text-black">LMS</h1>
        <h2 className="text-2xl mb-8 text-black">Welcome User!!</h2>
        <ul>
          <li className="mb-4">
            <Link 
              to="/userch"
              className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
            >
              Search Books
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/issued-books"
              className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
            >
              Issued Book
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/feedback"
              className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
            >
              Feedback
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              to="/history"
              className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 block"
            >
              History
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StaffPage;
