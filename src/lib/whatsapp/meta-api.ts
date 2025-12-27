// Integração com Meta WhatsApp Cloud API

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'

// Credenciais centralizadas do operador (definidas no .env)
export function getOperatorCredentials() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  }
}

interface VerifyPhoneResult {
  valid: boolean
  whatsapp_id?: string
  error?: string
}

// Verificar se o numero esta registrado no WhatsApp
export async function verifyWhatsAppNumber(phone: string): Promise<VerifyPhoneResult> {
  const { phoneNumberId, accessToken } = getOperatorCredentials()

  if (!phoneNumberId || !accessToken) {
    // Se nao tem credenciais, retorna como valido (nao pode verificar)
    return { valid: true, error: 'Credenciais WhatsApp nao configuradas' }
  }

  const formattedPhone = formatPhoneNumber(phone)

  // Primeiro valida o formato do numero brasileiro
  if (!isValidBrazilianMobile(formattedPhone)) {
    return { valid: false, error: 'Numero de celular brasileiro invalido' }
  }

  try {
    // Usa o endpoint de mensagens com mensagem tipo "text" para verificar
    // A Meta valida o contato antes de tentar enviar
    // Usamos uma abordagem alternativa: verificar via API de contatos
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: '✅ Seu numero foi verificado! Em breve entraremos em contato com informacoes sobre o RecuperaTuba.',
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Erro 131030 = numero nao registrado no WhatsApp
      // Erro 131026 = numero invalido
      const errorCode = data?.error?.code
      if (errorCode === 131030 || errorCode === 131026) {
        return { valid: false, error: 'Numero nao registrado no WhatsApp' }
      }
      // Outros erros - assumir que o problema e do lado da API
      console.error('Erro ao verificar WhatsApp:', data)
      return { valid: true, error: 'Erro ao verificar, numero aceito' }
    }

    // Mensagem enviada com sucesso = numero valido no WhatsApp
    const whatsapp_id = data.contacts?.[0]?.wa_id
    return { valid: true, whatsapp_id }
  } catch (error) {
    console.error('Erro na verificacao WhatsApp:', error)
    // Em caso de erro de rede, aceita o numero
    return { valid: true, error: 'Erro de conexao, numero aceito' }
  }
}

// Validar formato de celular brasileiro
export function isValidBrazilianMobile(phone: string): boolean {
  // Remove 55 do inicio se tiver
  let numero = phone.replace(/^55/, '')

  // Deve ter 10 ou 11 digitos (DDD + numero)
  if (numero.length < 10 || numero.length > 11) {
    return false
  }

  // DDD valido (11-99)
  const ddd = parseInt(numero.substring(0, 2))
  if (ddd < 11 || ddd > 99) {
    return false
  }

  // DDDs validos no Brasil
  const dddsValidos = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
    21, 22, 24, // RJ
    27, 28, // ES
    31, 32, 33, 34, 35, 37, 38, // MG
    41, 42, 43, 44, 45, 46, // PR
    47, 48, 49, // SC
    51, 53, 54, 55, // RS
    61, // DF
    62, 64, // GO
    63, // TO
    65, 66, // MT
    67, // MS
    68, // AC
    69, // RO
    71, 73, 74, 75, 77, // BA
    79, // SE
    81, 87, // PE
    82, // AL
    83, // PB
    84, // RN
    85, 88, // CE
    86, 89, // PI
    91, 93, 94, // PA
    92, 97, // AM
    95, // RR
    96, // AP
    98, 99, // MA
  ]

  if (!dddsValidos.includes(ddd)) {
    return false
  }

  // Celular deve comecar com 9 (apos o DDD)
  const primeiroDigito = numero.substring(2, 3)
  if (primeiroDigito !== '9') {
    return false
  }

  return true
}

interface SendMessageOptions {
  phoneNumberId: string
  accessToken: string
  to: string
  message: string
}

interface SendTemplateOptions {
  phoneNumberId: string
  accessToken: string
  to: string
  templateName: string
  languageCode?: string
  components?: Array<{
    type: 'header' | 'body' | 'button'
    parameters: Array<{
      type: 'text' | 'currency' | 'date_time'
      text?: string
      currency?: { fallback_value: string; code: string; amount_1000: number }
      date_time?: { fallback_value: string }
    }>
  }>
}

interface WhatsAppApiResponse {
  messaging_product: string
  contacts: Array<{ input: string; wa_id: string }>
  messages: Array<{ id: string }>
}

export async function sendTextMessage({
  phoneNumberId,
  accessToken,
  to,
  message,
}: SendMessageOptions): Promise<WhatsAppApiResponse> {
  // Formatar numero (remover caracteres nao numericos e adicionar 55 se necessario)
  const formattedPhone = formatPhoneNumber(to)

  const response = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export async function sendTemplateMessage({
  phoneNumberId,
  accessToken,
  to,
  templateName,
  languageCode = 'pt_BR',
  components,
}: SendTemplateOptions): Promise<WhatsAppApiResponse> {
  const formattedPhone = formatPhoneNumber(to)

  const body: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedPhone,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
    },
  }

  if (components) {
    (body.template as Record<string, unknown>).components = components
  }

  const response = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export function formatPhoneNumber(phone: string): string {
  // Remove caracteres nao numericos
  let cleaned = phone.replace(/\D/g, '')

  // Adiciona codigo do pais se nao tiver
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned
  }

  return cleaned
}

// Templates pre-definidos para cobranca
export const TEMPLATES = {
  // Lembrete D-2 (2 dias antes do vencimento)
  LEMBRETE_D2: (nome: string, loja: string, valor: string, vencimento: string) =>
    `Oi, ${nome}! Tudo bem? Passando para lembrar que sua parcela na ${loja} vence em 2 dias (${vencimento}). O valor e de ${valor}. Posso te mandar o Pix para facilitar? Responda SIM para receber.`,

  // Aviso D-0 (dia do vencimento)
  AVISO_D0: (nome: string, loja: string, valor: string) =>
    `Ola ${nome}! Sua parcela na ${loja} vence hoje no valor de ${valor}. Evite juros e pague agora! Responda QUERO PIX para receber o codigo.`,

  // Cobranca D+5 (5 dias apos vencimento)
  COBRANCA_D5: (nome: string, loja: string, valor: string, dias: number) =>
    `Oi ${nome}, notamos que sua parcela na ${loja} esta em atraso ha ${dias} dias. O valor atual e ${valor}. Se estiver com dificuldades, responda esta mensagem para negociarmos!`,

  // Cobranca D+15
  COBRANCA_D15: (nome: string, loja: string, valor: string) =>
    `${nome}, sua divida com a ${loja} continua pendente. Valor: ${valor}. Queremos ajudar voce a regularizar! Responda para conversarmos sobre opcoes de pagamento.`,

  // Cobranca D+30
  COBRANCA_D30: (nome: string, loja: string, valor: string) =>
    `Ultimo aviso, ${nome}. Sua divida com a ${loja} no valor de ${valor} precisa ser regularizada. Estamos dispostos a negociar. Responda NEGOCIAR para falarmos.`,

  // Confirmacao de pagamento
  PAGAMENTO_CONFIRMADO: (nome: string, loja: string, valor: string) =>
    `${nome}, seu pagamento de ${valor} foi confirmado! Obrigado por regularizar com a ${loja}. Ficamos a disposicao!`,

  // Envio de Pix
  ENVIO_PIX: (nome: string, valor: string, pixCopiaECola: string) =>
    `${nome}, aqui esta o Pix para pagamento:\n\nValor: ${valor}\n\nPix Copia e Cola:\n${pixCopiaECola}\n\nApós o pagamento, voce recebera a confirmacao automaticamente.`,
}

// Detectar intencao do cliente na mensagem
export function detectIntent(message: string): 'pagar' | 'negociar' | 'duvida' | 'reclamacao' | 'outro' {
  const lower = message.toLowerCase().trim()

  // Intencao de pagar
  const payKeywords = [
    'sim', 'quero', 'pix', 'pagar', 'quero pagar', 'vou pagar',
    'pode mandar', 'manda', 'envie', 'envia', 'quero pix',
    'ok', 'blz', 'beleza', 'pode ser', 'manda o pix',
    'quero receber', 'aceito'
  ]
  if (payKeywords.some(kw => lower.includes(kw))) {
    return 'pagar'
  }

  // Intencao de negociar
  const negotiateKeywords = [
    'negociar', 'parcelar', 'dividir', 'desconto', 'dificuldade',
    'nao tenho', 'sem dinheiro', 'apertado', 'complicado',
    'pode parcelar', 'tem como', 'consegue'
  ]
  if (negotiateKeywords.some(kw => lower.includes(kw))) {
    return 'negociar'
  }

  // Duvida
  const questionKeywords = [
    'qual', 'quanto', 'quando', 'como', 'onde', 'porque',
    '?', 'nao entendi', 'explica', 'duvida'
  ]
  if (questionKeywords.some(kw => lower.includes(kw))) {
    return 'duvida'
  }

  // Reclamacao
  const complaintKeywords = [
    'absurdo', 'cobranca indevida', 'ja paguei', 'errado',
    'nao devo', 'engano', 'processo', 'procon'
  ]
  if (complaintKeywords.some(kw => lower.includes(kw))) {
    return 'reclamacao'
  }

  return 'outro'
}
