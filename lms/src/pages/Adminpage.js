import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FaUsers, FaSearch, FaList, FaComments, FaEdit } from "react-icons/fa";


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
          {/* <Link to="/list-feedback" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Feedback</Link> */}
          
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Admin Dashboard" />
        {/* Content Section */}
        <main className="flex-1 flex items-center justify-center">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Users */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link to="/add-users" className="flex flex-col items-center">
              <FaUsers className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold">Add Users</h3>
              <p className="text-gray-600 text-center mt-2">Manually add staff and upload student details via CSV</p>
            </Link>
          </div>

          {/* Search Users */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link to="/searchuser" className="flex flex-col items-center">
              <FaSearch className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Search Users</h3>
              <p className="text-gray-600 text-center mt-2">Find users by name, ID, or department</p>
            </Link>
          </div>

          {/* List Users */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link to="/listuser" className="flex flex-col items-center">
              <FaList className="text-4xl text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold">List Users</h3>
              <p className="text-gray-600 text-center mt-2">View and manage all registered users</p>
            </Link>
          </div>

          {/* Feedback */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link to="/list-feedback" className="flex flex-col items-center">
              <FaComments className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold">Feedback</h3>
              <p className="text-gray-600 text-center mt-2">View submitted feedback and reviews</p>
            </Link>
          </div> */}

         
          
        </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
