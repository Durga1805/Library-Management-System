import React, { useState } from 'react';
import Papa from 'papaparse';

const AddBooks = () => {
  const [csvData, setCsvData] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data);
        console.log('Parsed CSV Data:', result.data);
      },
    });
  };

  const handleAddUsers = () => {
    if (csvData.length === 0) {
      setMessage('Please upload a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', new Blob([JSON.stringify(csvData)], { type: 'application/json' }), 'data.csv');

    fetch('http://localhost:8080/api/upload-csv', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage('Users successfully added!');
        console.log('Success:', data);
      })
      .catch((error) => {
        setMessage('Error adding users.');
        console.error('Error:', error);
      });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${require('../assets/lms2.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Users from CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />
        <button
          onClick={handleAddUsers}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Users
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBooks;
