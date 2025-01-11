import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import ReservaForm from './components/ReservaForm';
import PagamentoSection from './components/PagamentoSection';
import PixPopup from './components/PixPopup';

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
  const [chavePix, setChavePix] = useState('');
  const [cuponsDisponiveis, setCuponsDisponiveis] = useState([]);

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  async function fetchConfiguracoes() {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .single();

    if (!error) {
      setPrecos(data);
      setChavePix(data.chave_pix);
      setCuponsDisponiveis(data.cupons || []);
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
      alert(`Cupom "${cupomValido.nome}" aplicado com sucesso!`);
    } else {
      setDescontoAplicado(0);
      alert('Cupom inválido');
    }
  };

  const valorTotal = (nomes.reduce((total, _, index) => {
    if (index === 0) return total + precos.adulto;
    return total + (criancas[index] ? precos.crianca : precos.adulto);
  }, 0) * (1 - descontoAplicado/100)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('reservas')
        .insert([{
          nomes: nomes.filter((nome, index) => nome.trim() !== ''),
          criancas: criancas.filter((_, index) => nomes[index].trim() !== ''),
          telefone,
          pessoas,
          comprovante: comprovante ? comprovante.name : null,
          valor_total: valorTotal,
          chave_pix: chavePix,
          cupom: cupom || null,
          desconto: descontoAplicado
        }])
        .select();

      if (error) throw error;

      alert(`Reserva realizada com sucesso! ID: ${data[0].id}`);
      setPessoas(1);
      setNomes(['']);
      setCriancas([false]);
      setTelefone('');
      setComprovante(null);
      setCupom('');
      setDescontoAplicado(0);
    } catch (error) {
      alert('Erro ao salvar a reserva: ' + error.message);
    }
  };

  const handleClickPix = () => {
    setMostrarPopupPix(true);
    navigator.clipboard.writeText(chavePix);
    setMostrarAviso(true);
    setTimeout(() => setMostrarAviso(false), 2000);
  };

  const fecharPopupPix = () => {
    setMostrarPopupPix(false);
  };

  return (
    <div style={styles.container}>
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

      <PagamentoSection
        chavePix={chavePix}
        valorTotal={valorTotal}
        handleClickPix={handleClickPix}
        mostrarAviso={mostrarAviso}
        handleComprovanteChange={handleComprovanteChange}
      />

      <div style={styles.totalContainer}>
        <strong>Valor Total:</strong> R$ {valorTotal}
      </div>

      <button type="submit" style={styles.button} onClick={handleSubmit}>Reservar</button>

      {mostrarPopupPix && (
        <PixPopup
          valorTotal={valorTotal}
          fecharPopupPix={fecharPopupPix}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#F5F5DC',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'left',
    color: '#8B4513',
    marginBottom: '20px',
    paddingLeft: '10px'
  },
  totalContainer: {
    textAlign: 'right',
    fontSize: '18px',
    color: '#8B4513',
    margin: '10px 0',
    paddingRight: '10px'
  },
  button: {
    padding: '15px',
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

export default Reserva;
