import { clearSession } from './sessionManager';

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
  localStorage.removeItem('role');
  localStorage.removeItem('dept');
  // Clear any other auth-related items you might have
};

export const handleLogout = (navigate) => {
  clearSession();
  navigate('/login');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}; 