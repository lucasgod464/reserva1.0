import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import ReservaForm from './components/ReservaForm';
import PagamentoSection from './components/PagamentoSection';
import PixPopup from './components/PixPopup';
import Notification from './components/Notification';
import WelcomePopup from './components/WelcomePopup';

const Reserva = () => {
  const [pessoas, setPessoas] = useState(1);
  const [nomes, setNomes] = useState(['']);
  const [criancas, setCriancas] = useState([false]);
  const [telefone, setTelefone] = useState('');
  const [comprovante, setComprovante] = useState(null);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mostrarPopupPix, setMostrarPopupPix] = useState(false);
  const [precos, setPrecos] = useState({ adulto: 69.90, crianca: 34.95 });
  const [cupom, setCupom] = useState('');
  const [descontoAplicado, setDescontoAplicado] = useState(0);
  const [chavepix, setChavepix] = useState('');
  const [tipo_chavepix, setTipoChavepix] = useState('cpf');
  const [cuponsDisponiveis, setCuponsDisponiveis] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [popupAtivo, setPopupAtivo] = useState(true);
  const [tituloPopup, setTituloPopup] = useState('');
  const [descricaoPopup, setDescricaoPopup] = useState('');
  const endereco = 'Rua Juiz David Barrilli, 376 - Jardim Aquarius, São José dos Campos - SP, 12246-200';

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  async function fetchConfiguracoes() {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .single();

    if (!error) {
      setPrecos({ adulto: data.adulto, crianca: data.crianca });
      setChavepix(data.chave_pix);
      setTipoChavepix(data.tipo_chave_pix || 'cpf');
      setCuponsDisponiveis(data.cupons || []);
      setTituloPopup(data.titulo_popup || 'Bem-vindo ao Rodízio!');
      setDescricaoPopup(data.descricao_popup || 'Estamos felizes em tê-lo conosco. Aproveite nossa seleção de carnes e acompanhamentos.');
      setPopupAtivo(data.popup_ativo);
      setShowWelcomePopup(data.popup_ativo);
    }
  }

  const handlePessoasChange = (e) => {
    const numPessoas = parseInt(e.target.value, 10);
    setPessoas(numPessoas);
    setNomes(Array(numPessoas).fill(''));
    setCriancas(Array(numPessoas).fill(false));
  };

  const handleNomeChange = (index, value) => {
    const novosNomes = [...nomes];
    novosNomes[index] = value;
    setNomes(novosNomes);
  };

  const handleCriancaChange = (index, isCrianca) => {
    const novasCriancas = [...criancas];
    novasCriancas[index] = isCrianca;
    setCriancas(novasCriancas);
  };

  const handleTelefoneChange = (e) => {
    setTelefone(e.target.value);
  };

  const handleComprovanteChange = (e) => {
    setComprovante(e.target.files[0]);
  };

  const handleCupomChange = (e) => {
    setCupom(e.target.value);
  };

  const aplicarCupom = () => {
    const cupomValido = cuponsDisponiveis.find(c => c.nome === cupom);
    if (cupomValido) {
      setDescontoAplicado(cupomValido.desconto);
      showNotification('Cupom aplicado com sucesso!', 'success');
    } else {
      setDescontoAplicado(0);
      showNotification('Cupom inválido', 'error');
    }
  };

  const valorTotal = (nomes.reduce((total, _, index) => {
    if (index === 0) return total + precos.adulto;
    return total + (criancas[index] ? precos.crianca : precos.adulto);
  }, 0) * (1 - descontoAplicado/100)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nomesPreenchidos = nomes.every(nome => nome.trim() !== '');
    if (!nomesPreenchidos) {
      showNotification('Preencha todos os nomes', 'error');
      return;
    }

    if (!telefone.trim()) {
      showNotification('Informe um número de telefone', 'error');
      return;
    }

    if (!comprovante) {
      showNotification('Envie o comprovante de pagamento', 'error');
      return;
    }

    try {
      let comprovanteNome = null;

      if (comprovante) {
        const extensao = comprovante.name.split('.').pop();
        comprovanteNome = `comprovante_${Date.now()}.${extensao}`;

        const { error: uploadError } = await supabase
          .storage
          .from('comprovantes')
          .upload(comprovanteNome, comprovante);

        if (uploadError) throw uploadError;
      }

      const { data, error } = await supabase
        .from('reservas')
        .insert([{
          nomes: nomes.filter((nome, index) => nome.trim() !== ''),
          criancas: criancas.filter((_, index) => nomes[index].trim() !== ''),
          telefone,
          pessoas,
          comprovante: comprovanteNome,
          valor_total: valorTotal,
          chavepix: chavepix,
          tipo_chavepix: tipo_chavepix,
          cupom: cupom || null,
          desconto: descontoAplicado
        }])
        .select();

      if (error) throw error;

      showNotification('Reserva realizada com sucesso!', 'success');
      setPessoas(1);
      setNomes(['']);
      setCriancas([false]);
      setTelefone('');
      setComprovante(null);
      setCupom('');
      setDescontoAplicado(0);
    } catch (error) {
      showNotification('Erro ao salvar a reserva', 'error');
    }
  };

  const handleClickPix = () => {
    setMostrarPopupPix(true);
    navigator.clipboard.writeText(chavepix);
    setMostrarAviso(true);
    setTimeout(() => setMostrarAviso(false), 2000);
  };

  const fecharPopupPix = () => {
    setMostrarPopupPix(false);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(endereco)
      .then(() => showNotification('Endereço copiado para a área de transferência!', 'success'))
      .catch(err => showNotification('Erro ao copiar endereço: ' + err, 'error'));
  };

  const handleOpenMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`, '_blank');
  };

  const styles = {
    container: {
      maxWidth: '600px',
      width: '100%',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#F5F5DC',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box'
    },
    title: {
      textAlign: 'left',
      color: '#8B4513',
      marginBottom: '20px',
      paddingLeft: '10px',
      fontSize: '24px'
    },
    button: {
      padding: '15px',
      fontSize: '16px',
      backgroundColor: '#8B4513',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      width: '100%',
      marginTop: '20px',
      '&:hover': {
        backgroundColor: '#A0522D'
      }
    },
    addressContainer: {
      marginTop: '20px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    addressTitle: {
      fontSize: '18px',
      color: '#8B4513',
      marginBottom: '10px',
      fontWeight: 'bold'
    },
    addressText: {
      fontSize: '16px',
      color: '#8B4513',
      marginBottom: '10px'
    },
    addressButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px'
    },
    addressButton: {
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

  return (
    <div style={styles.container}>
      {notification && <Notification message={notification.message} type={notification.type} />}
      {showWelcomePopup && popupAtivo && (
        <WelcomePopup
          onClose={() => setShowWelcomePopup(false)}
          titulo={tituloPopup}
          descricao={descricaoPopup}
        />
      )}

      <h1 style={styles.title}>Fazer Reserva</h1>

      <ReservaForm
        pessoas={pessoas}
        nomes={nomes}
        criancas={criancas}
        telefone={telefone}
        cupom={cupom}
        precos={precos}
        handlePessoasChange={handlePessoasChange}
        handleNomeChange={handleNomeChange}
        handleCriancaChange={handleCriancaChange}
        handleTelefoneChange={handleTelefoneChange}
        handleCupomChange={handleCupomChange}
        aplicarCupom={aplicarCupom}
      />

      <div style={styles.addressContainer}>
        <h3 style={styles.addressTitle}>Local do Rodízio</h3>
        <p style={styles.addressText}>Endereço: {endereco}</p>
        <div style={styles.addressButtons}>
          <button style={styles.addressButton} onClick={handleOpenMaps}>Abrir no Google Maps</button>
          <button style={styles.addressButton} onClick={handleCopyAddress}>Copiar Endereço</button>
        </div>
      </div>

      <PagamentoSection
        chavepix={chavepix}
        tipo_chavepix={tipo_chavepix}
        valorTotal={valorTotal}
        handleClickPix={handleClickPix}
        mostrarAviso={mostrarAviso}
        handleComprovanteChange={handleComprovanteChange}
      />

      <button type="submit" style={styles.button} onClick={handleSubmit}>Finalizar Reserva</button>

      {mostrarPopupPix && (
        <PixPopup
          valorTotal={valorTotal}
          fecharPopupPix={fecharPopupPix}
        />
      )}
    </div>
  );
};

export default Reserva;
