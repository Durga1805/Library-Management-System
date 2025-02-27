import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaBars, FaDownload, FaChartBar, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';
import * as XLSX from 'xlsx';

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
    const workbook = XLSX.utils.book_new();
    let data, filename;

    if (type === 'activity') {
      data = userReports.map(user => ({
        'User ID': user.userid,
        'Name': user.name,
        'Department': user.dept,
        'Total Books Borrowed': user.totalBorrowed,
        'Current Loans': user.currentLoans,
        'Overdue Books': user.overdueBooks.length,
        'Total Fines': `₹${user.totalFines}`
      }));
      filename = 'user_activity_report';
    } else if (type === 'fines') {
      data = finePayments.map(payment => ({
        'Book': payment.bookId?.title || payment.bookTitle || 'N/A',
        'User': payment.userId?.name || 'N/A',
        'Amount': `₹${payment.amount}`,
        'Payment Method': payment.paymentMethod,
        'Date': new Date(payment.timestamp).toLocaleDateString(),
        'Status': payment.status
      }));
      filename = 'fine_payments_report';
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${filename}_${selectedDateRange}.xlsx`);
  };

  const generateFineReport = () => {
    const workbook = XLSX.utils.book_new();
    
    const fineData = finePayments.map(payment => ({
      'Book Title': payment.bookId?.title || payment.bookTitle || 'N/A',
      'User Name': payment.userId?.name || 'N/A',
      'Amount': `₹${payment.amount}`,
      'Payment Method': payment.paymentMethod,
      'Payment Date': new Date(payment.timestamp).toLocaleDateString(),
      'Status': payment.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(fineData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fine Payments');
    XLSX.writeFile(workbook, 'fine_payments_report.xlsx');
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
                    <button
                      onClick={() => downloadReport('overdue')}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaDownload className="inline mr-2" />
                      Download Report
                    </button>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <FaDownload className="inline mr-2" />
                      Download Report
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
                      onClick={generateFineReport}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Export
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