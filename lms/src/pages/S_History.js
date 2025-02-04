import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const S_History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'Staff';
  const profilePic = localStorage.getItem('profilePic');

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/books/history`, {
        params: { userId }
      });
      
      // Group books by title to avoid repetition
      const groupedBooks = response.data.reduce((acc, item) => {
        if (!acc[item.title]) {
          acc[item.title] = {
            title: item.title,
            author: item.author,
            accno: item.accno,
            date: item.date,
            dueDate: item.dueDate,
            fine: item.fine,
            issuedAt: item.issuedAt
          };
        }
        return acc;
      }, {});

      // Convert grouped books back to array
      const uniqueBooks = Object.values(groupedBooks);
      setHistory(uniqueBooks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load history');
      setLoading(false);
    }
  };

  const sortHistory = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedHistory = [...history].sort((a, b) => {
      if (key === 'title') {
        return direction === 'ascending'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    setHistory(sortedHistory);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <div>
            <h6 className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/staffpage')}>
              Back
            </h6>
          </div>
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4 items-center">
            <h6 className="text-white hover:text-gray-200">{name}</h6>
            <div className="relative">
              <button className="flex items-center space-x-2 text-white">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    {name.charAt(0)}
                  </div>
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto pt-20 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Book History</h1>
        
        {history.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th 
                    className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                    onClick={() => sortHistory('title')}
                  >
                    Book Title {getSortIndicator('title')}
                  </th>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Accession No.</th>
                  <th 
                    className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                    onClick={() => sortHistory('date')}
                  >
                    Issue Date {getSortIndicator('date')}
                  </th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Fine</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-800">
                {history.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.author}</td>
                    <td className="px-4 py-2">{item.accno}</td>
                    <td className="px-4 py-2">
                      {item.issuedAt ? new Date(item.issuedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="px-4 py-2">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-4 py-2">
                      {item.fine ? `₹${item.fine}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center bg-white bg-opacity-90 rounded-lg p-6">
            <p className="text-gray-800">No book history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default S_History;
