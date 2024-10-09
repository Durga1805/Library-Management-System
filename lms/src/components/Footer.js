import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-gradient-to-r from-blue-500 to-red-600 text-white py-4'>
      <div className='container mx-auto px-4'>
        <p className='text-center font-bold text-lg' title="Portfolio">
          Library Management
        </p>
        <p className='text-sm text-center mt-2'>
          © {new Date().getFullYear()} | All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
