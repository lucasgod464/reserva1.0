CREATE TABLE configuracoes (
  id SERIAL PRIMARY KEY,
  adulto NUMERIC(10, 2) NOT NULL DEFAULT 69.90,
  crianca NUMERIC(10, 2) NOT NULL DEFAULT 34.95,
  chave_pix TEXT NOT NULL,
  tipo_chave_pix TEXT NOT NULL DEFAULT 'cpf',
  cupons JSONB DEFAULT '[]',
  titulo_popup TEXT NOT NULL DEFAULT 'Bem-vindo ao Rodízio!',
  descricao_popup TEXT NOT NULL DEFAULT 'Estamos felizes em tê-lo conosco. Aproveite nossa seleção de carnes e acompanhamentos.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_configuracoes_updated_at
BEFORE UPDATE ON configuracoes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações iniciais
INSERT INTO configuracoes (adulto, crianca, chave_pix, tipo_chave_pix, titulo_popup, descricao_popup)
VALUES (
  69.90,
  34.95,
  '123.456.789-00',
  'cpf',
  'Bem-vindo ao Rodízio!',
  'Estamos felizes em tê-lo conosco. Aproveite nossa seleção de carnes e acompanhamentos.'
);
