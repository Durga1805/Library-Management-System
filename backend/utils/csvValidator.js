const validateStudentData = (student) => {
  const errors = [];

  // Required fields check
  const requiredFields = ['name', 'dob', 'email', 'phoneno', 'address', 'dept', 'semester', 'startDate', 'endDate'];
  requiredFields.forEach(field => {
    if (!student[field] || String(student[field]).trim() === '') {
      errors.push(`Missing ${field}`);
    }
  });

  if (errors.length > 0) return errors;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(student.email)) {
    errors.push('Invalid email format');
  }

  // Phone number validation
  const phoneRegex = /^[6789]\d{9}$/;
  if (!phoneRegex.test(student.phoneno)) {
    errors.push('Invalid phone number format (must be 10 digits starting with 6-9)');
  }

  // Department validation
  const validDepts = ['CSE', 'MCA', 'IT', 'Mathematics'];
  if (!validDepts.includes(student.dept)) {
    errors.push(`Invalid department. Must be one of: ${validDepts.join(', ')}`);
  }

  // Date validations with better error handling
  const validateDate = (dateStr, fieldName) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return `Invalid ${fieldName} format (use YYYY-MM-DD)`;
      }
      return null;
    } catch (error) {
      return `Invalid ${fieldName} format (use YYYY-MM-DD)`;
    }
  };

  // DOB validation
  const dobError = validateDate(student.dob, 'date of birth');
  if (dobError) {
    errors.push(dobError);
  } else {
    const dobYear = new Date(student.dob).getFullYear();
    if (dobYear < 1960 || dobYear > 2006) {
      errors.push('Date of Birth must be between 1960 and 2006');
    }
  }

  // Semester validation
  const semester = parseInt(student.semester);
  if (isNaN(semester) || semester < 1 || semester > 8) {
    errors.push('Semester must be between 1 and 8');
  }

  // Start and End date validation
  const startDateError = validateDate(student.startDate, 'start date');
  const endDateError = validateDate(student.endDate, 'end date');

  if (startDateError) errors.push(startDateError);
  if (endDateError) errors.push(endDateError);

  if (!startDateError && !endDateError) {
    const startDate = new Date(student.startDate);
    const endDate = new Date(student.endDate);
    if (startDate >= endDate) {
      errors.push('End date must be after start date');
    }
  }

  return errors;
};

module.exports = { validateStudentData }; 