import React from 'react';

const WelcomePopup = ({ onClose, titulo, descricao }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>{titulo}</h2>
        <p style={styles.description}>{descricao}</p>
        <button 
          style={styles.button}
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  popup: {
    backgroundColor: '#FFF8DC',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    textAlign: 'center'
  },
  title: {
    color: '#8B4513',
    marginBottom: '15px'
  },
  description: {
    color: '#8B4513',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#A0522D'
    }
  }
};

export default WelcomePopup;
