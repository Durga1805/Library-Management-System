import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaBook, FaUsers, FaUserCircle, FaSearch, FaChevronDown, FaChevronUp, FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';
import Header from '../components/Header';

const SearchAndListUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users/all');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = users.filter(user => {
      const matchesQuery = 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.userid.toLowerCase().includes(query) ||
        user.phoneno.includes(query);
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesDept = filters.dept === 'all' || user.dept === filters.dept;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      return matchesQuery && matchesRole && matchesDept && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    const filtered = users.filter(user => {
      const matchesQuery = 
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.userid.toLowerCase().includes(searchQuery) ||
        user.phoneno.includes(searchQuery);
      const matchesRole = (name === 'role' ? value : filters.role) === 'all' || 
                         user.role.toLowerCase() === (name === 'role' ? value : filters.role);
      const matchesDept = (name === 'dept' ? value : filters.dept) === 'all' || 
                         user.dept === (name === 'dept' ? value : filters.dept);
      
      return matchesQuery && matchesRole && matchesDept;
    });
    
    setFilteredUsers(filtered);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleDownload = () => {
    const dataToDownload = users.filter(user => {
      const matchesRole = filters.role === 'all' || user.role.toLowerCase() === filters.role;
      const matchesDept = filters.dept === 'all' || user.dept === filters.dept;
      return matchesRole && matchesDept;
    });

    const csvData = dataToDownload.map(user => ({
      'User ID': user.userid,
      'Name': user.name,
      'Email': user.email,
      'Phone': user.phoneno,
      'Role': user.role,
      'Department': user.dept,
      'Status': user.status
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${filters.dept}_${filters.role}_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
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
              {isBooksDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isBooksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/addbooks" className="block px-4 py-2 hover:bg-gray-600">Add Books</Link>
                <Link to="/search-list-books" className="block px-4 py-2 hover:bg-gray-600">Search & List Books</Link>
              </div>
            )}
          </div>

          {/* Manage Users Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between w-full"
              onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
            >
              <span className="flex items-center">
                <FaUsers className="mr-2" />
                Manage Users
              </span>
              {isUsersDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isUsersDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                <Link to="/search-list-users" className="block px-4 py-2 hover:bg-gray-600">View Users</Link>
                <Link to="/user-history" className="block px-4 py-2 hover:bg-gray-600">User History</Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Search & List Users" />

        {/* Search and Filters */}
        <div className="p-4 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name, email, ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="libstaff">Library Staff</option>
            </select>
            <select
              name="dept"
              value={filters.dept}
              onChange={handleFilterChange}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="MCA">MCA</option>
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 p-4 overflow-auto">
          {message && (
            <div className="max-w-7xl mx-auto mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
              {message}
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4">No users found</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.userid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.dept}
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
    </div>
  );
};

export default SearchAndListUsers; 