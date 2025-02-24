const calculateFine = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDateObj = new Date(dueDate);
  dueDateObj.setHours(0, 0, 0, 0);
  
  const timeDiff = today.getTime() - dueDateObj.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysDiff > 0 ? daysDiff * 3 : 0; // ₹3 per day
};

module.exports = { calculateFine }; 