// Increase session timeout to 2 hours
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export const initSession = () => {
  const currentTime = new Date().getTime();
  localStorage.setItem('sessionStart', currentTime);
};

export const checkSession = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const sessionStart = localStorage.getItem('sessionStart');
  if (!sessionStart) {
    // If no session start time but token exists, initialize session
    initSession();
    return true;
  }

  const currentTime = new Date().getTime();
  const sessionAge = currentTime - parseInt(sessionStart);

  return sessionAge < SESSION_TIMEOUT;
};

export const refreshSession = () => {
  // Only refresh if close to expiration
  const sessionStart = localStorage.getItem('sessionStart');
  if (sessionStart) {
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - parseInt(sessionStart);
    
    // Refresh if session is more than 80% complete
    if (sessionAge > (SESSION_TIMEOUT * 0.8)) {
      initSession();
    }
  } else {
    initSession();
  }
};

export const clearSession = () => {
  localStorage.removeItem('sessionStart');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('dept');
}; 