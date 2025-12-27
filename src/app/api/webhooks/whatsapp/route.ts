import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { detectIntent } from '@/lib/whatsapp/meta-api'
import { WhatsAppWebhookPayload } from '@/types'

// Verificacao do webhook (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// Receber mensagens (POST)
export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppWebhookPayload = await request.json()

    // Verificar se e uma mensagem do WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' })
    }

    const supabase = createServiceClient()

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const value = change.value

        // Processar mensagens recebidas
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await processIncomingMessage(supabase, message, value)
          }
        }

        // Processar status de mensagens (entregue, lida, etc)
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            await updateMessageStatus(supabase, status)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function processIncomingMessage(
  supabase: ReturnType<typeof createServiceClient>,
  message: {
    from: string
    id: string
    timestamp: string
    text?: { body: string }
    type: string
  },
  value: {
    metadata: { phone_number_id: string }
    contacts?: Array<{ profile: { name: string }; wa_id: string }>
  }
) {
  // So processar mensagens de texto por enquanto
  if (message.type !== 'text' || !message.text?.body) {
    return
  }

  const phoneNumber = message.from.replace('55', '') // Remover codigo do pais
  const messageText = message.text.body
  const contactName = value.contacts?.[0]?.profile?.name || 'Desconhecido'

  console.log(`Mensagem recebida de ${phoneNumber}: ${messageText}`)

  // Buscar divida pelo telefone
  const { data: divida } = await supabase
    .from('dividas')
    .select('*, user_id')
    .or(`telefone.eq.${phoneNumber},telefone.eq.55${phoneNumber}`)
    .eq('status', 'pendente')
    .order('data_vencimento', { ascending: true })
    .limit(1)
    .single()

  if (!divida) {
    console.log('Nenhuma divida encontrada para o telefone:', phoneNumber)
    return
  }

  // Salvar mensagem recebida
  await supabase.from('mensagens').insert({
    user_id: divida.user_id,
    divida_id: divida.id,
    direcao: 'recebida',
    conteudo: messageText,
    tipo: 'texto',
    status: 'recebida',
    whatsapp_message_id: message.id,
  })

  // Detectar intencao
  const intent = detectIntent(messageText)

  // Se cliente quer pagar ou negociar, criar renegociacao
  if (intent === 'pagar' || intent === 'negociar') {
    // Verificar se ja existe renegociacao
    const { data: existingRenegociacao } = await supabase
      .from('renegociacoes')
      .select('id')
      .eq('divida_id', divida.id)
      .single()

    if (!existingRenegociacao) {
      // Criar nova renegociacao
      await supabase.from('renegociacoes').insert({
        user_id: divida.user_id,
        divida_id: divida.id,
        mensagem_interesse: messageText,
        status: 'novo',
        lojista_notificado: false,
      })

      // Atualizar status da divida
      await supabase
        .from('dividas')
        .update({ status: 'renegociando' })
        .eq('id', divida.id)

      // Notificar lojista
      await notifyLojista(supabase, divida.user_id, divida, messageText, contactName)
    } else {
      // Atualizar mensagem de interesse existente
      await supabase
        .from('renegociacoes')
        .update({
          mensagem_interesse: messageText,
          lojista_notificado: false,
        })
        .eq('id', existingRenegociacao.id)

      // Notificar lojista novamente
      await notifyLojista(supabase, divida.user_id, divida, messageText, contactName)
    }
  }
}

async function updateMessageStatus(
  supabase: ReturnType<typeof createServiceClient>,
  status: {
    id: string
    status: 'sent' | 'delivered' | 'read' | 'failed'
    timestamp: string
    recipient_id: string
  }
) {
  const statusMap: Record<string, string> = {
    sent: 'enviada',
    delivered: 'entregue',
    read: 'lida',
    failed: 'falha',
  }

  await supabase
    .from('mensagens')
    .update({ status: statusMap[status.status] || 'enviada' })
    .eq('whatsapp_message_id', status.id)
}

async function notifyLojista(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  divida: { id: string; nome_devedor: string; valor: number; telefone: string },
  mensagem: string,
  contactName: string
) {
  // Buscar config do lojista
  const { data: config } = await supabase
    .from('config')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!config) return

  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(divida.valor)

  // Notificar via email (se configurado)
  if (config.notificar_email && config.email) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notificacoes/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: config.email,
          subject: `Nova renegociacao - ${divida.nome_devedor}`,
          body: `
            <h2>Novo interesse de pagamento!</h2>
            <p><strong>Cliente:</strong> ${divida.nome_devedor} (${contactName})</p>
            <p><strong>Telefone:</strong> ${divida.telefone}</p>
            <p><strong>Valor:</strong> ${valorFormatado}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
            <p>Acesse o sistema para dar andamento a renegociacao.</p>
          `,
        }),
      })
    } catch (error) {
      console.error('Erro ao enviar email:', error)
    }
  }

  // Marcar como notificado
  await supabase
    .from('renegociacoes')
    .update({ lojista_notificado: true })
    .eq('divida_id', divida.id)
}
