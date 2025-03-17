import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBars, FaDownload, FaSearch, FaHistory, FaUser } from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';
import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

const MyHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/books/user-activities/${userId}`);
      console.log('Activities:', response.data); // Debug log
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.bookId?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Library Activity History', 105, 15, { align: 'center' });
    
    // Prepare data for table
    const tableData = filteredActivities.map(activity => [
      new Date(activity.timestamp).toLocaleDateString(),
      activity.type.toUpperCase(),
      activity.bookId?.title || 'N/A',
      activity.fine ? `₹${activity.fine}` : '-'
    ]);

    // Add table
    doc.autoTable({
      startY: 25,
      head: [['Date', 'Type', 'Book Title', 'Fine']],
      body: tableData,
      theme: 'grid'
    });

    // Save PDF
    doc.save('library_history.pdf');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h1 className="text-2xl font-bold text-center mb-6">LMS</h1>
        <nav className="space-y-3">
          <Link to="/userpage" className="flex items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            <FaBook className="mr-2" /> Dashboard
          </Link>
          <Link to="/view-books" className="flex items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            <FaBook className="mr-2" /> View Books
          </Link>
          <Link to="/my-borrowed-books" className="flex items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            <FaHistory className="mr-2" /> My Borrowed Books
          </Link>
          <Link to="/studentprofile" className="flex items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            <FaUser className="mr-2" /> Profile Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="My History" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Activity History</h2>
                <button
                  onClick={generatePDF}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaDownload className="mr-2" />
                  Download Report
                </button>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by book title..."
                    className="w-full p-2 border rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="all">All Activities</option>
                  <option value="issue">Issues</option>
                  <option value="return">Returns</option>
                  <option value="payment">Payments</option>
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredActivities.map((activity, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-sm ${
                              activity.type === 'issue' ? 'bg-blue-100 text-blue-800' :
                              activity.type === 'return' ? 'bg-green-100 text-green-800' :
                              activity.type === 'payment' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {activity.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">{activity.bookId?.title || 'N/A'}</td>
                          <td className="px-6 py-4">
                            {activity.fine ? `₹${activity.fine}` : '-'}
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
    </div>
  );
};

export default MyHistory; 