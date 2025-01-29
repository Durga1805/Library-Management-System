import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot'; // Import the Chatbot component

function App() {
  return (
    <>
      <main>
        <Outlet />
      </main>

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
