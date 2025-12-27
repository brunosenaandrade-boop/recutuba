import { NextRequest, NextResponse } from 'next/server'
import { verifyWhatsAppNumber, isValidBrazilianMobile, formatPhoneNumber } from '@/lib/whatsapp/meta-api'

// POST - Verificar numero de WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { whatsapp } = body

    if (!whatsapp) {
      return NextResponse.json(
        { valid: false, error: 'WhatsApp e obrigatorio' },
        { status: 400 }
      )
    }

    // Limpar telefone
    const whatsappLimpo = whatsapp.replace(/\D/g, '')

    // Validar formato basico
    if (whatsappLimpo.length < 10) {
      return NextResponse.json({
        valid: false,
        error: 'Numero muito curto'
      })
    }

    const formattedPhone = formatPhoneNumber(whatsappLimpo)

    // Validar se e celular brasileiro valido
    if (!isValidBrazilianMobile(formattedPhone)) {
      return NextResponse.json({
        valid: false,
        error: 'Informe um numero de celular brasileiro valido'
      })
    }

    // Verificar se esta registrado no WhatsApp
    const result = await verifyWhatsAppNumber(whatsappLimpo)

    if (!result.valid) {
      return NextResponse.json({
        valid: false,
        error: result.error || 'Numero nao encontrado no WhatsApp'
      })
    }

    return NextResponse.json({
      valid: true,
      whatsapp_id: result.whatsapp_id,
      message: 'Numero verificado com sucesso!'
    })
  } catch (error) {
    console.error('Erro na verificacao:', error)
    return NextResponse.json(
      { valid: false, error: 'Erro ao verificar numero' },
      { status: 500 }
    )
  }
}
