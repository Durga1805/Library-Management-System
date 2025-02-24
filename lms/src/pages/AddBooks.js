import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import { FaBars, FaBook, FaUsers, FaUserCircle } from 'react-icons/fa';
import Header from '../components/Header';

const AddBooks = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  
  const downloadTemplate = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/books/csv-template');
      const { headers, sampleRow, validDepartments } = response.data;
      
      // Add comment row explaining valid departments
      const commentRow = {
        title: '# Valid departments: ' + validDepartments.join(', '),
        author: '',
        publisher: '',
        isbn: '',
        year_of_publication: '',
        no_of_pages: '',
        price: '',
        dept: '',
        cover_type: '',
        copies: ''
      };
      
      const csv = Papa.unparse({
        fields: headers,
        data: [
          Object.values(commentRow),
          Object.values(sampleRow)
        ]
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'books_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      setMessage('Error downloading template');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setMessage('Please upload a CSV file');
        return;
      }
      setFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const books = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('Parsed CSV data:', results.data); // Debug log
            resolve(results.data);
          },
          error: (error) => reject(error)
        });
      });

      if (!books || books.length === 0) {
        setMessage('No valid data found in CSV file');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/books/upload', { books });
      console.log('Upload response:', response.data);
      
      setMessage(`Successfully added ${response.data.books.length} books`);
      if (response.data.errors) {
        const errorMessages = response.data.errors.join('\n');
        setMessage(prev => `${prev}\n\nWarnings:\n${errorMessages}`);
      }
      
      // Clear the file input
      setFile(null);
      event.target.reset();
    } catch (error) {
      console.error('Error uploading books:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.response?.data?.details || 
                          'Error uploading books';
      setMessage(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
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
        {/* Header */}
        <Header title="Add Books" />

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add Books via CSV</h2>
            
            {message && (
              <div className={`p-4 mb-4 rounded whitespace-pre-line ${
                message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="mb-6">
              <button
                onClick={downloadTemplate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download CSV Template
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
                disabled={!file || loading}
              >
                {loading ? 'Uploading...' : 'Upload Books'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddBooks; 