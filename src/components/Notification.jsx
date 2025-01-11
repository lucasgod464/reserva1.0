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
    right: '20px',
    padding: '15px 25px',
    borderRadius: '5px',
    color: '#fff',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease-out',
    backgroundColor: type === 'success' ? '#28a745' : '#dc3545'
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
