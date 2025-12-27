import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendTextMessage, TEMPLATES } from '@/lib/whatsapp/meta-api'

// Webhook para receber notificacoes de pagamento dos gateways
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const gateway = request.nextUrl.searchParams.get('gateway')

    const supabase = createServiceClient()

    let gatewayId: string | null = null
    let isPago = false

    // Processar payload baseado no gateway
    if (gateway === 'asaas') {
      // Asaas webhook
      if (body.event === 'PAYMENT_RECEIVED' || body.event === 'PAYMENT_CONFIRMED') {
        gatewayId = body.payment?.id
        isPago = true
      }
    } else if (gateway === 'efi') {
      // Efi webhook
      if (body.pix && body.pix.length > 0) {
        gatewayId = body.pix[0].txid
        isPago = true
      }
    } else if (gateway === 'mercadopago') {
      // Mercado Pago webhook
      if (body.type === 'payment' && body.action === 'payment.updated') {
        const paymentId = body.data?.id
        if (paymentId) {
          // Buscar status do pagamento
          gatewayId = paymentId.toString()
          // Verificar se foi aprovado
          isPago = body.data?.status === 'approved'
        }
      }
    }

    if (!gatewayId || !isPago) {
      return NextResponse.json({ status: 'ignored' })
    }

    // Buscar cobranca pelo gateway_id
    const { data: cobranca } = await supabase
      .from('cobrancas_pix')
      .select(`
        *,
        divida:dividas(*)
      `)
      .eq('gateway_id', gatewayId)
      .single()

    if (!cobranca) {
      console.log('Cobranca nao encontrada para gateway_id:', gatewayId)
      return NextResponse.json({ status: 'not_found' })
    }

    // Buscar config do usuario
    const { data: config } = await supabase
      .from('config')
      .select('*')
      .eq('user_id', cobranca.user_id)
      .single()

    // Atualizar status da cobranca
    await supabase
      .from('cobrancas_pix')
      .update({
        status: 'pago',
        pago_em: new Date().toISOString(),
      })
      .eq('id', cobranca.id)

    // Atualizar status da divida
    await supabase
      .from('dividas')
      .update({ status: 'pago' })
      .eq('id', cobranca.divida_id)

    // Atualizar renegociacao se existir
    await supabase
      .from('renegociacoes')
      .update({ status: 'resolvido' })
      .eq('divida_id', cobranca.divida_id)

    // Enviar mensagem de confirmacao
    const divida = cobranca.divida

    if (config?.whatsapp_phone_number_id && config?.whatsapp_access_token && divida) {
      const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(divida.valor)

      const mensagem = TEMPLATES.PAGAMENTO_CONFIRMADO(
        divida.nome_devedor,
        config.nome_loja || 'nossa loja',
        valorFormatado
      )

      try {
        const result = await sendTextMessage({
          phoneNumberId: config.whatsapp_phone_number_id,
          accessToken: config.whatsapp_access_token,
          to: divida.telefone,
          message: mensagem,
        })

        // Salvar mensagem
        await supabase.from('mensagens').insert({
          user_id: cobranca.user_id,
          divida_id: divida.id,
          direcao: 'enviada',
          conteudo: mensagem,
          tipo: 'texto',
          status: 'enviada',
          whatsapp_message_id: result.messages[0]?.id,
        })
      } catch (err) {
        console.error('Erro ao enviar mensagem de confirmacao:', err)
      }
    }

    console.log(`Pagamento confirmado: ${gatewayId}`)
    return NextResponse.json({ status: 'processed' })
  } catch (error) {
    console.error('Erro no webhook de pagamentos:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
