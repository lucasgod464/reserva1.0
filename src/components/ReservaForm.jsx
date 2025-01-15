import React, { useState } from 'react';

const ReservaForm = ({ 
  pessoas, 
  nomes, 
  criancas, 
  telefone, 
  cupom,
  precos,
  handlePessoasChange,
  handleNomeChange,
  handleCriancaChange,
  handleTelefoneChange,
  handleCupomChange,
  aplicarCupom
}) => {
  const [mostrarCupom, setMostrarCupom] = useState(false);

  return (
    <form style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Número de Pessoas:</label>
        <input
          style={styles.input}
          type="number"
          min="1"
          value={pessoas}
          onChange={handlePessoasChange}
          required
        />
      </div>

      {nomes.map((nome, index) => (
        <div key={index} style={index === 0 ? styles.inputGroup : styles.inputGroupDestaque}>
          <label style={styles.label}>
            {index === 0 ? 'Nome do Responsável:' : `Nome da Pessoa ${index + 1}:`}
          </label>
          <input
            style={styles.input}
            type="text"
            placeholder={index === 0 ? 'Nome do Responsável' : `Nome da Pessoa ${index + 1}`}
            value={nome}
            onChange={(e) => handleNomeChange(index, e.target.value)}
            required
          />
          {index > 0 && (
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={criancas[index]}
                onChange={(e) => handleCriancaChange(index, e.target.checked)}
              />
              Criança (R$ {precos.crianca.toFixed(2)})
            </label>
          )}
        </div>
      ))}

      <div style={styles.inputGroup}>
        <label style={styles.label}>Telefone:</label>
        <input
          style={styles.input}
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          required
        />
      </div>

      <div style={styles.cupomContainer}>
        {!mostrarCupom ? (
          <button 
            type="button" 
            style={styles.mostrarCupomButton}
            onClick={() => setMostrarCupom(true)}
          >
            Tem um cupom de desconto?
          </button>
        ) : (
          <div style={styles.cupomInputGroup}>
            <input
              style={styles.cupomInput}
              type="text"
              placeholder="Digite seu cupom"
              value={cupom}
              onChange={handleCupomChange}
            />
            <button 
              type="button" 
              style={styles.cupomButton}
              onClick={aplicarCupom}
            >
              Aplicar
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    paddingLeft: '10px'
  },
  inputGroupDestaque: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '15px',
    backgroundColor: '#FFF8DC',
    border: '2px solid #8B4513',
    borderRadius: '5px',
    marginBottom: '10px'
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
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#8B4513'
  },
  cupomContainer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center'
  },
  mostrarCupomButton: {
    padding: '8px 15px',
    fontSize: '14px',
    color: '#8B4513',
    backgroundColor: 'transparent',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#FFF8DC'
    }
  },
  cupomInputGroup: {
    display: 'flex',
    gap: '10px'
  },
  cupomInput: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
  },
  cupomButton: {
    padding: '8px 15px',
    fontSize: '14px',
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

export default ReservaForm;
