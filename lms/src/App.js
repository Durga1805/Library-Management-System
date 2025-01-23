import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';



function App() {
  return (
    <>
    
      <main >
        <Outlet />
        
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;


