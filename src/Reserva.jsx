import React, { useState } from 'react';

    export default function Reserva() {
      const [pessoas, setPessoas] = useState(1);
      const [nomes, setNomes] = useState(['']);
      const [criancas, setCriancas] = useState([false]);
      const [telefone, setTelefone] = useState('');
      const [comprovante, setComprovante] = useState(null);
      const [chavePix, setChavePix] = useState(gerarChavePix());
      const [mostrarAviso, setMostrarAviso] = useState(false);
      const [mostrarPopupPix, setMostrarPopupPix] = useState(false);

      function gerarChavePix() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let chave = '';
        for (let i = 0; i < 20; i++) {
          chave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return chave;
      }

      const copiarChavePix = () => {
        const input = document.createElement('input');
        input.value = chavePix;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setMostrarAviso(true);
        setTimeout(() => setMostrarAviso(false), 2000);
      };

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

      const handleComprovanteChange = (e) => {
        setComprovante(e.target.files[0]);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        try {
          const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
          const novaReserva = {
            id: Date.now(),
            nomes: nomes.filter((nome, index) => nome.trim() !== ''),
            criancas: criancas.filter((_, index) => nomes[index].trim() !== ''),
            telefone,
            pessoas,
            chavePix,
            comprovante: comprovante ? comprovante.name : null
          };

          reservas.push(novaReserva);
          localStorage.setItem('reservas', JSON.stringify(reservas));

          alert(`Reserva realizada com sucesso! ID: ${novaReserva.id}`);
          setPessoas(1);
          setNomes(['']);
          setCriancas([false]);
          setTelefone('');
          setComprovante(null);
          setChavePix(gerarChavePix());
        } catch (error) {
          alert('Erro ao salvar a reserva: ' + error.message);
        }
      };

      const valorTotal = nomes.reduce((total, _, index) => {
        if (index === 0) return total + 69.90;
        return total + (criancas[index] ? 34.95 : 69.90);
      }, 0).toFixed(2);

      const handleClickPix = () => {
        setMostrarPopupPix(true);
        copiarChavePix();
      };

      const fecharPopupPix = () => {
        setMostrarPopupPix(false);
      };

      return (
        <div style={styles.container}>
          <h1 style={styles.title}>Fazer Reserva</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Número de Pessoas:</label>
              <input
                style={styles.input}
                type="number"
                min="1"
                value={pessoas}
                onChange={handlePessoasChange}
                required
              />
            </div>

            {nomes.map((nome, index) => (
              <div key={index} style={index === 0 ? styles.inputGroup : styles.inputGroupDestaque}>
                <label style={styles.label}>
                  {index === 0 ? 'Nome do Responsável:' : `Nome da Pessoa ${index + 1}:`}
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder={index === 0 ? 'Nome do Responsável' : `Nome da Pessoa ${index + 1}`}
                  value={nome}
                  onChange={(e) => handleNomeChange(index, e.target.value)}
                  required
                />
                {index > 0 && (
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={criancas[index]}
                      onChange={(e) => handleCriancaChange(index, e.target.checked)}
                    />
                    Criança (R$ 34,95)
                  </label>
                )}
              </div>
            ))}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Telefone:</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div style={styles.pagamentoContainer}>
              <h3 style={styles.pagamentoTitle}>Pagamento</h3>
              <div style={styles.pixContainer} onClick={handleClickPix}>
                <strong>Chave PIX:</strong> {chavePix}
              </div>
              {mostrarAviso && (
                <div style={styles.aviso}>
                  Chave PIX copiada com sucesso!
                </div>
              )}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Enviar Comprovante:</label>
                <input
                  style={styles.input}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleComprovanteChange}
                  required
                />
              </div>
            </div>

            <div style={styles.totalContainer}>
              <strong>Valor Total:</strong> R$ {valorTotal}
            </div>

            <button type="submit" style={styles.button}>Reservar</button>
          </form>

          {mostrarPopupPix && (
            <div style={styles.popupOverlay}>
              <div style={styles.popup}>
                <h3 style={styles.popupTitle}>Efetue o Pagamento</h3>
                <p style={styles.popupText}>
                  Chave PIX copiada! Efetue o pagamento de R$ {valorTotal} e clique em "Já fiz o pagamento" para continuar.
                </p>
                <button style={styles.popupButton} onClick={fecharPopupPix}>
                  Já fiz o pagamento
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

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
      form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      },
      inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        paddingLeft: '10px'
      },
      inputGroupDestaque: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '15px',
        backgroundColor: '#FFF8DC',
        border: '2px solid #8B4513',
        borderRadius: '5px',
        marginBottom: '10px'
      },
      label: {
        fontSize: '14px',
        color: '#8B4513'
      },
      input: {
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #8B4513',
        borderRadius: '5px',
        backgroundColor: '#FFF8DC'
      },
      checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#8B4513'
      },
      pagamentoContainer: {
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #8B4513',
        borderRadius: '5px',
        backgroundColor: '#FFF8DC'
      },
      pagamentoTitle: {
        marginBottom: '10px',
        color: '#8B4513'
      },
      pixContainer: {
        marginBottom: '15px',
        fontSize: '16px',
        color: '#8B4513',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      aviso: {
        marginBottom: '15px',
        color: '#228B22',
        fontSize: '14px'
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
      },
      popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      popup: {
        backgroundColor: '#FFF8DC',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        textAlign: 'center'
      },
      popupTitle: {
        color: '#8B4513',
        marginBottom: '15px'
      },
      popupText: {
        color: '#8B4513',
        marginBottom: '20px'
      },
      popupButton: {
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
