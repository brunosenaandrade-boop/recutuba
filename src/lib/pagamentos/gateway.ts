// Interface abstrata para gateways de pagamento

export interface PixCobranca {
  valor: number
  descricao: string
  devedor: {
    nome: string
    telefone: string
    cpf?: string
  }
  expiracao?: number // em segundos
}

export interface PixResponse {
  id: string
  pix_copia_cola: string
  qr_code_url: string
  qr_code_base64?: string
  status: string
  valor: number
}

export interface PaymentGateway {
  name: string
  createPixCharge(cobranca: PixCobranca): Promise<PixResponse>
  getChargeStatus(chargeId: string): Promise<{ status: string; pago_em?: string }>
}

// Factory para criar gateway baseado na configuracao
export function createPaymentGateway(
  gateway: 'asaas' | 'efi' | 'mercadopago',
  apiKey: string
): PaymentGateway {
  switch (gateway) {
    case 'asaas':
      return new AsaasGateway(apiKey)
    case 'efi':
      return new EfiGateway(apiKey)
    case 'mercadopago':
      return new MercadoPagoGateway(apiKey)
    default:
      throw new Error(`Gateway ${gateway} nao suportado`)
  }
}

// Implementacao Asaas
class AsaasGateway implements PaymentGateway {
  name = 'asaas'
  private apiKey: string
  private baseUrl = 'https://api.asaas.com/v3'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createPixCharge(cobranca: PixCobranca): Promise<PixResponse> {
    // Primeiro, criar ou buscar cliente
    const customerResponse = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: cobranca.devedor.nome,
        phone: cobranca.devedor.telefone,
        cpfCnpj: cobranca.devedor.cpf || '00000000000', // CPF generico se nao informado
      }),
    })

    const customer = await customerResponse.json()

    // Criar cobranca Pix
    const chargeResponse = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: 'PIX',
        value: cobranca.valor,
        description: cobranca.descricao,
        dueDate: new Date(Date.now() + (cobranca.expiracao || 86400) * 1000).toISOString().split('T')[0],
      }),
    })

    const charge = await chargeResponse.json()

    // Buscar QR Code
    const qrCodeResponse = await fetch(`${this.baseUrl}/payments/${charge.id}/pixQrCode`, {
      headers: {
        'access_token': this.apiKey,
      },
    })

    const qrCode = await qrCodeResponse.json()

    return {
      id: charge.id,
      pix_copia_cola: qrCode.payload,
      qr_code_url: qrCode.encodedImage ? `data:image/png;base64,${qrCode.encodedImage}` : '',
      qr_code_base64: qrCode.encodedImage,
      status: charge.status,
      valor: charge.value,
    }
  }

  async getChargeStatus(chargeId: string): Promise<{ status: string; pago_em?: string }> {
    const response = await fetch(`${this.baseUrl}/payments/${chargeId}`, {
      headers: {
        'access_token': this.apiKey,
      },
    })

    const charge = await response.json()

    return {
      status: charge.status === 'RECEIVED' || charge.status === 'CONFIRMED' ? 'pago' : 'pendente',
      pago_em: charge.paymentDate,
    }
  }
}

// Implementacao Efi (Gerencianet)
class EfiGateway implements PaymentGateway {
  name = 'efi'
  private credentials: string

  constructor(credentials: string) {
    // credentials no formato "client_id:client_secret"
    this.credentials = credentials
  }

  async createPixCharge(cobranca: PixCobranca): Promise<PixResponse> {
    // Obter token de acesso
    const [clientId, clientSecret] = this.credentials.split(':')
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const tokenResponse = await fetch('https://pix.api.efipay.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grant_type: 'client_credentials' }),
    })

    const { access_token } = await tokenResponse.json()

    // Criar cobranca
    const txid = `REC${Date.now()}`
    const chargeResponse = await fetch(`https://pix.api.efipay.com.br/v2/cob/${txid}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendario: {
          expiracao: cobranca.expiracao || 86400,
        },
        devedor: {
          nome: cobranca.devedor.nome,
          cpf: cobranca.devedor.cpf || '00000000000',
        },
        valor: {
          original: cobranca.valor.toFixed(2),
        },
        chave: process.env.EFI_PIX_KEY || '', // Chave Pix cadastrada na Efi
        solicitacaoPagador: cobranca.descricao,
      }),
    })

    const charge = await chargeResponse.json()

    // Gerar QR Code
    const qrResponse = await fetch(`https://pix.api.efipay.com.br/v2/loc/${charge.loc.id}/qrcode`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    const qrCode = await qrResponse.json()

    return {
      id: txid,
      pix_copia_cola: qrCode.qrcode,
      qr_code_url: qrCode.imagemQrcode,
      status: 'pendente',
      valor: cobranca.valor,
    }
  }

  async getChargeStatus(chargeId: string): Promise<{ status: string; pago_em?: string }> {
    const [clientId, clientSecret] = this.credentials.split(':')
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const tokenResponse = await fetch('https://pix.api.efipay.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grant_type: 'client_credentials' }),
    })

    const { access_token } = await tokenResponse.json()

    const response = await fetch(`https://pix.api.efipay.com.br/v2/cob/${chargeId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    const charge = await response.json()

    return {
      status: charge.status === 'CONCLUIDA' ? 'pago' : 'pendente',
      pago_em: charge.pix?.[0]?.horario,
    }
  }
}

// Implementacao Mercado Pago
class MercadoPagoGateway implements PaymentGateway {
  name = 'mercadopago'
  private accessToken: string
  private baseUrl = 'https://api.mercadopago.com'

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async createPixCharge(cobranca: PixCobranca): Promise<PixResponse> {
    const response = await fetch(`${this.baseUrl}/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `REC${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: cobranca.valor,
        description: cobranca.descricao,
        payment_method_id: 'pix',
        payer: {
          first_name: cobranca.devedor.nome.split(' ')[0],
          last_name: cobranca.devedor.nome.split(' ').slice(1).join(' ') || 'Cliente',
          email: 'cliente@email.com', // Email generico
        },
      }),
    })

    const payment = await response.json()

    return {
      id: payment.id.toString(),
      pix_copia_cola: payment.point_of_interaction?.transaction_data?.qr_code || '',
      qr_code_url: payment.point_of_interaction?.transaction_data?.qr_code_base64
        ? `data:image/png;base64,${payment.point_of_interaction.transaction_data.qr_code_base64}`
        : '',
      qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      status: payment.status,
      valor: payment.transaction_amount,
    }
  }

  async getChargeStatus(chargeId: string): Promise<{ status: string; pago_em?: string }> {
    const response = await fetch(`${this.baseUrl}/v1/payments/${chargeId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    })

    const payment = await response.json()

    return {
      status: payment.status === 'approved' ? 'pago' : 'pendente',
      pago_em: payment.date_approved,
    }
  }
}
