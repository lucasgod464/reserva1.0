{`import React from 'react';

const MensagemBoasVindasSection = ({
  tituloPopup,
  descricaoPopup,
  popupAtivo,
  fontsizepopup,
  setTituloPopup,
  setDescricaoPopup,
  setPopupAtivo,
  setFontSizePopup,
  InputField
}) => {
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
    },
    popupToggleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '15px'
    },
    label: {
      fontSize: '14px',
      color: '#8B4513'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Mensagem de Boas-Vindas</h3>
      <div style={styles.popupToggleContainer}>
        <label style={styles.label}>Ativar Popup:</label>
        <input
          type="checkbox"
          checked={popupAtivo}
          onChange={(e) => setPopupAtivo(e.target.checked)}
          style={styles.checkbox}
        />
      </div>
      <InputField
        label="Título do Popup:"
        type="text"
        value={tituloPopup}
        onChange={(e) => setTituloPopup(e.target.value)}
        disabled={!popupAtivo}
      />
      <InputField
        label="Descrição do Popup:"
        type="text"
        value={descricaoPopup}
        onChange={(e) => setDescricaoPopup(e.target.value)}
        textarea
        disabled={!popupAtivo}
      />
      <InputField
        label="Tamanho da Fonte (px):"
        type="number"
        min="10"
        max="30"
        value={fontsizepopup}
        onChange={(e) => setFontSizePopup(parseInt(e.target.value, 10))}
        disabled={!popupAtivo}
      />
    </div>
  );
};

export default MensagemBoasVindasSection;
`}
