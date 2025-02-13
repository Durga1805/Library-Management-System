import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBars, FaDownload, FaSearch, FaHistory, FaUser } from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.bookId?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text('My Library History', 105, 15, { align: 'center' });
    
    // Add user info
    const userid = localStorage.getItem('userid');
    const name = localStorage.getItem('name');
    const dept = localStorage.getItem('dept');
    
    doc.setFontSize(12);
    doc.text(`Name: ${name || 'N/A'}`, 15, 25);
    doc.text(`Student ID: ${userid || 'N/A'}`, 15, 30);
    doc.text(`Department: ${dept || 'N/A'}`, 15, 35);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 40);
    
    // Add summary
    const totalIssues = filteredActivities.filter(a => a.type === 'issue').length;
    const totalReturns = filteredActivities.filter(a => a.type === 'return').length;
    const totalFines = filteredActivities.reduce((sum, a) => sum + (a.fine || 0), 0);
    
    doc.text(`Total Books Issued: ${totalIssues}`, 15, 50);
    doc.text(`Total Books Returned: ${totalReturns}`, 15, 55);
    doc.text(`Total Fines Paid: ₹${totalFines}`, 15, 60);
    
    // Prepare table data
    const tableData = filteredActivities.map(activity => [
      new Date(activity.timestamp).toLocaleDateString(),
      activity.type.toUpperCase(),
      activity.bookId?.title || 'N/A',
      activity.bookId?.call_no || 'N/A',
      activity.fine ? `₹${activity.fine}` : '-'
    ]);

    // Add table
    doc.autoTable({
      startY: 70,
      head: [['Date', 'Type', 'Book Title', 'Call No', 'Fine']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] }
    });

    doc.save('my-library-history.pdf');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
        
          {/* View Books */}
          <Link 
            to="/userpage" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Dashboard
          </Link>
          <Link 
            to="/view-books" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            View Books
          </Link>

          {/* My Borrowed Books */}
          <Link 
            to="/my-borrowed-books" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          {/* Profile Settings */}
          <Link 
            to="/studentprofile" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaUser className="mr-2" />
            Profile Settings
          </Link>
          <Link 
            to="/my-history" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My History
          </Link>
          <Link 
            to="/student-newspaper" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            Newspaper
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="My History" />

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center flex-1">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by book title..."
                      className="w-full pl-10 pr-4 py-2 border rounded"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="border rounded px-4 py-2"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Activities</option>
                    <option value="issue">Issues</option>
                    <option value="return">Returns</option>
                    <option value="reserve">Reservations</option>
                  </select>
                  <button
                    onClick={generatePDF}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
                  >
                    <FaDownload /> Download PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Activities List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
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
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">{activity.bookId?.title}</td>
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
  );
};

export default MyHistory; 