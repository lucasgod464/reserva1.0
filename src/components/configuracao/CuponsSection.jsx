{`import React from 'react';
import { InputField } from './FormFields';

const CuponsSection = ({ cupons, novoCupom, setCupons, setNovoCupom }) => {
  const handleNomeCupomChange = (e) => {
    setNovoCupom({ ...novoCupom, nome: e.target.value });
  };

  const handleDescontoCupomChange = (e) => {
    setNovoCupom({ ...novoCupom, desconto: parseFloat(e.target.value) });
  };

  const isCupomValido = novoCupom.nome && novoCupom.desconto > 0;

  const adicionarCupom = () => {
    if (novoCupom.nome && novoCupom.desconto > 0) {
      setCupons([...cupons, novoCupom]);
      setNovoCupom({ nome: '', desconto: 0 });
    }
  };

  const removerCupom = (index) => {
    const novosCupons = cupons.filter((_, i) => i !== index);
    setCupons(novosCupons);
  };

  const styles = {
    cuponsContainer: {
      marginTop: '20px',
      padding: '20px',
      border: '1px solid #8B4513',
      borderRadius: '5px',
      backgroundColor: '#FFF8DC'
    },
    sectionTitle: {
      color: '#8B4513',
      marginBottom: '15px',
      textAlign: 'center'
    },
    novoCupomContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '20px'
    },
    cupomInputGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
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
      },
      '&:disabled': {
        backgroundColor: '#ccc',
        cursor: 'not-allowed'
      }
    },
    listaCupons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    semCupons: {
      textAlign: 'center',
      color: '#8B4513',
      fontStyle: 'italic',
      padding: '10px'
    }
  };

  return (
    <div style={styles.cuponsContainer}>
      <h3 style={styles.sectionTitle}>Cupons de Desconto</h3>

      <div style={styles.novoCupomContainer}>
        <div style={styles.cupomInputGroup}>
          <InputField
            label="Nome do Cupom:"
            type="text"
            placeholder="Ex: DESCONTO10"
            value={novoCupom.nome}
            onChange={handleNomeCupomChange}
          />
          <InputField
            label="Desconto (%):"
            type="number"
            min="0"
            max="100"
            placeholder="0 a 100"
            value={novoCupom.desconto}
            onChange={handleDescontoCupomChange}
            withPercentSymbol
          />
        </div>

        <button
          style={styles.cupomButton}
          onClick={adicionarCupom}
          disabled={!isCupomValido}
        >
          Adicionar Cupom
        </button>
      </div>

      {cupons.length > 0 ? (
        <div style={styles.listaCupons}>
          {cupons.map((cupom, index) => (
            <CupomItem
              key={index}
              nome={cupom.nome}
              desconto={cupom.desconto}
              onRemover={() => removerCupom(index)}
            />
          ))}
        </div>
      ) : (
        <div style={styles.semCupons}>
          Nenhum cupom cadastrado. Adicione um novo cupom acima.
        </div>
      )}
    </div>
  );
};

const CupomItem = ({ nome, desconto, onRemover }) => {
  const styles = {
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
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    cupomNome: {
      color: '#8B4513',
      fontWeight: 'bold'
    },
    cupomDesconto: {
      color: '#8B4513',
      fontSize: '14px'
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

  return (
    <div style={styles.cupomItem}>
      <div style={styles.cupomInfo}>
        <div style={styles.cupomNome}>{nome}</div>
        <div style={styles.cupomDesconto}>{desconto}% de desconto</div>
      </div>
      <button style={styles.removerCupomButton} onClick={onRemover}>
        Remover
      </button>
    </div>
  );
};

export default CuponsSection;
`}
