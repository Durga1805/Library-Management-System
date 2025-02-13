import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import Header from "../components/Header";

const generatePassword = () => Math.random().toString(36).slice(-8);

const AddUser = () => {
  const [user, setUser] = useState({
    name: "",
    dob: "",
    address: "",
    phoneno: "",
    email: "",
    dept: "CSE",
    status: "Active",
    password: generatePassword(),
    role: "staff",
  });

  const [csvFile, setCsvFile] = useState(null);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const phonePattern = /^[6789]\d{9}$/;
    if (!phonePattern.test(user.phoneno)) {
      alert("Phone number must start with 6, 7, 8, or 9 and contain exactly 10 digits.");
      return false;
    }
    
    const dobYear = new Date(user.dob).getFullYear();
    if (dobYear < 1960 || dobYear > 2006) {
      alert("Date of Birth must be between 1960 and 2006.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      const response = await axios.post("http://localhost:8080/api/users/addStaff", user);
      
      // Show success message
      alert(response.data.message);
      
      // Show credentials in a separate alert
      const credentials = response.data.staff;
      alert(
        `Please save these credentials:\n\n` +
        `Name: ${credentials.name}\n` +
        `User ID: ${credentials.userid}\n` +
        `Password: ${credentials.password}\n` +
        `Email: ${credentials.email}`
      );
      
      // Reset form
      setUser({
        name: "",
        dob: "",
        address: "",
        phoneno: "",
        email: "",
        dept: "CSE",
        status: "Active",
        password: generatePassword(),
        role: "staff",
      });
    } catch (error) {
      console.error('Error adding staff:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error adding staff: " + (error.message || "Unknown error"));
      }
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }
    
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
      complete: async (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            alert("No data found in CSV file");
            return;
          }

          // Helper function to format date
          const formatDate = (dateStr) => {
            try {
              const date = new Date(dateStr);
              if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
              }
              return date.toISOString().split('T')[0];
            } catch (error) {
              throw new Error(`Invalid date format for: ${dateStr}`);
            }
          };

          // Filter out empty rows and transform dates
          const validData = results.data
            .filter(row => row.name && row.email && row.phoneno)
            .map(row => {
              try {
                return {
                  ...row,
                  dob: formatDate(row.dob),
                  startDate: formatDate(row.startDate),
                  endDate: formatDate(row.endDate),
                  semester: parseInt(row.semester)
                };
              } catch (error) {
                throw new Error(`Row with email ${row.email}: ${error.message}`);
              }
            });

          if (validData.length === 0) {
            alert("No valid data found in CSV file");
            return;
          }

          console.log("Sending data:", validData);

          const response = await axios.post(
            "http://localhost:8080/api/users/uploadStudents",
            { users: validData }
          );

          if (response.data.credentials) {
            // Create CSV content for credentials
            const credentialsCSV = Papa.unparse(response.data.credentials);
            
            // Create and download credentials file
            const blob = new Blob([credentialsCSV], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'student_credentials.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }

          alert(`Successfully uploaded ${response.data.count} students`);
        } catch (error) {
          if (error.response?.data?.errors) {
            const errorMessage = error.response.data.errors
              .map(err => `Row ${err.row}: ${err.errors.join(', ')}`)
              .join('\n');
            alert(`Validation errors:\n${errorMessage}`);
          } else if (error.response?.data?.message) {
            alert(error.response.data.message);
          } else {
            console.error("Upload error:", error);
            alert(error.message || "Error uploading CSV");
          }
        }
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        alert("Error parsing CSV file");
      }
    });
  };

  // Add a function to download CSV template
  const downloadTemplate = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/csv-template");
      const templateCSV = Papa.unparse({
        fields: response.data.headers,
        data: [response.data.sampleRow]
      });
      
      const blob = new Blob([templateCSV], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error downloading template");
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center">LMS</h1>
        <nav className="flex flex-col space-y-3">
        <Link to="/adminpage" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Dashboard</Link>
          <Link to="/add-users" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Add Users</Link>
          <Link to="/searchuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Search Users</Link>
          <Link to="/listuser" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">List Users</Link>
          <Link to="/list-feedback" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Feedback</Link>
        </nav>
      </aside>

{/* Main Content */}
<div className="flex-1 flex flex-col overflow-auto"> {/* Make the content area scrollable */}
  {/* Header */}
  <div className="flex-1 flex flex-col">
  <Header title=" Add-Users" />

  {/* Content Section */}
  <div className="container mx-auto pt-24 pb-24 px-4">
    <h2 className="text-3xl font-bold mb-6 text-center">Add Staff</h2>

    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto space-y-3">
      {Object.keys(user).map((key) => (
        key !== "role" && key !== "status" && key !== "dept" && key !== "password" && (
          <input
            key={key}
            type={key === "dob" ? "date" : "text"}
            name={key}
            placeholder={key}
            value={user[key]}
            onChange={handleChange}
            className="block w-full p-2 border rounded"
            required
          />
        )
      ))}
      <div>
        <label>Department:</label>
        <select name="dept" value={user.dept} onChange={handleChange} className="block w-full p-2 border rounded">
          <option value="CSE">CSE</option>
          <option value="MCA">MCA</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Library">Library</option>
        </select>
      </div>
      <div>
        <label>Status:</label>
        <label className="ml-2">
          <input type="radio" name="status" value="Active" checked={user.status === "Active"} onChange={handleChange} /> Active
        </label>
        <label className="ml-2">
          <input type="radio" name="status" value="Deactive" checked={user.status === "Deactive"} onChange={handleChange} /> Deactive
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Staff
      </button>
    </form>

    <h2 className="text-3xl font-bold mt-10 mb-4 text-center">Upload Students CSV</h2>
    <div className="bg-white p-4 rounded-lg shadow-md max-w-lg mx-auto">
      <button 
        onClick={downloadTemplate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-3 w-full"
      >
        Download CSV Template
      </button>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        className="block w-full mb-3"
      />
      <button 
        onClick={handleUpload} 
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Upload CSV
      </button>
    </div>
  </div>
</div>
</div>

      </div>
    
  );
};

export default AddUser;
