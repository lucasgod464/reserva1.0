{`import React, { useState } from 'react';
import PrecosSection from './PrecosSection';
import PixSection from './PixSection';
import MensagemBoasVindasSection from './MensagemBoasVindasSection';
import CuponsSection from './CuponsSection';
import { InputField, SelectField } from './FormFields';

const ConfiguracaoForm = ({
  precoAdulto,
  precoCrianca,
  chavePix,
  tipoChavePix,
  cupons,
  novoCupom,
  tituloPopup,
  descricaoPopup,
  popupAtivo,
  fontsizepopup,
  setPrecoAdulto,
  setPrecoCrianca,
  setChavePix,
  setTipoChavePix,
  setNovoCupom,
  setTituloPopup,
  setDescricaoPopup,
  setPopupAtivo,
  setFontSizePopup,
  salvarConfiguracoes
}) => {
  const [minimizado, setMinimizado] = useState(true);

  const toggleMinimizado = () => {
    setMinimizado(!minimizado);
  };

  const styles = {
    configuracaoContainer: {
      marginBottom: '40px',
      padding: '20px',
      backgroundColor: '#F5F5DC',
      border: '2px solid #8B4513',
      borderRadius: '10px'
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    subtitle: {
      color: '#8B4513',
      margin: 0
    },
    minimizeButton: {
      padding: '5px 10px',
      fontSize: '14px',
      backgroundColor: '#8B4513',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    saveButtonContainer: {
      marginTop: '30px',
      textAlign: 'center'
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
    }
  };

  return (
    <div style={styles.configuracaoContainer}>
      <div style={styles.headerContainer}>
        <h2 style={styles.subtitle}>Configurações</h2>
        <button onClick={toggleMinimizado} style={styles.minimizeButton}>
          {minimizado ? 'Expandir' : 'Minimizar'}
        </button>
      </div>
      <div style={{ display: minimizado ? 'none' : 'block' }}>
        <PrecosSection
          precoAdulto={precoAdulto}
          precoCrianca={precoCrianca}
          setPrecoAdulto={setPrecoAdulto}
          setPrecoCrianca={setPrecoCrianca}
          InputField={InputField}
        />
        <PixSection
          chavePix={chavePix}
          tipoChavePix={tipoChavePix}
          setChavePix={setChavePix}
          setTipoChavePix={setTipoChavePix}
          SelectField={SelectField}
          InputField={InputField}
        />
        <MensagemBoasVindasSection
          tituloPopup={tituloPopup}
          descricaoPopup={descricaoPopup}
          popupAtivo={popupAtivo}
          fontsizepopup={fontsizepopup}
          setTituloPopup={setTituloPopup}
          setDescricaoPopup={setDescricaoPopup}
          setPopupAtivo={setPopupAtivo}
          setFontSizePopup={setFontSizePopup}
          InputField={InputField}
        />
        <CuponsSection
          cupons={cupons}
          novoCupom={novoCupom}
          setCupons={setCupons}
          setNovoCupom={setNovoCupom}
        />
        <div style={styles.saveButtonContainer}>
          <button style={styles.button} onClick={salvarConfiguracoes}>
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracaoForm;
`}
