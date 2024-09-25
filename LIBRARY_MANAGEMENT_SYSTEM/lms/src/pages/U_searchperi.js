import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function U_searchperi() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login'); // Redirects to home or login page
  };

  return (
    <div>
      {/* Header Section */}
      <header className="bg-blue-500 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/userpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${require('../assets/user.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-gray-200 bg-opacity-90 p-8 rounded-lg shadow-lg w-3/4 max-w-4xl">
          <div className="grid grid-cols-3 text-center font-semibold text-lg">
            <div className="border-r border-black p-4">TITLE</div>
            <div className="border-r border-black p-4">EDITOR</div>
            <div className="p-4">STATUS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default U_searchperi;
