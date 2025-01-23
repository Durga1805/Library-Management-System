import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const ListStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'userid', direction: 'ascending' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/liststaff');
        const data = await response.json();
        setStaffList(data);
      } catch (error) {
        setError('Error fetching staff list');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  // Sorting logic
  const sortStaff = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStaffList = [...staffList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

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
      <main
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-red-700 mb-6">Staff List</h1>

          {/* Loading Spinner */}
          {loading && <p>Loading staff list...</p>}

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Staff Table */}
          {!loading && !error && (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortStaff('userid')}>
                    Staff ID {sortConfig.key === 'userid' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortStaff('name')}>
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortStaff('email')}>
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortStaff('dept')}>
                    Department {sortConfig.key === 'dept' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer" onClick={() => sortStaff('status')}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStaffList.length > 0 ? (
                  sortedStaffList.map((staff) => (
                    <tr key={staff._id}>
                      <td className="py-2 px-4 border-b">{staff.userid}</td>
                      <td className="py-2 px-4 border-b">{staff.name}</td>
                      <td className="py-2 px-4 border-b">{staff.email}</td>
                      <td className="py-2 px-4 border-b">{staff.phoneno}</td>
                      <td className="py-2 px-4 border-b">{staff.dept}</td>
                      <td className="py-2 px-4 border-b">{staff.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No staff found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListStaff;
