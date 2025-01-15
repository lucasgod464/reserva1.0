import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import ConfiguracaoForm from './components/ConfiguracaoForm';
import ReservaCard from './components/ReservaCard';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './Admin.css';
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
  const [popupAtivo, setPopupAtivo] = useState(true);
  const [mapCenter, setMapCenter] = useState([-23.5505, -46.6333]);
  const [mapZoom, setMapZoom] = useState(12);

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
      setPopupAtivo(data.popup_ativo !== undefined ? data.popup_ativo : true);
      setMapCenter(data.map_center || [-23.5505, -46.6333]);
      setMapZoom(data.map_zoom || 12);
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
        descricao_popup: descricaoPopup,
        popup_ativo: popupAtivo,
        map_center: mapCenter,
        map_zoom: mapZoom
      });

    if (!error) {
      showNotification('Configurações atualizadas com sucesso!', 'success');
    } else {
      showNotification('Erro ao atualizar configurações: ' + error.message, 'error');
    }
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
    <div className="container">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <h1 className="title">Painel de Administração</h1>
      <ConfiguracaoForm
        precoAdulto={precoAdulto}
        precoCrianca={precoCrianca}
        chavePix={chavePix}
        tipoChavePix={tipoChavePix}
        cupons={cupons}
        novoCupom={novoCupom}
        tituloPopup={tituloPopup}
        descricaoPopup={descricaoPopup}
        popupAtivo={popupAtivo}
        setPrecoAdulto={setPrecoAdulto}
        setPrecoCrianca={setPrecoCrianca}
        setChavePix={setChavePix}
        setTipoChavePix={setTipoChavePix}
        setNovoCupom={setNovoCupom}
        setTituloPopup={setTituloPopup}
        setDescricaoPopup={setDescricaoPopup}
        setPopupAtivo={setPopupAtivo}
        salvarConfiguracoes={salvarConfiguracoes}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        setMapCenter={setMapCenter}
        setMapZoom={setMapZoom}
      />
      <div className="tabsContainer">
        <button
          className={abaAtiva === 'pendentes' ? 'tabAtiva' : 'tab'}
          onClick={() => setAbaAtiva('pendentes')}
        >
          Reservas Pendentes
        </button>
        <button
          className={abaAtiva === 'aprovadas' ? 'tabAtiva' : 'tab'}
          onClick={() => setAbaAtiva('aprovadas')}
        >
          Reservas Aprovadas
        </button>
      </div>
      <div className="filtroContainer">
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou ID"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="buscaInput"
          />
          <button className="searchButton" onClick={() => setTermoBusca('')}>
            {termoBusca ? '✕' : '🔍'}
          </button>
        </div>
        <select
          className="filtroSelect"
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
      {abaAtiva === 'pendentes' ? (
        <div className="reservasContainer">
          {reservasPendentes.length === 0 ? (
            <p className="semReservas">Nenhuma reserva pendente.</p>
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
        <div className="reservasContainer">
          <div className="exportButtonsContainer">
            <button className="exportButton" onClick={exportarPDF}>
              Exportar PDF
            </button>
            <button className="exportButton" onClick={exportarXLS}>
              Exportar XLS
            </button>
          </div>
          {reservasAprovadas.length === 0 ? (
            <p className="semReservas">Nenhuma reserva aprovada.</p>
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

export default Admin;
