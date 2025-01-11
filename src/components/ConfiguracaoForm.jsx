import React from 'react';

const ConfiguracaoForm = ({
  precoAdulto,
  precoCrianca,
  chavePix,
  cupons,
  novoCupom,
  setPrecoAdulto,
  setPrecoCrianca,
  setChavePix,
  setNovoCupom,
  adicionarCupom,
  removerCupom,
  salvarConfiguracoes
}) => {
  return (
    <div style={styles.configuracaoContainer}>
      <h2 style={styles.subtitle}>Configurações</h2>
      
      <div style={styles.inputGroup}>
        <label style={styles.label}>Preço para Adulto:</label>
        <input
          style={styles.input}
          type="number"
          step="0.01"
          value={precoAdulto}
          onChange={(e) => setPrecoAdulto(parseFloat(e.target.value))}
        />
      </div>
      
      <div style={styles.inputGroup}>
        <label style={styles.label}>Preço para Criança:</label>
        <input
          style={styles.input}
          type="number"
          step="0.01"
          value={precoCrianca}
          onChange={(e) => setPrecoCrianca(parseFloat(e.target.value))}
        />
      </div>
      
      <div style={styles.inputGroup}>
        <label style={styles.label}>Chave PIX:</label>
        <input
          style={styles.input}
          type="text"
          value={chavePix}
          onChange={(e) => setChavePix(e.target.value)}
        />
      </div>
      
      <div style={styles.cuponsContainer}>
        <h3 style={styles.subtitle}>Cupons de Desconto</h3>
        
        <div style={styles.novoCupomContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome do Cupom:</label>
            <input
              style={styles.input}
              type="text"
              value={novoCupom.nome}
              onChange={(e) => setNovoCupom({ ...novoCupom, nome: e.target.value })}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Desconto (%):</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100"
              value={novoCupom.desconto}
              onChange={(e) => setNovoCupom({ ...novoCupom, desconto: parseFloat(e.target.value) })}
            />
          </div>
          
          <button 
            style={styles.cupomButton}
            onClick={adicionarCupom}
          >
            Adicionar Cupom
          </button>
        </div>
        
        {cupons.length > 0 && (
          <div style={styles.listaCupons}>
            {cupons.map((cupom, index) => (
              <div key={index} style={styles.cupomItem}>
                <div style={styles.cupomInfo}>
                  <strong>{cupom.nome}</strong> - {cupom.desconto}% de desconto
                </div>
                <button 
                  style={styles.removerCupomButton}
                  onClick={() => removerCupom(index)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button style={styles.button} onClick={salvarConfiguracoes}>
        Salvar Configurações
      </button>
    </div>
  );
};

const styles = {
  configuracaoContainer: {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#F5F5DC',
    border: '2px solid #8B4513',
    borderRadius: '10px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#8B4513',
    marginBottom: '30px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginBottom: '15px'
  },
  label: {
    fontSize: '14px',
    color: '#8B4513'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
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
  },
  cuponsContainer: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
  },
  novoCupomContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  cupomButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#A0522D'
    }
  },
  listaCupons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cupomItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
  },
  cupomInfo: {
    color: '#8B4513'
  },
  removerCupomButton: {
    padding: '5px 10px',
    fontSize: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#c82333'
    }
  }
};

export default ConfiguracaoForm;
