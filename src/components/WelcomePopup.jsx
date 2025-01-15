import React from 'react';

const WelcomePopup = ({ onClose, titulo, descricao }) => {
  // Preserve whitespace
  const paragraphs = descricao.split('\n').map((paragraph, index) => (
    <pre key={index} style={styles.description}>
      {paragraph}
    </pre>
  ));

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>{titulo}</h2>
        <div style={styles.descriptionContainer}>{paragraphs}</div>
        <button style={styles.button} onClick={onClose}>
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
    textAlign: 'left'
  },
  title: {
    color: '#8B4513',
    marginBottom: '15px',
    textAlign: 'center'
  },
  descriptionContainer: {
    color: '#8B4513',
    marginBottom: '20px',
    lineHeight: '1.5',
    fontFamily: 'monospace' // Use monospace font to preserve spacing
  },
  description: {
    margin: '0', // Remove default margin from <pre>
    whiteSpace: 'pre-wrap' // Allow line breaks within the <pre> element
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto',
    '&:hover': {
      backgroundColor: '#A0522D'
    }
  }
};

export default WelcomePopup;
