import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { FaBars } from 'react-icons/fa';
import Header from '../components/Header';

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/search`, {
        params: {
          query: searchQuery,
          role: selectedRole
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Error searching users');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
        <Link to="/adminpage" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Dashboard</Link>
          <Link to="/add-users" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Add Users</Link>
          <Link to="/searchuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Search Users</Link>
          <Link to="/listuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">List Users</Link>
          <Link to="/list-feedback" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Feedback</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Header */}
        <div className="flex-1 flex flex-col">
  <Header title="Find User" />

        {/* Content Section */}
        <div className="container mx-auto pt-24 pb-24 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Search Users</h2>

          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by name, email, or user ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="staff">Staff</option>
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>

            {/* Results Table */}
            {searchResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">User ID</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Department</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((user) => (
                      <tr key={user._id} className="border-t">
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.userid}</td>
                        <td className="px-4 py-2 capitalize">{user.role}</td>
                        <td className="px-4 py-2">{user.dept}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : searchQuery && (
              <p className="text-center text-gray-500">No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SearchUser; 