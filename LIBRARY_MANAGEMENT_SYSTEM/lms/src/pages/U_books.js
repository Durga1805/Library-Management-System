import React from 'react';

function U_books() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage:`url(${require('../assets/user.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      
      <div className="bg-gray-200 bg-opacity-90 p-8 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <div className="grid grid-cols-3 text-center font-semibold text-lg">
          <div className="border-r border-black p-4">TITLE</div>
          <div className="border-r border-black p-4">AUTHOR</div>
          <div className="p-4">STATUS</div>
        </div>
      </div>
    </div>
  );
}

export default U_books;
