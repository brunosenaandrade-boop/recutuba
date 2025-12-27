import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Capturar lead (publico)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const body = await request.json()
    const { nome, email, whatsapp, nome_loja, utm_source, utm_medium, utm_campaign, whatsapp_verificado, whatsapp_id } = body

    // Validar campos obrigatorios
    if (!email || !whatsapp) {
      return NextResponse.json(
        { error: 'Email e WhatsApp sao obrigatorios' },
        { status: 400 }
      )
    }

    // Validar email basico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalido' },
        { status: 400 }
      )
    }

    // Limpar telefone - apenas numeros
    const whatsappLimpo = whatsapp.replace(/\D/g, '')

    // Validar WhatsApp (minimo 10 digitos)
    if (whatsappLimpo.length < 10) {
      return NextResponse.json(
        { error: 'WhatsApp invalido' },
        { status: 400 }
      )
    }

    // Verificar se o lead ja existe (mesmo email ou whatsapp)
    const { data: leadExistente } = await supabase
      .from('leads')
      .select('id')
      .or(`email.eq.${email},whatsapp.eq.${whatsappLimpo}`)
      .single()

    if (leadExistente) {
      // Lead ja existe, retornar sucesso mesmo assim (nao informar ao usuario)
      return NextResponse.json({
        success: true,
        message: 'Lead capturado com sucesso!'
      })
    }

    // Inserir novo lead
    const { error } = await supabase
      .from('leads')
      .insert({
        nome: nome || null,
        email,
        whatsapp: whatsappLimpo,
        whatsapp_verificado: whatsapp_verificado || false,
        whatsapp_id: whatsapp_id || null,
        nome_loja: nome_loja || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })

    if (error) {
      console.error('Erro ao salvar lead:', error)
      return NextResponse.json({ error: 'Erro ao processar cadastro' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Lead capturado com sucesso!'
    }, { status: 201 })
  } catch (error) {
    console.error('Erro no endpoint de leads:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
