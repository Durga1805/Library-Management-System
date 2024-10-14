import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  return (
    <>
    
      <main className="min-h-[calc(100vh-60px)] pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
