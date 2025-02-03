import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot'; // Import the Chatbot component
import WhatsappChat from './components/WhatsappChat'; // Import the WhatsApp component

function App() {
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
