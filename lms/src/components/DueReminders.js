import React, { useState, useEffect } from 'react';
import { FaClock, FaExclamationTriangle, FaRupeeSign, FaUndo } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import { calculateFine } from '../utils/fineCalculator';
import { initializeRazorpay, createPaymentOrder } from '../utils/razorpayConfig';

const DueReminders = () => {
  const [dueBooks, setDueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningBook, setReturningBook] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchDueBooks();
  }, []);

  const fetchDueBooks = async () => {
    try {
      const response = await axiosInstance.get('/api/books/my-books');
      const issuedBooks = response.data.issued || [];
      
      const booksWithDueDates = issuedBooks
        .filter(book => book.dueDate)
        .map(book => {
          const daysUntilDue = Math.ceil((new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
          const isOverdue = daysUntilDue < 0;
          const fine = calculateFine(book.dueDate);
          
          return {
            ...book,
            daysUntilDue,
            isOverdue,
            fine
          };
        })
        .filter(book => book.daysUntilDue <= 5 || book.isOverdue)
        .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

      setDueBooks(booksWithDueDates);
    } catch (error) {
      console.error('Error fetching due books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      setReturningBook(bookId);
      const book = dueBooks.find(b => b._id === bookId);
      
      if (book.fine > 0) {
        setSelectedBook(book);
        setShowPaymentModal(true);
      } else {
        await processReturn(bookId);
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Error returning book. Please try again.');
    } finally {
      setReturningBook(null);
    }
  };

  const processReturn = async (bookId) => {
    try {
      await axiosInstance.post(`/api/books/return/${bookId}`);
      alert('Book returned successfully');
      fetchDueBooks();
    } catch (error) {
      console.error('Error processing return:', error);
      alert('Error returning book');
    }
  };

  const handlePayment = async () => {
    try {
      const res = await initializeRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load');
        return;
      }

      const order = await createPaymentOrder(selectedBook.fine);
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Library Management System",
        description: `Fine payment for ${selectedBook.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            await axiosInstance.post('/api/payment/verify', {
              bookId: selectedBook._id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: selectedBook.fine
            });

            // Process return after successful payment
            await processReturn(selectedBook._id);
            setShowPaymentModal(false);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact library staff.');
          }
        },
        prefill: {
          name: localStorage.getItem('name'),
          email: localStorage.getItem('email'),
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading reminders...</div>;
  }

  if (dueBooks.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          <FaClock className="mr-2 text-yellow-500" />
          Due Date Reminders
        </h2>
        <div className="space-y-4">
          {dueBooks.map((book) => (
            <div 
              key={book._id}
              className={`p-4 rounded-lg border ${
                book.isOverdue
                  ? 'bg-red-100 border-red-300'
                  : book.daysUntilDue <= 1 
                  ? 'bg-red-50 border-red-200' 
                  : book.daysUntilDue <= 3
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                  {book.fine > 0 && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <FaRupeeSign className="mr-1" />
                      Fine: ₹{book.fine}
                    </p>
                  )}
                </div>
                <div className="flex items-start space-x-2">
                  {(book.isOverdue || book.daysUntilDue <= 1) && (
                    <FaExclamationTriangle className={`${
                      book.isOverdue ? 'text-red-600' : 'text-red-500'
                    }`} />
                  )}
                  <button
                    onClick={() => handleReturn(book._id)}
                    disabled={returningBook === book._id}
                    className={`px-3 py-1 rounded flex items-center ${
                      returningBook === book._id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors`}
                  >
                    <FaUndo className="mr-1" />
                    {returningBook === book._id ? 'Returning...' : 'Return'}
                  </button>
                </div>
              </div>
              <p className={`text-sm mt-2 ${
                book.isOverdue
                  ? 'text-red-700 font-semibold'
                  : book.daysUntilDue <= 1 
                  ? 'text-red-600' 
                  : book.daysUntilDue <= 3
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`}>
                {book.isOverdue
                  ? `Overdue by ${Math.abs(book.daysUntilDue)} day${Math.abs(book.daysUntilDue) !== 1 ? 's' : ''}!`
                  : book.daysUntilDue === 0 
                  ? 'Due today!' 
                  : book.daysUntilDue === 1
                  ? 'Due tomorrow!'
                  : `Due in ${book.daysUntilDue} days`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Fine Payment Required</h3>
            <p className="mb-4">
              Book: <span className="font-medium">{selectedBook.title}</span>
            </p>
            <p className="mb-4">
              Fine Amount: <span className="font-medium text-red-600">₹{selectedBook.fine}</span>
            </p>
            <p className="mb-6 text-gray-600">
              Please choose a payment option to proceed with the return.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Pay Online
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DueReminders;