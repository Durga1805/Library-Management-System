import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg'; 

const A_ManageUser = () => {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center" 
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-700 mb-8">LMS</h1>
        <div className="flex justify-center space-x-8">
          <Link 
            to="/add-users"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
          Students
          </Link>
          <Link 
            to="/add-staff"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
          Staff
          </Link>
          <Link 
            to="/update"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            UPDATE
          </Link>
          <Link 
            to="/search"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            SEARCH
          </Link>
          <Link 
            to="/list"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            LIST
          </Link>
          <Link 
            to="/back"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            BACK
          </Link>
        </div>
      </div>
    </div>
  );
};

export default A_ManageUser;
