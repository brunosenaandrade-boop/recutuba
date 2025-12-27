import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentGateway } from '@/lib/pagamentos/gateway'
import { sendTextMessage, TEMPLATES } from '@/lib/whatsapp/meta-api'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticacao
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { divida_id, enviar_whatsapp = true } = body

    if (!divida_id) {
      return NextResponse.json(
        { error: 'divida_id e obrigatorio' },
        { status: 400 }
      )
    }

    // Buscar divida
    const { data: divida, error: dividaError } = await supabase
      .from('dividas')
      .select('*')
      .eq('id', divida_id)
      .eq('user_id', user.id)
      .single()

    if (dividaError || !divida) {
      return NextResponse.json({ error: 'Divida nao encontrada' }, { status: 404 })
    }

    // Buscar config do lojista
    const { data: config } = await supabase
      .from('config')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!config?.gateway_pagamento || !config?.gateway_api_key) {
      return NextResponse.json(
        { error: 'Gateway de pagamento nao configurado. Acesse Configuracoes.' },
        { status: 400 }
      )
    }

    // Criar gateway
    const gateway = createPaymentGateway(
      config.gateway_pagamento as 'asaas' | 'efi' | 'mercadopago',
      config.gateway_api_key
    )

    // Gerar cobranca Pix
    const pixResponse = await gateway.createPixCharge({
      valor: divida.valor,
      descricao: `Cobranca ${config.nome_loja} - ${divida.nome_devedor}`,
      devedor: {
        nome: divida.nome_devedor,
        telefone: divida.telefone,
      },
      expiracao: 86400, // 24 horas
    })

    // Salvar cobranca no banco
    await supabase.from('cobrancas_pix').insert({
      user_id: user.id,
      divida_id: divida.id,
      gateway: config.gateway_pagamento,
      gateway_id: pixResponse.id,
      valor: divida.valor,
      pix_copia_cola: pixResponse.pix_copia_cola,
      qr_code_url: pixResponse.qr_code_url,
      status: 'pendente',
    })

    // Enviar via WhatsApp se solicitado
    if (enviar_whatsapp && config.whatsapp_phone_number_id && config.whatsapp_access_token) {
      const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(divida.valor)

      const mensagem = TEMPLATES.ENVIO_PIX(
        divida.nome_devedor,
        valorFormatado,
        pixResponse.pix_copia_cola
      )

      const result = await sendTextMessage({
        phoneNumberId: config.whatsapp_phone_number_id,
        accessToken: config.whatsapp_access_token,
        to: divida.telefone,
        message: mensagem,
      })

      // Salvar mensagem
      await supabase.from('mensagens').insert({
        user_id: user.id,
        divida_id: divida.id,
        direcao: 'enviada',
        conteudo: mensagem,
        tipo: 'pix',
        status: 'enviada',
        whatsapp_message_id: result.messages[0]?.id,
      })
    }

    return NextResponse.json({
      success: true,
      pix: {
        id: pixResponse.id,
        pix_copia_cola: pixResponse.pix_copia_cola,
        qr_code_url: pixResponse.qr_code_url,
        valor: pixResponse.valor,
      },
    })
  } catch (error) {
    console.error('Erro ao gerar Pix:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao gerar Pix' },
      { status: 500 }
    )
  }
}
