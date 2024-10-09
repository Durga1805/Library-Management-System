import React from 'react'

function Header() {
  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4 items-center">
            {/* Profile Picture in Header */}
            {profilePic ? (
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white">P</span>
              </div>
            )}
            <Link
              to="/edit-user-details" // Route for editing user details
              className="text-white hover:text-gray-200"
            >
              Edit
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header
