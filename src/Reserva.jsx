import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import ReservaForm from './components/ReservaForm';
import PagamentoSection from './components/PagamentoSection';
import PixPopup from './components/PixPopup';
import WelcomePopup from './components/WelcomePopup';
import './Reserva.css';
import Map from './components/Map';

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
  const [mapConfig, setMapConfig] = useState({ center: [-23.5505, -46.6333], zoom: 12 });

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
      setMapConfig({ center: data.map_center || [-23.5505, -46.6333], zoom: data.map_zoom || 12 });
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

  return (
    <div className="container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {showWelcomePopup && popupAtivo && (
        <WelcomePopup 
          onClose={() => setShowWelcomePopup(false)}
          titulo={tituloPopup}
          descricao={descricaoPopup}
        />
      )}
      <h1 className="title">Fazer Reserva</h1>
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
      <PagamentoSection
        chavepix={chavepix}
        tipo_chavepix={tipo_chavepix}
        valorTotal={valorTotal}
        handleClickPix={handleClickPix}
        mostrarAviso={mostrarAviso}
        handleComprovanteChange={handleComprovanteChange}
      />
      <button type="submit" className="button" onClick={handleSubmit}>Finalizar Reserva</button>
      <Map config={mapConfig} />
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
