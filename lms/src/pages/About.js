import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Navigates to the login page
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-30'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/login" className="text-white hover:text-gray-200 mx-2">Back to Login</Link>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `url(${require('../assets/about.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white bg-opacity-80 p-6 max-w-4xl rounded-lg shadow-md w-full mx-4 mt-16">
          <h1 className="text-3xl font-bold mb-4">About the Library Management System</h1>
          <p className="mb-4">
            The Library Management System (LMS) is designed to streamline library operations, making it easier for libraries to manage their collections and provide better services to users. But beyond that, the importance of libraries and reading goes far beyond just managing books.
          </p>
          <p>
            The Library Management System (LMS) not only improves operational efficiency for librarians but also enhances the overall user experience. It helps foster a reading culture and ensures that users have easy access to both physical and digital resources.
          </p>

          {/* Importance of Libraries and Reading Books*/}
          <h2 className="text-2xl font-semibold mt-6 mb-2">The Importance of Libraries and Reading Books</h2>
          <p className="mb-4">
            Libraries are more than just collections of books; they are spaces for learning, community engagement, and fostering a love for knowledge. They provide free access to information and resources that people might not otherwise have, promoting equality in education. Whether it's through books, digital media, or community programs, libraries play a key role in intellectual and cultural development.
            Reading is essential for personal and intellectual growth. Books offer deep insights into different subjects, whether fiction or non-fiction, while journals and periodicals provide up-to-date information and research on various topics. They expand our horizons, improve critical thinking, and help us stay informed about the world around us.
          </p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Mental Stimulation:</strong> Reading keeps the brain active and engaged, improving cognitive function.</li>
            <li><strong>Knowledge and Insight:</strong> Books and journals offer new perspectives, allowing readers to explore different subjects and ideas.</li>
            <li><strong>Improved Focus and Concentration:</strong> Reading encourages longer periods of concentration, which is essential in our fast-paced digital world.</li>
            <li><strong>Stress Reduction:</strong> Escaping into a book can be a great way to reduce stress and relax.</li>
            <li><strong>Access to Research and Development:</strong> Journals and periodicals provide the latest developments in various fields, keeping professionals and students informed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
