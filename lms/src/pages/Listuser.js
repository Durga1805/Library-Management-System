import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { FaBars, FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';
import Header from '../components/Header';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    dept: 'all',
    status: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users/all');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    }
  };

  useEffect(() => {
    // Apply filters
    let result = users;
    
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }
    if (filters.dept !== 'all') {
      result = result.filter(user => user.dept === filters.dept);
    }
    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }
    
    setFilteredUsers(result);
  }, [filters, users]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const downloadUserData = (role) => {
    // Filter users by role
    const usersToDownload = filteredUsers.filter(user => user.role === role);
    
    // Prepare data for CSV
    const csvData = usersToDownload.map(user => ({
      Name: user.name,
      Email: user.email,
      'User ID': user.userid,
      Department: user.dept,
      'Phone Number': user.phoneno,
      Address: user.address,
      Status: user.status,
      ...(role === 'student' && {
        Semester: user.semester,
        'Start Date': new Date(user.startDate).toLocaleDateString(),
        'End Date': new Date(user.endDate).toLocaleDateString()
      })
    }));

    // Convert to CSV
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${role}_list.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axiosInstance.put(`/api/users/${userId}/status`, {
        status: newStatus
      });
      
      // Update the local state
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      }));
      
      // Update filtered users as well
      setFilteredUsers(filteredUsers.map(user => {
        if (user._id === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      }));

    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status');
    }
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
        <Header title="User Detials" />

        {/* Content Section */}
        <div className="container mx-auto pt-24 pb-24 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">User List</h2>

          {/* Filters and Download Buttons */}
          <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="staff">Staff</option>
              </select>

              <select
                name="dept"
                value={filters.dept}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="MCA">MCA</option>
                <option value="IT">IT</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Library">Library</option>
              </select>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>

              <button
                onClick={() => downloadUserData('student')}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <FaDownload /> Download Students List
              </button>

              <button
                onClick={() => downloadUserData('staff')}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FaDownload /> Download Staff List
              </button>
            </div>

            {/* Users Table */}
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
                    <th className="px-4 py-2">Phone</th>
                    {filters.role === 'student' && (
                      <>
                        <th className="px-4 py-2">Semester</th>
                        <th className="px-4 py-2">Start Date</th>
                        <th className="px-4 py-2">End Date</th>
                      </>
                    )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
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
                        <button
                          onClick={() => handleStatusChange(
                            user._id, 
                            user.status === 'Active' ? 'Deactive' : 'Active'
                          )}
                          className={`ml-2 px-2 py-1 rounded text-sm ${
                            user.status === 'Active' 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                      <td className="px-4 py-2">{user.phoneno}</td>
                      {user.role === 'student' && (
                        <>
                          <td className="px-4 py-2">{user.semester}</td>
                          <td className="px-4 py-2">{new Date(user.startDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{new Date(user.endDate).toLocaleDateString()}</td>
                        </>
                      )}
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ListUser;