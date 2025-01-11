import React from 'react';

const PagamentoSection = ({
  chavePix,
  valorTotal,
  handleClickPix,
  mostrarAviso,
  handleComprovanteChange
}) => {
  return (
    <div style={styles.pagamentoContainer}>
      <h3 style={styles.pagamentoTitle}>Pagamento</h3>
      <div style={styles.pixContainer} onClick={handleClickPix}>
        <strong>Chave PIX:</strong> {chavePix}
      </div>
      {mostrarAviso && (
        <div style={styles.aviso}>
          Chave PIX copiada com sucesso!
        </div>
      )}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Enviar Comprovante:</label>
        <input
          style={styles.input}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleComprovanteChange}
          required
        />
      </div>
    </div>
  );
};

const styles = {
  pagamentoContainer: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
  },
  pagamentoTitle: {
    marginBottom: '10px',
    color: '#8B4513'
  },
  pixContainer: {
    marginBottom: '15px',
    fontSize: '16px',
    color: '#8B4513',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  aviso: {
    marginBottom: '15px',
    color: '#228B22',
    fontSize: '14px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '14px',
    color: '#8B4513'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
  }
};

export default PagamentoSection;
