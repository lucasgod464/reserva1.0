import React, { useRef, useState } from 'react';

const PagamentoSection = ({
  chavepix,
  tipo_chavepix,
  valorTotal,
  handleClickPix,
  mostrarAviso,
  handleComprovanteChange
}) => {
  const chavePixRef = useRef(null);
  const [nomeArquivo, setNomeArquivo] = useState('');

  const tiposChavePix = {
    cpf: 'CPF',
    cnpj: 'CNPJ',
    email: 'E-mail',
    telefone: 'Telefone',
    chaveAleatoria: 'Chave Aleatória'
  };

  const copiarChavePix = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(chavepix)
        .then(handleClickPix)
        .catch(copiaManual);
    } else {
      copiaManual();
    }
  };

  const copiaManual = () => {
    if (chavePixRef.current) {
      chavePixRef.current.select();
      document.execCommand('copy');
    }
    handleClickPix();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNomeArquivo(file.name);
    } else {
      setNomeArquivo('');
    }
    handleComprovanteChange(e);
  };

  return (
    <div style={styles.pagamentoContainer}>
      <h3 style={styles.pagamentoTitle}>Informações de Pagamento</h3>
      
      <div style={styles.pagamentoInfo}>
        <p style={styles.valorTotal}>Valor Total: R$ {valorTotal}</p>
        <p style={styles.instrucao}>Para finalizar sua reserva, siga os passos abaixo:</p>
      </div>

      <div style={styles.passos}>
        <div style={styles.passo}>
          <span style={styles.passoNumero}>1</span>
          <div style={styles.passoConteudo}>
            <h4 style={styles.passoTitulo}>Realize o Pagamento via PIX</h4>
            <div style={styles.pixContainer} onClick={copiarChavePix}>
              <p style={styles.pixInfo}><strong>Tipo de Chave:</strong> {tiposChavePix[tipo_chavepix]}</p>
              <div style={styles.pixInputContainer}>
                <input
                  ref={chavePixRef}
                  style={styles.pixInput}
                  value={chavepix}
                  readOnly
                  onClick={(e) => e.stopPropagation()}
                />
                <button style={styles.copyButton} onClick={copiarChavePix}>
                  Copiar
                </button>
              </div>
              <div style={styles.copyIndicator}>
                <span style={styles.copyIcon}>📋</span>
                Clique para copiar a chave PIX
              </div>
            </div>
            {mostrarAviso && (
              <div style={styles.aviso}>
                <span style={styles.avisoIcon}>✅</span>
                Chave PIX copiada!
              </div>
            )}
          </div>
        </div>

        <div style={styles.passo}>
          <span style={styles.passoNumero}>2</span>
          <div style={styles.passoConteudo}>
            <h4 style={styles.passoTitulo}>Envie o Comprovante de Pagamento</h4>
            <div style={styles.inputGroup}>
              <label style={styles.fileInputLabel} htmlFor="comprovante">
                {nomeArquivo ? nomeArquivo : 'Selecione o arquivo do comprovante'}
              </label>
              <input
                id="comprovante"
                style={styles.fileInput}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                required
              />
            </div>
            <p style={styles.comprovanteInstrucao}>Formatos aceitos: imagens e PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pagamentoContainer: {
    marginTop: '30px',
    padding: '20px',
    border: '2px solid #8B4513',
    borderRadius: '10px',
    backgroundColor: '#FFF8DC'
  },
  pagamentoTitle: {
    fontSize: '24px',
    color: '#8B4513',
    marginBottom: '20px',
    textAlign: 'center'
  },
  pagamentoInfo: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  valorTotal: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: '10px'
  },
  instrucao: {
    fontSize: '16px',
    color: '#8B4513'
  },
  passos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  passo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px'
  },
  passoNumero: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#8B4513',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    flexShrink: 0
  },
  passoConteudo: {
    flex: 1
  },
  passoTitulo: {
    fontSize: '18px',
    color: '#8B4513',
    marginBottom: '10px'
  },
  pixContainer: {
    padding: '15px',
    backgroundColor: '#F5DEB3',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
    border: '2px dashed #8B4513',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#FFE4B5',
      transform: 'scale(1.02)'
    }
  },
  pixInfo: {
    margin: '5px 0',
    color: '#8B4513',
    fontSize: '16px'
  },
  pixInputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  pixInput: {
    flex: '1 1 200px',
    padding: '10px',
    fontSize: '16px',
    color: '#8B4513',
    backgroundColor: 'white',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    cursor: 'text'
  },
  copyButton: {
    padding: '10px 15px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#8B4513',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#A0522D'
    }
  },
  copyIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    color: '#8B4513',
    fontWeight: 'bold'
  },
  copyIcon: {
    marginRight: '5px',
    fontSize: '20px'
  },
  aviso: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#90EE90',
    color: '#006400',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  avisoIcon: {
    marginRight: '10px',
    fontSize: '20px'
  },
  inputGroup: {
    marginBottom: '10px',
    position: 'relative'
  },
  fileInputLabel: {
    display: 'block',
    padding: '10px',
    backgroundColor: 'white',
    color: '#8B4513',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  },
  comprovanteInstrucao: {
    fontSize: '14px',
    color: '#8B4513',
    fontStyle: 'italic',
    marginTop: '5px'
  }
};

export default PagamentoSection;
