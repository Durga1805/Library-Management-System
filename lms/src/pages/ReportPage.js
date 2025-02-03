// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import backgroundImage from '../assets/lms2.jpg';

// const ReportPage = () => {
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch report data on component mount
//   useEffect(() => {
//     const fetchReportData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/books/report');
//         console.log("Report Data:", response.data); // Log response data
//         setReportData(response.data);
//       } catch (error) {
//         console.error('Error fetching the report data', error);
//         setError('Failed to load report data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReportData();
//   }, []);

//   if (loading) {
//     return <div className="text-center">Loading report data...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div>
//       {/* Header Section */}
//       <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
//         <div className='h-full container mx-auto flex items-center px-4 justify-between'>
//           <h1 className="text-white text-xl font-bold">Library Management System</h1>
//           <nav className="flex space-x-4">
//             <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
//             <button className="text-white hover:text-gray-200">Logout</button>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content Section */}
//       <div
//         className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center pt-20 px-4"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
//           <h1 className="text-3xl font-bold mb-4 text-center">Book Reservation and Issue Report</h1>
//           {reportData.length === 0 ? (
//             <div className="text-center text-gray-500">No report data available</div>
//           ) : (
//             <table className="min-w-full table-auto border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="px-4 py-2 border">Accession No.</th>
//                   <th className="px-4 py-2 border">Title</th>
//                   <th className="px-4 py-2 border">Status</th>
//                   <th className="px-4 py-2 border">Reserved By</th>
//                   <th className="px-4 py-2 border">Reserved At</th>
//                   <th className="px-4 py-2 border">Issued At</th>
//                   <th className="px-4 py-2 border">Due Date</th>
//                   <th className="px-4 py-2 border">Fine</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.map((book, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="px-4 py-2 border">{book.accno}</td>
//                     <td className="px-4 py-2 border">{book.title}</td>
//                     <td className="px-4 py-2 border">{book.status}</td>
//                     <td className="px-4 py-2 border">{book.reservedBy ? book.reservedBy.name : '-'}</td>
//                     <td className="px-4 py-2 border">{book.reservedAt ? new Date(book.reservedAt).toLocaleDateString() : '-'}</td>
//                     <td className="px-4 py-2 border">{book.issuedAt ? new Date(book.issuedAt).toLocaleDateString() : '-'}</td>
//                     <td className="px-4 py-2 border">{book.dueDate ? new Date(book.dueDate).toLocaleDateString() : '-'}</td>
//                     <td className="px-4 py-2 border">{book.fine > 0 ? `₹${book.fine}` : 'No Fine'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch report data on component mount
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books/report');
        console.log("Report Data:", response.data); // Log response data
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching the report data', error);
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading report data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Header Section */}
      <header className='h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <h1 className="text-white text-xl font-bold">LMS</h1>
          <nav className="flex space-x-4">
            <Link to="/Adminpage" className="text-white hover:text-gray-200">Back</Link>
            <button className="text-white hover:text-gray-200">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center pt-20 px-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
          <h1 className="text-3xl font-bold mb-4 text-center">Book Reservation and Issue Report</h1>
          {reportData.length === 0 ? (
            <div className="text-center text-gray-500">No report data available</div>
          ) : (
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Accession No.</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Reserved By</th>
                  <th className="px-4 py-2 border">Reserved At</th>
                  <th className="px-4 py-2 border">Issued At</th>
                  <th className="px-4 py-2 border">Due Date</th>
                  <th className="px-4 py-2 border">Fine</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((book, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 border">{book.accno}</td>
                    <td className="px-4 py-2 border">{book.title}</td>
                    <td className="px-4 py-2 border">{book.status}</td>
                    <td className="px-4 py-2 border">{book.reservedBy ? book.reservedBy.name : '-'}</td>
                    <td className="px-4 py-2 border">{book.reservedAt ? new Date(book.reservedAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 border">{book.issuedAt ? new Date(book.issuedAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 border">{book.dueDate ? new Date(book.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 border">{book.fine > 0 ? `₹${book.fine}` : 'No Fine'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
