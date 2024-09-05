import React from 'react';
import { Link } from 'react-router-dom';

const A_ManageBooks = () => {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage: "url(https://uslicenses.com/wp-content/uploads/2016/11/AdobeStock_61299108.jpeg)", // Replace with the actual image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-700 mb-8">LMS</h1>
        <div className="flex justify-center space-x-8">
          <Link 
            to="/add-books"
            className="text-lg text-black font-semibold py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ADD
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
        </div>
      </div>
    </div>
  );
};

export default A_ManageBooks;
