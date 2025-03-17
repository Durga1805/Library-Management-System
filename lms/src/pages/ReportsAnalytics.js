import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBars, FaDownload, FaChartBar, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ReportsAnalytics = () => {
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
    overdueBooks: 0,
    totalFines: 0
  });
  const [userReports, setUserReports] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [error, setError] = useState(null);
  const [finePayments, setFinePayments] = useState([]);

  useEffect(() => {
    fetchReportData();
    fetchFinePayments();
  }, [selectedDateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching report data...');
      const [statsResponse, reportsResponse] = await Promise.all([
        axiosInstance.get('/api/reports/statistics'),
        axiosInstance.get(`/api/reports/user-activities?range=${selectedDateRange}`)
      ]);
      
      console.log('Statistics response:', statsResponse.data);
      console.log('Reports response:', reportsResponse.data);

      setStatistics(statsResponse.data);
      setUserReports(reportsResponse.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError(error.response?.data?.message || 'Failed to fetch report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFinePayments = async () => {
    try {
      const response = await axiosInstance.get('/api/reports/fine-payments');
      setFinePayments(response.data);
    } catch (error) {
      console.error('Error fetching fine payments:', error);
    }
  };

  const downloadReport = (type) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Library Management System', pageWidth/2, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`${type === 'activity' ? 'User Activity Report' : 
      type === 'overdue' ? 'Overdue Books Report' : 'Fine Payments Report'}`, 
      pageWidth/2, 25, { align: 'center' });
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth/2, 32, { align: 'center' });

    if (type === 'activity') {
      // Prepare user activity data with overdue details
      const data = userReports.map(user => {
        const overdueDetails = user.overdueBooks.map(book => ({
          title: book.title,
          accessionNo: book.accession_no,
          dueDate: new Date(book.dueDate).toLocaleDateString(),
          fine: calculateFine(book.dueDate)
        }));

        return [
          user.name,
          user.dept,
          user.totalBorrowed.toString(),
          user.currentLoans.toString(),
          overdueDetails.length.toString(),
          `₹${overdueDetails.reduce((total, book) => total + book.fine, 0)}`
        ];
      });

      doc.autoTable({
        startY: 40,
        head: [['Name', 'Department', 'Books Borrowed', 'Current Loans', 'Overdue', 'Total Fines']],
        body: data,
        theme: 'grid',
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        }
      });

      // Add overdue details in a separate table
      let yPos = doc.autoTable.previous.finalY + 10;
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text('Overdue Books Details', pageWidth/2, yPos, { align: 'center' });

      const overdueData = userReports.flatMap(user => 
        user.overdueBooks.map(book => [
          user.name,
          book.title,
          book.accession_no.toString(),
          new Date(book.dueDate).toLocaleDateString(),
          `₹${calculateFine(book.dueDate)}`
        ])
      );

      if (overdueData.length > 0) {
        doc.autoTable({
          startY: yPos + 10,
          head: [['User Name', 'Book Title', 'Accession No', 'Due Date', 'Fine Amount']],
          body: overdueData,
          theme: 'grid',
          headStyles: {
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255],
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250]
          }
        });
      }
    } else if (type === 'fines') {
      // Prepare fine payments data
      const data = finePayments.map(payment => [
        payment.userId?.name || 'N/A',
        payment.bookId?.title || payment.bookTitle || 'N/A',
        payment.bookId?.accession_no || 'N/A',
        `₹${payment.amount}`,
        new Date(payment.timestamp).toLocaleDateString(),
        payment.status
      ]);

      doc.autoTable({
        startY: 40,
        head: [['User Name', 'Book Title', 'Accession No', 'Amount', 'Date', 'Status']],
        body: data,
        theme: 'grid',
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        }
      });
    }

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth/2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`library_${type}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Add this helper function for fine calculation
  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(today - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 3; // ₹3 per day
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

          <Link 
            to="/upload-newspaper" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            Upload Newspaper
          </Link>

          <Link 
            to="/manage-book-requests" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Book Requests
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Reports & Analytics" />

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {/* Date Range Selector */}
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <select
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>

              <button
                onClick={fetchReportData}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading report data...</div>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Users:</span>
                        <span className="font-semibold">{statistics.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Books:</span>
                        <span className="font-semibold">{statistics.totalBooks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Loans:</span>
                        <span className="font-semibold">{statistics.activeLoans}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2 text-red-600">
                      <FaExclamationTriangle className="inline mr-2" />
                      Overdue Items
                    </h3>
                    <div className="text-3xl font-bold text-red-600">
                      {statistics.overdueBooks}
                    </div>
                    
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Total Fines</h3>
                    <div className="text-3xl font-bold text-green-600">
                      ₹{statistics.totalFines}
                    </div>
                    <button
                      onClick={() => downloadReport('fines')}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <FaDownload className="inline mr-2" />
                      Download Report
                    </button>
                  </div>
                </div>

                {/* User Activity Table */}
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">User Activity Report</h2>
                    <button
                      onClick={() => downloadReport('activity')}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FaDownload className="mr-2" />
                      Export Report
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Books Borrowed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Loans</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Fines</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userReports.map(user => (
                          <tr key={user._id}>
                            <td className="px-6 py-4">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.userid}</div>
                            </td>
                            <td className="px-6 py-4">{user.dept}</td>
                            <td className="px-6 py-4">{user.totalBorrowed}</td>
                            <td className="px-6 py-4">{user.currentLoans}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                user.overdueBooks.length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.overdueBooks.length}
                              </span>
                            </td>
                            <td className="px-6 py-4">₹{user.totalFines}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fine Payments Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FaMoneyBillWave className="mr-2 text-green-500" />
                      Fine Payments
                    </h3>
                    <button
                      onClick={() => downloadReport('fines')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaDownload className="mr-2" />
                      Export Report
                    </button>
                  </div>
                  
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2">Book</th>
                          <th className="px-4 py-2">User</th>
                          <th className="px-4 py-2">Amount</th>
                          <th className="px-4 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {finePayments.map(payment => (
                          <tr key={payment._id}>
                            <td className="px-4 py-2">{payment.bookId?.title || payment.bookTitle || 'N/A'}</td>
                            <td className="px-4 py-2">{payment.userId?.name || 'N/A'}</td>
                            <td className="px-4 py-2">₹{payment.amount}</td>
                            <td className="px-4 py-2">
                              {new Date(payment.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics; 