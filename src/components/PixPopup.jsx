import React from 'react';

const PixPopup = ({ valorTotal, fecharPopupPix }) => {
  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popup}>
        <button style={styles.closeButton} onClick={fecharPopupPix}>×</button>
        <h3 style={styles.popupTitle}>Pagamento PIX</h3>
        <p style={styles.popupText}>
          A chave PIX foi copiada para sua área de transferência. Siga os passos abaixo para concluir o pagamento:
        </p>
        <ol style={styles.instructionList}>
          <li>Abra o aplicativo do seu banco ou carteira digital</li>
          <li>Escolha a opção de pagamento via PIX</li>
          <li>Cole a chave PIX copiada</li>
          <li>Confira o valor de R$ {valorTotal}</li>
          <li>Confirme o pagamento</li>
        </ol>
        <p style={styles.popupText}>
          Após realizar o pagamento, retorne a esta página para enviar o comprovante.
        </p>
        <button style={styles.popupButton} onClick={fecharPopupPix}>
          Entendi
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
    position: 'relative',
    backgroundColor: '#FFF8DC',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    textAlign: 'left'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#8B4513',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
    '&:hover': {
      color: '#A0522D'
    }
  },
  popupTitle: {
    color: '#8B4513',
    marginBottom: '15px',
    textAlign: 'center'
  },
  popupText: {
    color: '#8B4513',
    marginBottom: '15px'
  },
  instructionList: {
    color: '#8B4513',
    marginLeft: '20px',
    marginBottom: '15px'
  },
  popupButton: {
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

export default PixPopup;
