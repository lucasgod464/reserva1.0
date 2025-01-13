import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const notificationStyle = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    borderRadius: '5px',
    color: '#fff',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
    backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
    textAlign: 'center',
    maxWidth: '90%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
