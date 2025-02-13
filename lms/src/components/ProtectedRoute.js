import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/auth';
import { checkSession, clearSession } from '../utils/sessionManager';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const dept = localStorage.getItem('dept');

  // Check both token and session
  if (!token || isTokenExpired(token) || !checkSession()) {
    clearSession(); // Clear all auth data
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0) {
    const isLibStaff = role === 'staff' && dept === 'Library';
    const hasAllowedRole = allowedRoles.includes(role) || 
      (allowedRoles.includes('libstaff') && isLibStaff);
    
    if (!hasAllowedRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute; 