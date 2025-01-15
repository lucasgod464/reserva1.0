{`import React from 'react';

const PrecosSection = ({ precoAdulto, precoCrianca, setPrecoAdulto, setPrecoCrianca, InputField }) => {
  const styles = {
    section: {
      padding: '15px',
      backgroundColor: '#FFF8DC',
      border: '1px solid #8B4513',
      borderRadius: '5px'
    },
    sectionTitle: {
      color: '#8B4513',
      marginBottom: '15px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Preços</h3>
      <InputField
        label="Preço para Adulto:"
        type="number"
        step="0.01"
        value={precoAdulto}
        onChange={(e) => setPrecoAdulto(parseFloat(e.target.value))}
      />
      <InputField
        label="Preço para Criança:"
        type="number"
        step="0.01"
        value={precoCrianca}
        onChange={(e) => setPrecoCrianca(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default PrecosSection;
`}
