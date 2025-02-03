// // backend/controllers/reportController.js

// const { Order, OrderItem } = require('../models'); // Assuming you have these models for orders

// const getReports = async (req, res) => {
//   try {
//     // Example data
//     const totalSales = 15000;
//     const orderCount = 100;
//     const purchasedProducts = [
//       { _id: 'Book 1', totalQuantity: 50, totalSpent: 5000 },
//       { _id: 'Book 2', totalQuantity: 30, totalSpent: 3000 },
//       // Add more products
//     ];

//     res.json({ totalSales, orderCount, purchasedProducts });
//   } catch (error) {
//     console.error('Error fetching report data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = { getReports };
