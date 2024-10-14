import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg'; // Add the background image import

const ListStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show when data is being fetched
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch staff list on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/liststaff');
        const data = await response.json();
        setStaffList(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching staff list'); // Set error if any issue occurs
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchStaff();
  }, []);

  // Handle logout logic
  const handleLogout = () => {
    navigate('/login');
  };

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
                  <th className="py-2 px-4 border-b">Staff ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Department</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((staff) => (
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
