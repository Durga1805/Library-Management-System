import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaBars, 
  FaDownload, 
  FaSearch, 
  FaNewspaper, 
  FaEye, 
  FaHistory,
  FaUser 
} from 'react-icons/fa';
import Header from '../components/Header';
import axiosInstance from '../utils/axiosConfig';

const StaffNewspaper = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/newspapers');
      setNewspapers(response.data);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await axiosInstance.get(`/api/newspapers/${id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading newspaper:', error);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/newspapers/${id}`, {
        responseType: 'blob'
      });
      
      // Create blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open PDF in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe src="${url}" style="width:100%; height:100%;" frameborder="0"></iframe>`
        );
      } else {
        // If popup blocked, try direct navigation
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error viewing newspaper:', error);
      alert('Error viewing the newspaper. Please try again.');
    }
  };

  const filteredNewspapers = newspapers.filter(newspaper => {
    const matchesSearch = newspaper.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || newspaper.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
          <Link 
            to="/staffpage" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaBook className="mr-2" />
            Dashboard
          </Link>

          {/* Books Dropdown */}
          <div className="relative">
            <button
              className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              <span className="flex items-center">
                <FaBook className="mr-2" />
                Books
              </span>
              <FaBars />
            </button>
          </div>

          <Link 
            to="/staffprofile" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaUser className="mr-2" />
            Profile Settings
          </Link>

          <Link 
            to="/my-books-details" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            My Borrowed Books
          </Link>

          <Link 
            to="/lending-archives" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaHistory className="mr-2" />
            Lending Archives
          </Link>

          <Link 
            to="/staffnewspaper" 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 flex items-center"
          >
            <FaNewspaper className="mr-2" />
            Newspapers
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title="Newspapers" />

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
                      placeholder="Search newspapers..."
                      className="w-full pl-10 pr-4 py-2 border rounded"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="border rounded px-4 py-2"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Newspapers Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNewspapers.map((newspaper) => (
                  <div key={newspaper._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{newspaper.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {newspaper.language}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {new Date(newspaper.date).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleView(newspaper._id)}
                          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <FaEye className="mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(newspaper._id, newspaper.title)}
                          className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          <FaDownload className="mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffNewspaper;