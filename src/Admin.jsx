import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import ConfiguracaoForm from './components/ConfiguracaoForm';
import ReservaCard from './components/ReservaCard';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Notification from './components/Notification';

const Admin = () => {
  const [reservas, setReservas] = useState([]);
  const [precoAdulto, setPrecoAdulto] = useState(69.90);
  const [precoCrianca, setPrecoCrianca] = useState(34.95);
  const [chavePix, setChavePix] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState('cpf');
  const [cupons, setCupons] = useState([]);
  const [novoCupom, setNovoCupom] = useState({ nome: '', desconto: 0 });
  const [abaAtiva, setAbaAtiva] = useState('pendentes');
  const [notification, setNotification] = useState(null);
  const [filtroCupom, setFiltroCupom] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [tituloPopup, setTituloPopup] = useState('Bem-vindo ao Rodízio!');
  const [descricaoPopup, setDescricaoPopup] = useState('Estamos felizes em tê-lo conosco. Aproveite nossa seleção de carnes e acompanhamentos.');

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

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
      setTituloPopup(data.titulo_popup || 'Bem-vindo ao Rodízio!');
      setDescricaoPopup(data.descricao_popup || 'Estamos felizes em tê-lo conosco. Aproveite nossa seleção de carnes e acompanhamentos.');
    }
  };

  const exportarPDF = () => {
    const reservasFiltradas = filtrarReservas(reservasAprovadas);
    const doc = new jsPDF();

    const headers = [['Nome', 'Tipo', 'Valor Adulto', 'Valor Criança']];
    const data = reservasFiltradas.flatMap(reserva => 
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
        fillColor: [139, 69, 19],
        textColor: [255, 255, 255]
      }
    });

    doc.save('reservas-aprovadas.pdf');
  };

  const exportarXLS = () => {
    const reservasFiltradas = filtrarReservas(reservasAprovadas);
    const data = reservasFiltradas.flatMap(reserva => 
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

  const filtrarReservas = (reservas) => {
    let reservasFiltradas = reservas;

    if (termoBusca) {
      const busca = termoBusca.toLowerCase();
      reservasFiltradas = reservasFiltradas.filter(reserva =>
        reserva.nomes.some(nome => nome.toLowerCase().includes(busca)) ||
        reserva.telefone.includes(busca) ||
        reserva.id.toString().includes(busca)
      );
    }

    if (filtroCupom) {
      reservasFiltradas = reservasFiltradas.filter(reserva => reserva.cupom === filtroCupom);
    }

    return reservasFiltradas;
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
        cupons: cupons,
        titulo_popup: tituloPopup,
        descricao_popup: descricaoPopup
      });

    if (!error) {
      showNotification('Configurações atualizadas com sucesso!', 'success');
    } else {
      showNotification('Erro ao atualizar configurações: ' + error.message, 'error');
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
      showNotification('Reserva aprovada com sucesso!', 'success');
    } else {
      showNotification('Erro ao aprovar reserva: ' + error.message, 'error');
    }
  };

  const reservasPendentes = filtrarReservas(reservas.filter((reserva) => !reserva.aprovada));
  const reservasAprovadas = filtrarReservas(reservas.filter((reserva) => reserva.aprovada));

  return (
    <div style={styles.container}>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <h1 style={styles.title}>Painel de Administração</h1>

      <ConfiguracaoForm
        precoAdulto={precoAdulto}
        precoCrianca={precoCrianca}
        chavePix={chavePix}
        tipoChavePix={tipoChavePix}
        cupons={cupons}
        novoCupom={novoCupom}
        tituloPopup={tituloPopup}
        descricaoPopup={descricaoPopup}
        setPrecoAdulto={setPrecoAdulto}
        setPrecoCrianca={setPrecoCrianca}
        setChavePix={setChavePix}
        setTipoChavePix={setTipoChavePix}
        setNovoCupom={setNovoCupom}
        setTituloPopup={setTituloPopup}
        setDescricaoPopup={setDescricaoPopup}
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
          <div style={styles.filtroContainer}>
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou ID"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={styles.buscaInput}
            />
            <select
              style={styles.filtroSelect}
              value={filtroCupom}
              onChange={(e) => setFiltroCupom(e.target.value)}
            >
              <option value="">Todos os Cupons</option>
              {cupons.map((cupom, index) => (
                <option key={index} value={cupom.nome}>
                  {cupom.nome} ({cupom.desconto}%)
                </option>
              ))}
            </select>
          </div>

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
          <div style={styles.filtroContainer}>
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou ID"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={styles.buscaInput}
            />
            <select
              style={styles.filtroSelect}
              value={filtroCupom}
              onChange={(e) => setFiltroCupom(e.target.value)}
            >
              <option value="">Todos os Cupons</option>
              {cupons.map((cupom, index) => (
                <option key={index} value={cupom.nome}>
                  {cupom.nome} ({cupom.desconto}%)
                </option>
              ))}
            </select>
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
  filtroContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center'
  },
  buscaInput: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC',
    color: '#8B4513',
    flex: 2
  },
  filtroSelect: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC',
    color: '#8B4513',
    flex: 1
  },
  exportButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#87CEEB',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#6CA6CD'
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
