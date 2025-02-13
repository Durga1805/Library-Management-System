import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaEye } from "react-icons/fa";
import axiosInstance from '../utils/axiosConfig';

const NewspaperPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [newspapers, setNewspapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewspapers();
  }, []);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/newspapers");
      setNewspapers(response.data);
    } catch (error) {
      console.error("Error fetching newspapers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/newspapers/${id}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error viewing newspaper:", error);
    }
  };

  // Filter newspapers based on search, language, and date selection
  const filteredNewspapers = newspapers.filter((newspaper) => {
    const matchesSearch = newspaper.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === "all" || newspaper.language === selectedLanguage;
    const matchesDate = !selectedDate || new Date(newspaper.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString();
    return matchesSearch && matchesLanguage && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-red-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">LMS</Link>
          <Link 
            to="/login" 
            className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
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
            <input
              type="date"
              className="border rounded px-4 py-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
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
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleView(newspaper._id)}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FaEye className="mr-2" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewspaperPage;
