import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/lms2.jpg'; // Adjust the import path as needed

const A_SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('userid'); // Default search type
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get(`http://localhost:8080/api/users/search?${searchType}=${searchTerm}`);
      if (response.data.length > 0) {
        setUsers(response.data);
      } else {
        setUsers([]);
        setMessage('No users found with the provided search term.');
      }
    } catch (error) {
      console.error('Search Error:', error);
      setMessage('Error occurred while searching for users.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Deactive' : 'Active';
      await axios.put(`http://localhost:8080/api/users/${userId}/status`, { status: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      setMessage('Error updating user status.');
    }
  };

  return (
    <div>
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto p-8 bg-white bg-opacity-80 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Search Users</h2>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center">
              <select
                className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="userid">User ID</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>

              <input
                type="text"
                className="ml-4 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder={`Enter ${searchType}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />

              <button
                type="submit"
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {message && <p className="text-red-500 text-center mb-4">{message}</p>}

          {users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">User ID</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">DOB</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Address</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Phone No</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Dept</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="py-2 px-4 border-b text-sm">{user.userid}</td>
                      <td className="py-2 px-4 border-b text-sm">{user.name}</td>
                      <td className="py-2 px-4 border-b text-sm">{user.email}</td>
                      <td className="py-2 px-4 border-b text-sm">{new Date(user.dob).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b text-sm">{user.address}</td>
                      <td className="py-2 px-4 border-b text-sm">{user.phoneno}</td>
                      <td className="py-2 px-4 border-b text-sm">{user.dept}</td>
                      <td className="py-2 px-4 border-b text-sm">{user.status}</td>
                      <td className="py-2 px-4 border-b text-sm">
                        <button
                          className={`${
                            user.status === 'Active' ? 'bg-red-500' : 'bg-green-500'
                          } text-white px-4 py-2 rounded-lg`}
                          onClick={() => toggleStatus(user._id, user.status)}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default A_SearchUsers;
