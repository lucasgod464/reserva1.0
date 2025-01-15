import React, { useState } from 'react';
import './ReservaForm.css';

const ReservaForm = ({ 
  pessoas, 
  nomes, 
  criancas, 
  telefone, 
  cupom,
  precos,
  handlePessoasChange,
  handleNomeChange,
  handleCriancaChange,
  handleTelefoneChange,
  handleCupomChange,
  aplicarCupom
}) => {
  const [mostrarCupom, setMostrarCupom] = useState(false);

  return (
    <form className="form">
      <div className="inputGroup">
        <label className="label">Número de Pessoas:</label>
        <input
          className="input"
          type="number"
          min="1"
          value={pessoas}
          onChange={handlePessoasChange}
          required
        />
      </div>

      {nomes.map((nome, index) => (
        <div key={index} className={index === 0 ? "inputGroup" : "inputGroupDestaque"}>
          <label className="label">
            {index === 0 ? 'Nome do Responsável:' : `Nome da Pessoa ${index + 1}:`}
          </label>
          <input
            className="input"
            type="text"
            placeholder={index === 0 ? 'Nome do Responsável' : `Nome da Pessoa ${index + 1}`}
            value={nome}
            onChange={(e) => handleNomeChange(index, e.target.value)}
            required
          />
          {index > 0 && (
            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={criancas[index]}
                onChange={(e) => handleCriancaChange(index, e.target.checked)}
              />
              Criança (R$ {precos.crianca.toFixed(2)})
            </label>
          )}
        </div>
      ))}

      <div className="inputGroup">
        <label className="label">Telefone:</label>
        <input
          className="input"
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          required
        />
      </div>

      <div className="cupomContainer">
        {!mostrarCupom ? (
          <button 
            type="button" 
            className="mostrarCupomButton"
            onClick={() => setMostrarCupom(true)}
          >
            Tem um cupom de desconto?
          </button>
        ) : (
          <div className="cupomInputGroup">
            <input
              className="cupomInput"
              type="text"
              placeholder="Digite seu cupom"
              value={cupom}
              onChange={handleCupomChange}
            />
            <button 
              type="button" 
              className="cupomButton"
              onClick={aplicarCupom}
            >
              Aplicar
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default ReservaForm;
