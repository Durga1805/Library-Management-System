import React from 'react';

const Home = () => {
  return (
    <div 
      className="home flex items-center justify-center h-screen bg-center" 
      style={{ 
        backgroundImage: `url(${require('../assets/Home.jpg')})`,
        backgroundSize: '100%', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center' 
      }}
    >
  
    </div>
  );
}

export default Home;
