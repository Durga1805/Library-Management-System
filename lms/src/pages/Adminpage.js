import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AdminPage = () => {
  const navigate = useNavigate();


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
          <Link to="/add-users" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Add Users</Link>
          <Link to="/searchuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Search Users</Link>
          <Link to="/listuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">List Users</Link>
          <Link to="/list-feedback" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Feedback</Link>
          <Link to="/feedback" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Generate Feedback</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Admin Dashboard" />
        {/* Content Section */}
        <main className="flex-1 flex items-center justify-center">
          <h2 className="text-3xl font-semibold text-gray-700">Welcome to Admin Dashboard</h2>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
