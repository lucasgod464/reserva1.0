import React from 'react';

const ReservaCard = ({ reserva, index, onAprovar }) => {
  const calcularTotais = (criancas) => {
    const totalAdultos = criancas.filter((crianca) => !crianca).length;
    const totalCriancas = criancas.filter((crianca) => crianca).length;
    return { totalAdultos, totalCriancas };
  };

  const { totalAdultos, totalCriancas } = calcularTotais(reserva.criancas);

  const comprovanteUrl = `https://vpteneqwgfifezlnzxtu.supabase.co/storage/v1/object/public/comprovantes/${reserva.comprovante}`;

  const handleVerComprovante = () => {
    window.open(comprovanteUrl, '_blank');
  };

  return (
    <div style={styles.reservaCard}>
      <div style={styles.header}>
        <h3 style={styles.reservaTitle}>Reserva #{index + 1}</h3>
        <div style={styles.statusBadge}>
          {reserva.aprovada ? (
            <span style={styles.aprovada}>Aprovada</span>
          ) : (
            <span style={styles.pendente}>Pendente</span>
          )}
        </div>
      </div>

      <div style={styles.reservaInfo}>
        <div style={styles.gridContainer}>
          <div style={styles.gridItem}>
            <strong>ID:</strong> {reserva.id}
          </div>
          <div style={styles.gridItem}>
            <strong>Telefone:</strong> {reserva.telefone}
          </div>
          <div style={styles.gridItem}>
            <strong>Cupom:</strong> {reserva.cupom || 'Nenhum'}
          </div>
          <div style={styles.gridItem}>
            <strong>Desconto:</strong> {reserva.desconto || 0}%
          </div>
        </div>

        <div style={styles.totaisContainer}>
          <div style={styles.totalBox}>
            <strong>Adultos:</strong> {totalAdultos}
          </div>
          <div style={styles.totalBox}>
            <strong>Crianças:</strong> {totalCriancas}
          </div>
        </div>

        <div style={styles.nomesContainer}>
          <strong>Nomes:</strong>
          <ul style={styles.listaNomes}>
            {reserva.nomes.map((nome, i) => (
              <li key={i} style={styles.nomeItem}>
                {nome} {reserva.criancas[i] ? '(Criança)' : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={styles.buttonsContainer}>
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
    </div>
  );
};

const styles = {
  reservaCard: {
    backgroundColor: '#F5F5DC',
    padding: '15px',
    border: '2px solid #8B4513',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  reservaTitle: {
    color: '#8B4513',
    margin: 0,
    fontSize: '18px'
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  aprovada: {
    color: '#228B22',
    backgroundColor: '#F0FFF0',
    padding: '3px 8px',
    borderRadius: '5px'
  },
  pendente: {
    color: '#DC3545',
    backgroundColor: '#FFF0F0',
    padding: '3px 8px',
    borderRadius: '5px'
  },
  reservaInfo: {
    color: '#8B4513',
    lineHeight: '1.4',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginBottom: '10px'
  },
  gridItem: {
    fontSize: '14px'
  },
  totaisContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px'
  },
  totalBox: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#FFF8DC',
    border: '1px solid #8B4513',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '14px'
  },
  nomesContainer: {
    marginBottom: '10px'
  },
  listaNomes: {
    margin: '5px 0 0 0',
    paddingLeft: '20px',
    color: '#8B4513',
    listStyleType: 'disc',
    fontSize: '14px'
  },
  nomeItem: {
    marginBottom: '3px'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px'
  },
  comprovanteButton: {
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
  },
  aprovarButton: {
    padding: '8px 15px',
    fontSize: '14px',
    backgroundColor: '#228B22',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1E7A1E'
    }
  }
};

export default ReservaCard;
