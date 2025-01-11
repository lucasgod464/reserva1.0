import React from 'react';

const PixPopup = ({ valorTotal, fecharPopupPix }) => {
  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popup}>
        <h3 style={styles.popupTitle}>Efetue o Pagamento</h3>
        <p style={styles.popupText}>
          Chave PIX copiada! Efetue o pagamento de R$ {valorTotal} e clique em "Já fiz o pagamento" para continuar.
        </p>
        <button style={styles.popupButton} onClick={fecharPopupPix}>
          Já fiz o pagamento
        </button>
      </div>
    </div>
  );
};

const styles = {
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    backgroundColor: '#FFF8DC',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    textAlign: 'center'
  },
  popupTitle: {
    color: '#8B4513',
    marginBottom: '15px'
  },
  popupText: {
    color: '#8B4513',
    marginBottom: '20px'
  },
  popupButton: {
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

export default PixPopup;
