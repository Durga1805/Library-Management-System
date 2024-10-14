import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg'; // Adjust the path accordingly

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Added navigate hook for logout

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    navigate('/login'); // Redirects to the login page
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
                <th className="border px-4 py-2">User ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Date of Birth</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Phone No</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
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
