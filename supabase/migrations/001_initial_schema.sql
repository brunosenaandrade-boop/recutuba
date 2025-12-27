-- RecuperaTuba - Schema Inicial
-- Execute este SQL no Supabase SQL Editor

-- Configurações do lojista
CREATE TABLE IF NOT EXISTS config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_loja TEXT NOT NULL,
  telefone_whatsapp TEXT,
  email TEXT,
  whatsapp_phone_number_id TEXT,
  whatsapp_access_token TEXT,
  gateway_pagamento TEXT CHECK (gateway_pagamento IN ('asaas', 'efi', 'mercadopago')),
  gateway_api_key TEXT,
  notificar_whatsapp BOOLEAN DEFAULT true,
  notificar_email BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Dívidas dos clientes
CREATE TABLE IF NOT EXISTS dividas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_devedor TEXT NOT NULL,
  telefone TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'renegociando', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mensagens enviadas/recebidas
CREATE TABLE IF NOT EXISTS mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  divida_id UUID REFERENCES dividas(id) ON DELETE CASCADE,
  direcao TEXT NOT NULL CHECK (direcao IN ('enviada', 'recebida')),
  conteudo TEXT NOT NULL,
  tipo TEXT DEFAULT 'texto' CHECK (tipo IN ('texto', 'template', 'pix')),
  status TEXT DEFAULT 'enviada' CHECK (status IN ('enviada', 'entregue', 'lida', 'falha')),
  whatsapp_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Renegociações (leads para o lojista)
CREATE TABLE IF NOT EXISTS renegociacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  divida_id UUID REFERENCES dividas(id) ON DELETE CASCADE UNIQUE,
  mensagem_interesse TEXT,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'em_contato', 'resolvido', 'perdido')),
  lojista_notificado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cobranças Pix geradas
CREATE TABLE IF NOT EXISTS cobrancas_pix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  divida_id UUID REFERENCES dividas(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL CHECK (gateway IN ('asaas', 'efi', 'mercadopago')),
  gateway_id TEXT,
  valor DECIMAL(10,2) NOT NULL,
  pix_copia_cola TEXT,
  qr_code_url TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'expirado')),
  pago_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Régua de cobrança executada
CREATE TABLE IF NOT EXISTS regua_execucoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  divida_id UUID REFERENCES dividas(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL CHECK (etapa IN ('D-2', 'D0', 'D+5', 'D+15', 'D+30')),
  executado_em TIMESTAMPTZ DEFAULT now(),
  mensagem_id UUID REFERENCES mensagens(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_dividas_user_id ON dividas(user_id);
CREATE INDEX IF NOT EXISTS idx_dividas_status ON dividas(status);
CREATE INDEX IF NOT EXISTS idx_dividas_vencimento ON dividas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_mensagens_divida_id ON mensagens(divida_id);
CREATE INDEX IF NOT EXISTS idx_renegociacoes_status ON renegociacoes(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_pix_status ON cobrancas_pix(status);

-- RLS (Row Level Security)
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE renegociacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobrancas_pix ENABLE ROW LEVEL SECURITY;
ALTER TABLE regua_execucoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Usuário só vê seus próprios dados
CREATE POLICY "Users can view own config" ON config FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own config" ON config FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own config" ON config FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own dividas" ON dividas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dividas" ON dividas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dividas" ON dividas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dividas" ON dividas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own mensagens" ON mensagens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mensagens" ON mensagens FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own renegociacoes" ON renegociacoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own renegociacoes" ON renegociacoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own renegociacoes" ON renegociacoes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cobrancas_pix" ON cobrancas_pix FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cobrancas_pix" ON cobrancas_pix FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cobrancas_pix" ON cobrancas_pix FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own regua_execucoes" ON regua_execucoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own regua_execucoes" ON regua_execucoes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_dividas_updated_at
  BEFORE UPDATE ON dividas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_renegociacoes_updated_at
  BEFORE UPDATE ON renegociacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
