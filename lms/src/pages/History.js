import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/lms2.jpg';

const History = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const name = localStorage.getItem('name') || 'User';
  const profilePic = localStorage.getItem('profilePic');

  const calculateFine = (dueDate) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const diffTime = currentDate - due;
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays > 0 ? diffDays * 2 : 0;
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/books`, {
        params: { userId },
      });
      const issuedBooksAfter2024 = response.data.filter((book) => {
        const issuedDate = new Date(book.issuedAt);
        return issuedDate.getFullYear() > 2024;
      });
      setBooks(issuedBooksAfter2024);
      setLoading(false);
    } catch (error) {
      setError('Error fetching books: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const sortBooks = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedBooks = [...books].sort((a, b) => {
      if (key === 'title') {
        return direction === 'ascending'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (key === 'issuedAt' || key === 'dueDate') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setBooks(sortedBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          <div>
            <h6 className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/userpage')}>
              Back
            </h6>
          </div>
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">LMS</h1>
          </div>
          <nav className="flex space-x-4 items-center">
            <h6 className="text-white hover:text-gray-200">{name}</h6>
            <div className="relative">
              <button className="flex items-center space-x-2 text-white">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    {name.charAt(0)}
                  </div>
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Your History</h1>
        {books.length > 0 ? (
          <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortBooks('title')}
                >
                  Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortBooks('issuedAt')}
                >
                  Issue Date {sortConfig.key === 'issuedAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => sortBooks('dueDate')}
                >
                  Due Date {sortConfig.key === 'dueDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-2">Fine</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const fine = calculateFine(book.dueDate);
                return (
                  <tr key={book._id} className="text-gray-700">
                    <td className="border px-4 py-2">{book.title}</td>
                    <td className="border px-4 py-2">{new Date(book.issuedAt).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{new Date(book.dueDate).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">₹{fine}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-white mt-6">No issued books found after 2024.</div>
        )}
      </div>
    </div>
  );
};

export default History;



// import React, { useEffect, useState } from 'react'; 
// import axios from 'axios'; 
// import { useNavigate } from 'react-router-dom'; 
// import backgroundImage from '../assets/lms2.jpg';  

// const History = () => {   
//   const [books, setBooks] = useState([]);   
//   const [loading, setLoading] = useState(true);   
//   const [error, setError] = useState(null);   
//   const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });   
//   const navigate = useNavigate();   
//   const userId = localStorage.getItem('userId');   
//   const name = localStorage.getItem('name') || 'User';   
//   const profilePic = localStorage.getItem('profilePic');    

//   const calculateFine = (dueDate) => {     
//     const currentDate = new Date();     
//     const due = new Date(dueDate);     
//     const diffTime = currentDate - due;     
//     const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));     
//     return diffDays > 0 ? diffDays * 2 : 0;   
//   };    

//   const fetchBooks = async () => {     
//     try {       
//       const response = await axios.get(`http://localhost:8080/api/books`, { params: { userId } });       
//       setBooks(response.data);       
//       setLoading(false);     
//     } catch (error) {       
//       setError('Error fetching books: ' + (error.response?.data?.message || error.message));       
//       setLoading(false);     
//     }   
//   };    

//   const sortBooks = (key) => {     
//     let direction = 'ascending';     
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {       
//       direction = 'descending';     
//     }     
//     setSortConfig({ key, direction });      
//     const sortedBooks = [...books].sort((a, b) => {       
//       if (key === 'title') {         
//         return direction === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);       
//       } else if (key === 'issuedAt' || key === 'dueDate') {         
//         const dateA = new Date(a[key]);         
//         const dateB = new Date(b[key]);         
//         return direction === 'ascending' ? dateA - dateB : dateB - dateA;       
//       }       
//       return 0;     
//     });     
//     setBooks(sortedBooks);   
//   };    

//   useEffect(() => {     
//     fetchBooks();   
//   }, [userId]);    

//   if (loading) return <div>Loading...</div>;   
//   if (error) return <div>{error}</div>;    

//   return (     
//     <div       
//       style={{         
//         backgroundImage: `url(${backgroundImage})`,         
//         backgroundSize: 'cover',         
//         minHeight: '100vh',         
//         color: 'white',       
//       }}     
//     >       
//       <header className="h-16 shadow-lg bg-gradient-to-r from-blue-500 to-red-700 fixed w-full z-40">         
//         <div className="h-full container mx-auto flex items-center px-4 justify-between">           
//           <div>             
//             <h6 className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/userpage')}>               
//               Back             
//             </h6>           
//           </div>           
//           <div className="flex items-center">             
//             <h1 className="text-white text-xl font-bold">LMS</h1>           
//           </div>           
//           <nav className="flex space-x-4 items-center">             
//             <h6 className="text-white hover:text-gray-200">{name}</h6>             
//             <div className="relative">               
//               <button className="flex items-center space-x-2 text-white">                 
//                 {profilePic ? (                   
//                   <img                     
//                     src={profilePic}                     
//                     alt="Profile"                     
//                     className="w-10 h-10 rounded-full object-cover cursor-pointer"                   
//                   />                 
//                 ) : (                   
//                   <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">                     
//                     {name.charAt(0)}                   
//                   </div>                 
//                 )}               
//               </button>             
//             </div>           
//           </nav>         
//         </div>       
//       </header>        
//       <div className="container mx-auto pt-20">         
//         <h1 className="text-3xl font-bold mb-6 text-center">Your History</h1>         
//         {books.length > 0 ? (           
//           <table className="table-auto w-full bg-white bg-opacity-90 rounded-lg shadow-lg">             
//             <thead className="bg-blue-500 text-white">               
//               <tr>                 
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => sortBooks('title')}>                   
//                   Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}                 
//                 </th>                 
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => sortBooks('issuedAt')}>                   
//                   Issue Date {sortConfig.key === 'issuedAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}                 
//                 </th>                 
//                 <th className="px-4 py-2 cursor-pointer" onClick={() => sortBooks('dueDate')}>                   
//                   Due Date {sortConfig.key === 'dueDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}                 
//                 </th>                 
//                 <th className="px-4 py-2">Fine</th>               
//               </tr>             
//             </thead>             
//             <tbody>               
//               {books.map((book) => {                 
//                 const fine = calculateFine(book.dueDate);                 
//                 return (                   
//                   <tr key={book._id} className="text-gray-700">                     
//                     <td className="border px-4 py-2">{book.title}</td>                     
//                     <td className="border px-4 py-2">{new Date(book.issuedAt).toLocaleDateString()}</td>                     
//                     <td className="border px-4 py-2">{new Date(book.dueDate).toLocaleDateString()}</td>                     
//                     <td className="border px-4 py-2">₹{fine}</td>                   
//                   </tr>                 
//                 );               
//               })}             
//             </tbody>           
//           </table>         
//         ) : (           
//           <div className="text-center text-white mt-6">No issued books found.</div>         
//         )}       
//       </div>     
//     </div>   
//   ); 
// };  

// export default History;
