import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const A_ManageStaffs = () => {
  const navigate = useNavigate();

  
<script type="text/javascript">
  function preventBack() {
      window.history.forward()
  }
  setTimeout("preventBack()", 0);
  window.onunload = function () { null };
</script>

  // Handle logout logic here
  const handleLogout = () => {
    // Clear authentication tokens (if any) and redirect to login
    navigate('/');
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center'>
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <main 
        className="flex items-center justify-center min-h-screen bg-cover bg-center" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center bg-white bg-opacity-80 p-12 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold text-red-700 mb-8">Staff Details</h1>
          <div className="flex flex-col items-center space-y-4">
            <Link 
              to="/addstaff"
              className="text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300 w-full text-center"
            >
              Staff
            </Link>
            
            {/* Updated the Search button to link to the SearchUser page */}
            <Link 
              to="/searchstaff"  // Adjust the path according to your routing setup
              className="text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300 w-full text-center"
            >
              SEARCH
            </Link>
            
            <Link 
              to="/liststaff"
              className="text-lg text-black font-semibold py-3 px-6 bg-gray-200 rounded-md hover:bg-gray-300 w-full text-center"
            >
              LIST
            </Link>
          
          </div>
        </div>
      </main>
    </div>
  );
};

export default A_ManageStaffs;
