import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendTextMessage, TEMPLATES } from '@/lib/whatsapp/meta-api'

// Endpoint para processar a regua de cobranca
// Deve ser chamado diariamente via Vercel Cron
export async function GET(request: NextRequest) {
  // Verificar token de seguranca
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    // Buscar todas as dividas pendentes
    const { data: dividas, error } = await supabase
      .from('dividas')
      .select('*')
      .eq('status', 'pendente')

    if (error) {
      console.error('Erro ao buscar dividas:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!dividas || dividas.length === 0) {
      return NextResponse.json({ message: 'Nenhuma divida para processar' })
    }

    // Usar credenciais globais do WhatsApp (operador do sistema)
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

    if (!phoneNumberId || !accessToken) {
      return NextResponse.json({ error: 'WhatsApp nao configurado no servidor' }, { status: 500 })
    }

    // Buscar todas as configs de uma vez (para pegar nome_loja)
    const userIds = [...new Set(dividas.map(d => d.user_id))]
    const { data: configs } = await supabase
      .from('config')
      .select('user_id, nome_loja')
      .in('user_id', userIds)

    const configMap = new Map(configs?.map(c => [c.user_id, c]) || [])

    const results = {
      processadas: 0,
      enviadas: 0,
      erros: 0,
    }

    for (const divida of dividas) {
      try {
        const config = configMap.get(divida.user_id)
        const nomeLoja = config?.nome_loja || 'nossa loja'

        const vencimento = new Date(divida.data_vencimento)
        vencimento.setHours(0, 0, 0, 0)

        const diffDays = Math.floor((hoje.getTime() - vencimento.getTime()) / (1000 * 60 * 60 * 24))

        // Determinar qual etapa da regua
        let etapa: string | null = null
        let mensagem: string | null = null

        const valorFormatado = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(divida.valor)

        const dataFormatada = new Date(divida.data_vencimento).toLocaleDateString('pt-BR')

        if (diffDays === -2) {
          // D-2: 2 dias antes do vencimento
          etapa = 'D-2'
          mensagem = TEMPLATES.LEMBRETE_D2(divida.nome_devedor, nomeLoja, valorFormatado, dataFormatada)
        } else if (diffDays === 0) {
          // D0: Dia do vencimento
          etapa = 'D0'
          mensagem = TEMPLATES.AVISO_D0(divida.nome_devedor, nomeLoja, valorFormatado)
        } else if (diffDays === 5) {
          // D+5: 5 dias apos vencimento
          etapa = 'D+5'
          mensagem = TEMPLATES.COBRANCA_D5(divida.nome_devedor, nomeLoja, valorFormatado, diffDays)
        } else if (diffDays === 15) {
          // D+15: 15 dias apos vencimento
          etapa = 'D+15'
          mensagem = TEMPLATES.COBRANCA_D15(divida.nome_devedor, nomeLoja, valorFormatado)
        } else if (diffDays === 30) {
          // D+30: 30 dias apos vencimento
          etapa = 'D+30'
          mensagem = TEMPLATES.COBRANCA_D30(divida.nome_devedor, nomeLoja, valorFormatado)
        }

        if (!etapa || !mensagem) {
          continue
        }

        // Verificar se ja foi executada essa etapa
        const { data: execucaoExistente } = await supabase
          .from('regua_execucoes')
          .select('id')
          .eq('divida_id', divida.id)
          .eq('etapa', etapa)
          .limit(1)
          .single()

        if (execucaoExistente) {
          continue // Ja foi executada
        }

        results.processadas++

        // Enviar mensagem usando credenciais globais
        const result = await sendTextMessage({
          phoneNumberId,
          accessToken,
          to: divida.telefone,
          message: mensagem,
        })

        // Salvar mensagem
        const { data: mensagemSalva } = await supabase
          .from('mensagens')
          .insert({
            user_id: divida.user_id,
            divida_id: divida.id,
            direcao: 'enviada',
            conteudo: mensagem,
            tipo: 'template',
            status: 'enviada',
            whatsapp_message_id: result.messages[0]?.id,
          })
          .select()
          .single()

        // Registrar execucao da regua
        await supabase.from('regua_execucoes').insert({
          user_id: divida.user_id,
          divida_id: divida.id,
          etapa: etapa,
          mensagem_id: mensagemSalva?.id,
        })

        results.enviadas++
        console.log(`Mensagem ${etapa} enviada para ${divida.nome_devedor}`)
      } catch (err) {
        console.error(`Erro ao processar divida ${divida.id}:`, err)
        results.erros++
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Erro no cron:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
