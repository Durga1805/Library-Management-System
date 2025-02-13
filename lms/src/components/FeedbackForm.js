import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { FaSpinner } from 'react-icons/fa';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axiosInstance.post('/api/feedback', formData);
      setMessage('Feedback form created and notifications sent successfully!');
      setFormData({ title: '', description: '', dueDate: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating feedback form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Generate Feedback Form</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            'Generate Feedback Form'
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm; 