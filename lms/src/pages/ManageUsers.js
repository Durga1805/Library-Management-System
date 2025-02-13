import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaSearch, FaUser, FaBook,FaBars } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';
import * as XLSX from 'xlsx';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users/all');
      // Filter out admin users
      const filteredUsers = response.data.filter(user => user.role !== 'admin');
      setUsers(filteredUsers);
      
      // Extract unique departments
      const depts = [...new Set(filteredUsers.map(user => user.dept))].filter(Boolean);
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}/activities`);
      setUserActivities(response.data);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    await fetchUserActivities(user._id);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.userid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || user.dept === selectedDept;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesDept && matchesRole;
  });

  const downloadUsersList = () => {
    const filteredData = filteredUsers.map(user => ({
      'User ID': user.userid,
      'Name': user.name,
      'Email': user.email,
      'Department': user.dept,
      'Role': user.role,
      'Phone': user.phoneno
    }));

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, `users_${selectedDept}_${selectedRole}.xlsx`);
  };

  const downloadUserActivities = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text('User Library Activities Report', 105, 15, { align: 'center' });
    
    // Add user info
    doc.setFontSize(12);
    if (selectedUser) {
      doc.text(`Name: ${selectedUser.name}`, 15, 25);
      doc.text(`User ID: ${selectedUser.userid}`, 15, 30);
      doc.text(`Department: ${selectedUser.dept}`, 15, 35);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 40);
    }
    
    // Prepare table data
    const tableData = userActivities.map(activity => [
      new Date(activity.timestamp).toLocaleDateString(),
      activity.type.toUpperCase(),
      activity.book?.title || 'Book Removed',
      activity.fine ? `₹${activity.fine}` : '-'
    ]);

    // Add table
    doc.autoTable({
      startY: 45,
      head: [['Date', 'Type', 'Book Title', 'Fine']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] }
    });

    // Save the PDF
    doc.save(`${selectedUser.name}-library-activities.pdf`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>

        <Link 
          to="/libstaffpage" 
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
        >
          Dashboard
        </Link>
        <nav className="flex flex-col space-y-3">
          {/* Manage Books Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between w-full"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Manage Books
              </span>
              <FaBars />
            </button>
            {isBooksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/addbooks" className="block px-4 py-2 hover:bg-gray-600">Add Books</Link>
                <Link to="/search-list-books" className="block px-4 py-2 hover:bg-gray-600">Search & List Books</Link>
                <Link to="/issue-books" className="block px-4 py-2 hover:bg-gray-600">Issue Books</Link>
                
              </div>
            )}
          </div>

          {/* Manage Users Dropdown */}
          <Link 
            to="/users" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Manage Users
          </Link>

          {/* Reports & Analytics */}
          <Link 
            to="/reports" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Reports & Analytics
          </Link>

          {/* Profile Settings */}
          <Link 
            to="/profile" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Profile Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="User Details" />

        {/* Main Content Area with proper spacing and scrolling */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center flex-1">
                  <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="libstaff">Library Staff</option>
                  </select>
                </div>

                <button
                  onClick={downloadUsersList}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Download List
                </button>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Users List */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Users</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user._id}
                        onClick={() => handleUserClick(user)}
                        className={`p-3 rounded-md cursor-pointer transition-colors border ${
                          selectedUser?._id === user._id 
                            ? 'bg-blue-50 border-blue-500' 
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.userid}</div>
                        <div className="text-sm text-gray-500">{user.dept}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Details and Activities */}
              <div className="md:col-span-2 space-y-6">
                {selectedUser ? (
                  <>
                    {/* User Details Card */}
                    <div className="bg-white rounded-lg shadow-md">
                      <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold">User Details</h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{selectedUser.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">User ID</p>
                            <p className="font-medium">{selectedUser.userid}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{selectedUser.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Department</p>
                            <p className="font-medium">{selectedUser.dept}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Role</p>
                            <p className="font-medium capitalize">{selectedUser.role}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium">{selectedUser.phoneno}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Activities Card */}
                    <div className="bg-white rounded-lg shadow-md">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Library Activities</h2>
                        {userActivities.length > 0 && (
                          <button
                            onClick={downloadUserActivities}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
                          >
                            <FaDownload /> Download Report
                          </button>
                        )}
                      </div>
                      <div className="p-4">
                        {userActivities.length > 0 ? (
                          <div className="space-y-4">
                            {userActivities.map((activity, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div>
                                  <div className="font-medium">
                                    {activity.book?.title || 'Book Removed'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}ed on{' '}
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-sm ${
                                  activity.type === 'issue' ? 'bg-blue-100 text-blue-800' :
                                  activity.type === 'return' ? 'bg-green-100 text-green-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {activity.type}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center">No library activities found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-48">
                    <p className="text-gray-500">Select a user to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers; 