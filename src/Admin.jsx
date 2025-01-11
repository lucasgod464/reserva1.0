import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function Admin() {
  const [reservas, setReservas] = useState([]);
  const [precoAdulto, setPrecoAdulto] = useState(69.90);
  const [precoCrianca, setPrecoCrianca] = useState(34.95);

  useEffect(() => {
    fetchReservas();
    fetchPrecos();
  }, []);

  const fetchReservas = async () => {
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setReservas(data);
  };

  const fetchPrecos = async () => {
    const { data, error } = await supabase
      .from('precos')
      .select('*')
      .single();

    if (!error) {
      setPrecoAdulto(data.adulto);
      setPrecoCrianca(data.crianca);
    }
  };

  const salvarPrecos = async () => {
    const { error } = await supabase
      .from('precos')
      .upsert({ id: 1, adulto: precoAdulto, crianca: precoCrianca });

    if (!error) {
      alert('Preços atualizados com sucesso!');
    } else {
      alert('Erro ao atualizar preços: ' + error.message);
    }
  };

  const calcularTotais = (criancas) => {
    const totalAdultos = criancas.filter((crianca) => !crianca).length;
    const totalCriancas = criancas.filter((crianca) => crianca).length;
    return { totalAdultos, totalCriancas };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Painel de Administração</h1>

      <div style={styles.configuracaoContainer}>
        <h2 style={styles.subtitle}>Configurar Preços</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Preço para Adulto:</label>
          <input
            style={styles.input}
            type="number"
            step="0.01"
            value={precoAdulto}
            onChange={(e) => setPrecoAdulto(parseFloat(e.target.value))}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Preço para Criança:</label>
          <input
            style={styles.input}
            type="number"
            step="0.01"
            value={precoCrianca}
            onChange={(e) => setPrecoCrianca(parseFloat(e.target.value))}
          />
        </div>
        <button style={styles.button} onClick={salvarPrecos}>
          Salvar Preços
        </button>
      </div>

      <h2 style={styles.subtitle}>Reservas Cadastradas</h2>
      {reservas.length === 0 ? (
        <p style={styles.semReservas}>Nenhuma reserva cadastrada.</p>
      ) : (
        <div style={styles.reservasContainer}>
          {reservas.map((reserva, index) => {
            const { totalAdultos, totalCriancas } = calcularTotais(reserva.criancas);

            return (
              <div key={reserva.id} style={styles.reservaCard}>
                <h3 style={styles.reservaTitle}>Reserva #{index + 1}</h3>
                <div style={styles.reservaInfo}>
                  <p><strong>ID:</strong> {reserva.id}</p>
                  <p><strong>Nomes:</strong></p>
                  <ul style={styles.listaNomes}>
                    {reserva.nomes.map((nome, i) => (
                      <li key={i}>
                        {nome} {reserva.criancas[i] ? '(Criança)' : ''}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Telefone:</strong> {reserva.telefone}</p>
                  <p><strong>Número de Pessoas:</strong> {reserva.pessoas}</p>
                  <div style={styles.totaisContainer}>
                    <div style={styles.totalBox}>
                      <strong>Adultos:</strong> {totalAdultos}
                    </div>
                    <div style={styles.totalBox}>
                      <strong>Crianças:</strong> {totalCriancas}
                    </div>
                  </div>
                  <p><strong>Chave PIX:</strong> {reserva.chave_pix}</p>
                  <p><strong>Comprovante:</strong> {reserva.comprovante || 'Não enviado'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  subtitle: {
    textAlign: 'center',
    color: '#8B4513',
    marginBottom: '30px'
  },
  configuracaoContainer: {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#F5F5DC',
    border: '2px solid #8B4513',
    borderRadius: '10px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginBottom: '15px'
  },
  label: {
    fontSize: '14px',
    color: '#8B4513'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    backgroundColor: '#FFF8DC'
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
  },
  semReservas: {
    textAlign: 'center',
    color: '#8B4513',
    fontSize: '18px'
  },
  reservasContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  reservaCard: {
    backgroundColor: '#F5F5DC',
    padding: '20px',
    border: '2px solid #8B4513',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  reservaTitle: {
    color: '#8B4513',
    marginBottom: '15px'
  },
  reservaInfo: {
    color: '#8B4513',
    lineHeight: '1.6'
  },
  listaNomes: {
    margin: '10px 0',
    paddingLeft: '20px',
    color: '#8B4513'
  },
  totaisContainer: {
    display: 'flex',
    gap: '20px',
    margin: '15px 0'
  },
  totalBox: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#FFF8DC',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    textAlign: 'center',
    color: '#8B4513'
  }
};
