import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTextMessage } from '@/lib/whatsapp/meta-api'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticacao
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { divida_id, mensagem } = body

    if (!divida_id || !mensagem) {
      return NextResponse.json(
        { error: 'divida_id e mensagem sao obrigatorios' },
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

    // Usar credenciais globais do WhatsApp (operador do sistema)
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

    if (!phoneNumberId || !accessToken) {
      return NextResponse.json(
        { error: 'WhatsApp nao configurado no servidor.' },
        { status: 500 }
      )
    }

    // Enviar mensagem via WhatsApp
    const result = await sendTextMessage({
      phoneNumberId,
      accessToken,
      to: divida.telefone,
      message: mensagem,
    })

    // Salvar mensagem no banco
    await supabase.from('mensagens').insert({
      user_id: user.id,
      divida_id: divida.id,
      direcao: 'enviada',
      conteudo: mensagem,
      tipo: 'texto',
      status: 'enviada',
      whatsapp_message_id: result.messages[0]?.id,
    })

    return NextResponse.json({
      success: true,
      message_id: result.messages[0]?.id,
    })
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
