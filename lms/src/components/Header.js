import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ name = 'User' }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const profilePic = ''; // Replace with dynamic logic if needed.

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); // Redirect to login page
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-bold">LMS</h1>
        </div>
        <nav className="flex space-x-4 items-center">
          <h6 className="text-white hover:text-gray-200">{name}</h6>
          <div className="relative" ref={dropdownRef}>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <span className="text-white">P</span>
              </div>
            )}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
