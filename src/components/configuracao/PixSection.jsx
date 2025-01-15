{`import React from 'react';

const PixSection = ({ chavePix, tipoChavePix, setChavePix, setTipoChavePix, SelectField, InputField }) => {
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
      <h3 style={styles.sectionTitle}>Configurações PIX</h3>
      <SelectField
        label="Tipo de Chave PIX:"
        value={tipoChavePix}
        onChange={(e) => setTipoChavePix(e.target.value)}
        options={[
          { value: 'cpf', label: 'CPF' },
          { value: 'cnpj', label: 'CNPJ' },
          { value: 'email', label: 'E-mail' },
          { value: 'telefone', label: 'Telefone' },
          { value: 'chaveAleatoria', label: 'Chave Aleatória' }
        ]}
      />
      <InputField
        label="Chave PIX:"
        type="text"
        value={chavePix}
        onChange={(e) => setChavePix(e.target.value)}
      />
    </div>
  );
};

export default PixSection;
`}
