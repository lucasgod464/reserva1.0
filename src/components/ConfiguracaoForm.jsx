import React, { useState } from 'react';
import './ConfiguracaoForm.css';

const ConfiguracaoForm = ({
  precoAdulto,
  precoCrianca,
  chavePix,
  tipoChavePix,
  cupons,
  novoCupom,
  tituloPopup,
  descricaoPopup,
  popupAtivo,
  setPrecoAdulto,
  setPrecoCrianca,
  setChavePix,
  setTipoChavePix,
  setNovoCupom,
  setTituloPopup,
  setDescricaoPopup,
  setPopupAtivo,
  salvarConfiguracoes,
  mapCenter,
  mapZoom,
  setMapCenter,
  setMapZoom
}) => {
  const [minimizado, setMinimizado] = useState(true);

  const handleNomeCupomChange = (e) => {
    setNovoCupom({ ...novoCupom, nome: e.target.value });
  };

  const handleDescontoCupomChange = (e) => {
    setNovoCupom({ ...novoCupom, desconto: parseFloat(e.target.value) });
  };

  const isCupomValido = novoCupom.nome && novoCupom.desconto > 0;

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

  const toggleMinimizado = () => {
    setMinimizado(!minimizado);
  };

  return (
    <div className="configuracaoContainer">
      <div className="headerContainer">
        <h2 className="subtitle">Configurações</h2>
        <button onClick={toggleMinimizado} className="minimizeButton">
          {minimizado ? 'Expandir' : 'Minimizar'}
        </button>
      </div>
      {!minimizado && (
        <>
          <div className="gridContainer">
            <div className="section">
              <h3 className="sectionTitle">Preços</h3>
              <div className="inputGroup">
                <label className="label">Preço para Adulto:</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={precoAdulto}
                  onChange={(e) => setPrecoAdulto(parseFloat(e.target.value))}
                />
              </div>
              <div className="inputGroup">
                <label className="label">Preço para Criança:</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={precoCrianca}
                  onChange={(e) => setPrecoCrianca(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="section">
              <h3 className="sectionTitle">Configurações PIX</h3>
              <div className="inputGroup">
                <label className="label">Tipo de Chave PIX:</label>
                <select
                  className="input"
                  value={tipoChavePix}
                  onChange={(e) => setTipoChavePix(e.target.value)}
                >
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">E-mail</option>
                  <option value="telefone">Telefone</option>
                  <option value="chaveAleatoria">Chave Aleatória</option>
                </select>
              </div>
              <div className="inputGroup">
                <label className="label">Chave PIX:</label>
                <input
                  className="input"
                  type="text"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="section">
            <h3 className="sectionTitle">Mensagem de Boas-Vindas</h3>
            <div className="popupToggleContainer">
              <label className="label">Ativar Popup:</label>
              <input
                type="checkbox"
                checked={popupAtivo}
                onChange={(e) => setPopupAtivo(e.target.checked)}
                className="checkbox"
              />
            </div>
            <div className="inputGroup">
              <label className="label">Título do Popup:</label>
              <input
                className="input"
                type="text"
                value={tituloPopup}
                onChange={(e) => setTituloPopup(e.target.value)}
                disabled={!popupAtivo}
              />
            </div>
            <div className="inputGroup">
              <label className="label">Descrição do Popup:</label>
              <textarea
                className="input"
                value={descricaoPopup}
                onChange={(e) => setDescricaoPopup(e.target.value)}
                disabled={!popupAtivo}
              />
            </div>
          </div>
          <div className="section">
            <h3 className="sectionTitle">Configurações do Mapa</h3>
            <div className="inputGroup">
              <label className="label">Centro do Mapa (Latitude, Longitude):</label>
              <input
                className="input"
                type="text"
                value={mapCenter.join(', ')}
                onChange={(e) => setMapCenter(e.target.value.split(',').map(parseFloat))}
              />
            </div>
            <div className="inputGroup">
              <label className="label">Zoom do Mapa:</label>
              <input
                className="input"
                type="number"
                value={mapZoom}
                onChange={(e) => setMapZoom(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
          <div className="cuponsContainer">
            <h3 className="sectionTitle">Cupons de Desconto</h3>
            <div className="novoCupomContainer">
              <div className="cupomInputGroup">
                <div className="inputGroup">
                  <label className="label">Nome do Cupom:</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Ex: DESCONTO10"
                    value={novoCupom.nome}
                    onChange={handleNomeCupomChange}
                  />
                </div>
                <div className="inputGroup">
                  <label className="label">Desconto (%):</label>
                  <div className="inputContainer">
                    <input
                      className="input"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0 a 100"
                      value={novoCupom.desconto}
                      onChange={handleDescontoCupomChange}
                    />
                    <span className="percentSymbol">%</span>
                  </div>
                </div>
              </div>
              <button
                className="cupomButton"
                onClick={adicionarCupom}
                disabled={!isCupomValido}
              >
                Adicionar Cupom
              </button>
            </div>
            {cupons.length > 0 ? (
              <div className="listaCupons">
                {cupons.map((cupom, index) => (
                  <div className="cupomItem" key={index}>
                    <div className="cupomInfo">
                      <div className="cupomNome">{cupom.nome}</div>
                      <div className="cupomDesconto">{cupom.desconto}% de desconto</div>
                    </div>
                    <button
                      className="removerCupomButton"
                      onClick={() => removerCupom(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="semCupons">
                Nenhum cupom cadastrado. Adicione um novo cupom acima.
              </div>
            )}
          </div>
          <div className="saveButtonContainer">
            <button className="button" onClick={salvarConfiguracoes}>
              Salvar Configurações
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfiguracaoForm;
