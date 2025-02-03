// lms\src\components\WhatsappChat.js
import React from 'react';
import './WhatsappChat.css';  // Import CSS for styling

const WhatsappChat = () => {
  return (
    <div className="whatsapp-chat">
      <a
        href="https://web.whatsapp.com/send?phone=919495980442" // Replace with your phone number
        className="whatsapp-button"
        id="whatsappButton"
        target="_blank" // Opens WhatsApp in a new tab
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="chat-tooltip">Chat </span>
      </a>
    </div>
  );
};

export default WhatsappChat;
