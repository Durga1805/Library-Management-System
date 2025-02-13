import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot'; // Import the Chatbot component
import WhatsappChat from './components/WhatsappChat'; // Import the WhatsApp component
import { useEffect } from 'react';
import { refreshSession, checkSession, clearSession } from './utils/sessionManager';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Only check session if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Check session on component mount
      if (!checkSession()) {
        clearSession();
        navigate('/login');
        return;
      }

      // Add event listeners for user activity
      const handleActivity = () => {
        if (checkSession()) {
          refreshSession();
        } else {
          clearSession();
          navigate('/login');
        }
      };

      // Reduce the number of events to monitor
      const events = ['mousedown', 'keydown'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity);
      });

      // Cleanup
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [navigate]);

  return (
    <>
      <main>
        <Outlet />
      </main>

      
    {/* WhatsApp Chat Button */}
    <WhatsappChat />

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
