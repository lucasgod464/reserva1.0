import React from 'react';

const ReservaCard = ({ reserva, index, onAprovar }) => {
  const calcularTotais = (criancas) => {
    const totalAdultos = criancas.filter((crianca) => !crianca).length;
    const totalCriancas = criancas.filter((crianca) => crianca).length;
    return { totalAdultos, totalCriancas };
  };

  const { totalAdultos, totalCriancas } = calcularTotais(reserva.criancas);

  // URL do comprovante no Supabase Storage
  const comprovanteUrl = `https://vpteneqwgfifezlnzxtu.supabase.co/storage/v1/object/public/comprovantes/${reserva.comprovante}`;

  const handleVerComprovante = () => {
    // Abre o comprovante em uma nova aba
    window.open(comprovanteUrl, '_blank');
  };

  return (
    <div style={styles.reservaCard}>
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
        <p><strong>Chave PIX:</strong> {reserva.chavepix}</p>
        <p><strong>Comprovante:</strong> {reserva.comprovante || 'Não enviado'}</p>
        <p><strong>Cupom Aplicado:</strong> {reserva.cupom || 'Nenhum'}</p>
        <p><strong>Desconto Aplicado:</strong> {reserva.desconto || 0}%</p>
      </div>
      {reserva.comprovante && (
        <button 
          style={styles.comprovanteButton}
          onClick={handleVerComprovante}
        >
          Ver Comprovante
        </button>
      )}
      {!reserva.aprovada && (
        <button 
          style={styles.aprovarButton}
          onClick={onAprovar}
        >
          Aprovar Reserva
        </button>
      )}
    </div>
  );
};

const styles = {
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
  },
  comprovanteButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '10px',
    '&:hover': {
      backgroundColor: '#A0522D'
    }
  },
  aprovarButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#228B22',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#1E7A1E'
    }
  }
};

export default ReservaCard;
