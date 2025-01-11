import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import ConfiguracaoForm from './components/ConfiguracaoForm';
import ReservaCard from './components/ReservaCard';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Admin = () => {
  const [reservas, setReservas] = useState([]);
  const [precoAdulto, setPrecoAdulto] = useState(69.90);
  const [precoCrianca, setPrecoCrianca] = useState(34.95);
  const [chavePix, setChavePix] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState('cpf');
  const [cupons, setCupons] = useState([]);
  const [novoCupom, setNovoCupom] = useState({ nome: '', desconto: 0 });
  const [abaAtiva, setAbaAtiva] = useState('pendentes');

  useEffect(() => {
    fetchReservas();
    fetchConfiguracoes();
  }, []);

  const fetchReservas = async () => {
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setReservas(data);
  };

  const fetchConfiguracoes = async () => {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .single();

    if (!error) {
      setPrecoAdulto(data.adulto);
      setPrecoCrianca(data.crianca);
      setChavePix(data.chave_pix);
      setTipoChavePix(data.tipo_chave_pix || 'cpf');
      setCupons(data.cupons || []);
    }
  };

  const exportarPDF = () => {
    const reservasAprovadas = reservas.filter(reserva => reserva.aprovada);
    const doc = new jsPDF();

    const headers = [['Nome', 'Tipo', 'Valor Adulto', 'Valor Criança']];
    const data = reservasAprovadas.flatMap(reserva => 
      reserva.nomes.map((nome, index) => [
        nome,
        reserva.criancas[index] ? 'Criança' : 'Adulto',
        reserva.criancas[index] ? '' : `R$ ${precoAdulto.toFixed(2)}`,
        reserva.criancas[index] ? `R$ ${precoCrianca.toFixed(2)}` : ''
      ])
    );

    doc.text('Relatório de Reservas Aprovadas', 14, 15);
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center'
      },
      headStyles: {
        fillColor: [135, 206, 235], // Azul claro
        textColor: [0, 0, 0]
      }
    });

    doc.save('reservas-aprovadas.pdf');
  };

  const exportarXLS = () => {
    const reservasAprovadas = reservas.filter(reserva => reserva.aprovada);
    const data = reservasAprovadas.flatMap(reserva => 
      reserva.nomes.map((nome, index) => ({
        Nome: nome,
        Tipo: reserva.criancas[index] ? 'Criança' : 'Adulto',
        'Valor Adulto': reserva.criancas[index] ? '' : `R$ ${precoAdulto.toFixed(2)}`,
        'Valor Criança': reserva.criancas[index] ? `R$ ${precoCrianca.toFixed(2)}` : ''
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    XLSX.writeFile(workbook, 'reservas-aprovadas.xlsx');
  };

  const salvarConfiguracoes = async () => {
    const { error } = await supabase
      .from('configuracoes')
      .upsert({ 
        id: 1, 
        adulto: precoAdulto, 
        crianca: precoCrianca,
        chave_pix: chavePix,
        tipo_chave_pix: tipoChavePix,
        cupons: cupons
      });

    if (!error) {
      alert('Configurações atualizadas com sucesso!');
    } else {
      alert('Erro ao atualizar configurações: ' + error.message);
    }
  };

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

  const aprovarReserva = async (id) => {
    const { error } = await supabase
      .from('reservas')
      .update({ aprovada: true })
      .eq('id', id);

    if (!error) {
      fetchReservas();
      alert('Reserva aprovada com sucesso!');
    } else {
      alert('Erro ao aprovar reserva: ' + error.message);
    }
  };

  const reservasPendentes = reservas.filter((reserva) => !reserva.aprovada);
  const reservasAprovadas = reservas.filter((reserva) => reserva.aprovada);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Painel de Administração</h1>

      <ConfiguracaoForm
        precoAdulto={precoAdulto}
        precoCrianca={precoCrianca}
        chavePix={chavePix}
        tipoChavePix={tipoChavePix}
        cupons={cupons}
        novoCupom={novoCupom}
        setPrecoAdulto={setPrecoAdulto}
        setPrecoCrianca={setPrecoCrianca}
        setChavePix={setChavePix}
        setTipoChavePix={setTipoChavePix}
        setNovoCupom={setNovoCupom}
        adicionarCupom={adicionarCupom}
        removerCupom={removerCupom}
        salvarConfiguracoes={salvarConfiguracoes}
      />

      <div style={styles.tabsContainer}>
        <button
          style={abaAtiva === 'pendentes' ? styles.tabAtiva : styles.tab}
          onClick={() => setAbaAtiva('pendentes')}
        >
          Reservas Pendentes
        </button>
        <button
          style={abaAtiva === 'aprovadas' ? styles.tabAtiva : styles.tab}
          onClick={() => setAbaAtiva('aprovadas')}
        >
          Reservas Aprovadas
        </button>
      </div>

      {abaAtiva === 'pendentes' ? (
        <div style={styles.reservasContainer}>
          {reservasPendentes.length === 0 ? (
            <p style={styles.semReservas}>Nenhuma reserva pendente.</p>
          ) : (
            reservasPendentes.map((reserva, index) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                index={index}
                onAprovar={() => aprovarReserva(reserva.id)}
              />
            ))
          )}
        </div>
      ) : (
        <div style={styles.reservasContainer}>
          <div style={styles.exportButtons}>
            <button style={styles.exportButton} onClick={exportarPDF}>
              Exportar PDF
            </button>
            <button style={styles.exportButton} onClick={exportarXLS}>
              Exportar XLS
            </button>
          </div>

          {reservasAprovadas.length === 0 ? (
            <p style={styles.semReservas}>Nenhuma reserva aprovada.</p>
          ) : (
            reservasAprovadas.map((reserva, index) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                index={index}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#FFF8DC',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#8B4513',
    marginBottom: '20px'
  },
  exportButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  exportButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#87CEEB', // Azul claro
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#6CA6CD' // Azul claro mais escuro no hover
    }
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
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
  tabAtiva: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#A0522D',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  reservasContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  semReservas: {
    textAlign: 'center',
    color: '#8B4513',
    fontSize: '18px'
  }
};

export default Admin;
