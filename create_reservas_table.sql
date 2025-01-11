CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  nomes TEXT[] NOT NULL,
  criancas BOOLEAN[] NOT NULL,
  telefone TEXT NOT NULL,
  pessoas INTEGER NOT NULL,
  comprovante TEXT,
  valor_total NUMERIC(10, 2) NOT NULL,
  chavepix TEXT NOT NULL,
  tipo_chavepix TEXT NOT NULL DEFAULT 'cpf',
  cupom TEXT,
  desconto NUMERIC(5, 2) DEFAULT 0,
  aprovada BOOLEAN DEFAULT FALSE,
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

CREATE TRIGGER update_reservas_updated_at
BEFORE UPDATE ON reservas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
