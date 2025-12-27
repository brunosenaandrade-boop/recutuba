-- RecuperaTuba - Tabela de Leads
-- Execute este SQL no Supabase SQL Editor

-- Leads capturados na landing page
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  nome_loja TEXT,
  origem TEXT DEFAULT 'landing_page',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  convertido BOOLEAN DEFAULT false,
  convertido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_convertido ON leads(convertido);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção anônima (captura de leads)
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Política para admin/service role ver todos os leads
CREATE POLICY "Service role can view all leads" ON leads FOR SELECT USING (true);
