// Tipos principais do RecuperaTuba

export interface Config {
  id: string
  nome_loja: string
  telefone_whatsapp: string | null
  email: string | null
  whatsapp_phone_number_id: string | null
  whatsapp_access_token: string | null
  gateway_pagamento: 'asaas' | 'efi' | 'mercadopago' | null
  gateway_api_key: string | null
  notificar_whatsapp: boolean
  notificar_email: boolean
  created_at: string
}

export interface Divida {
  id: string
  nome_devedor: string
  telefone: string
  valor: number
  data_vencimento: string
  status: 'pendente' | 'pago' | 'renegociando' | 'cancelado'
  observacoes: string | null
  created_at: string
  updated_at: string
}

export interface Mensagem {
  id: string
  divida_id: string
  direcao: 'enviada' | 'recebida'
  conteudo: string
  tipo: 'texto' | 'template' | 'pix'
  status: 'enviada' | 'entregue' | 'lida' | 'falha'
  whatsapp_message_id: string | null
  created_at: string
}

export interface Renegociacao {
  id: string
  divida_id: string
  mensagem_interesse: string | null
  status: 'novo' | 'em_contato' | 'resolvido' | 'perdido'
  lojista_notificado: boolean
  created_at: string
  updated_at: string
  // Relacionamentos
  divida?: Divida
}

export interface CobrancaPix {
  id: string
  divida_id: string
  gateway: 'asaas' | 'efi' | 'mercadopago'
  gateway_id: string | null
  valor: number
  pix_copia_cola: string | null
  qr_code_url: string | null
  status: 'pendente' | 'pago' | 'expirado'
  pago_em: string | null
  created_at: string
}

export interface ReguaExecucao {
  id: string
  divida_id: string
  etapa: 'D-2' | 'D0' | 'D+5' | 'D+15' | 'D+30'
  executado_em: string
  mensagem_id: string | null
}

// Tipos para formulários
export interface DividaFormData {
  nome_devedor: string
  telefone: string
  valor: number
  data_vencimento: string
  observacoes?: string
}

export interface ImportacaoPlanilha {
  nome_devedor: string
  telefone: string
  valor: number
  data_vencimento: string
}

// Tipos para dashboard
export interface DashboardMetricas {
  total_inadimplente: number
  total_recuperado: number
  total_dividas: number
  dividas_pendentes: number
  dividas_pagas: number
  renegociacoes_novas: number
}

// Tipos para WhatsApp
export interface WhatsAppMessage {
  from: string
  id: string
  timestamp: string
  text?: {
    body: string
  }
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'sticker' | 'location' | 'contacts'
}

export interface WhatsAppWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: {
            name: string
          }
          wa_id: string
        }>
        messages?: WhatsAppMessage[]
        statuses?: Array<{
          id: string
          status: 'sent' | 'delivered' | 'read' | 'failed'
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

// Tipos para gateways de pagamento
export interface PixCobranca {
  valor: number
  descricao: string
  devedor: {
    nome: string
    telefone: string
  }
}

export interface PixResponse {
  id: string
  pix_copia_cola: string
  qr_code_url: string
  status: string
}
