import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'userid', direction: 'ascending' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  // Sorting logic
  const sortUsers = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="container mx-auto p-4 mt-16">
          <h1 className="text-4xl font-bold mb-4 text-white">List of Students</h1>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('userid')}>
                  User ID {sortConfig.key === 'userid' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('name')}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('dob')}>
                  Date of Birth {sortConfig.key === 'dob' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('address')}>
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('phoneno')}>
                  Phone No {sortConfig.key === 'phoneno' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('email')}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('dept')}>
                  Department {sortConfig.key === 'dept' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="border px-4 py-2 cursor-pointer" onClick={() => sortUsers('status')}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.userid}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{new Date(user.dob).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{user.address}</td>
                  <td className="border px-4 py-2">{user.phoneno}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.dept}</td>
                  <td className="border px-4 py-2">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListUsers;
