import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, body: htmlBody } = body

    if (!to || !subject || !htmlBody) {
      return NextResponse.json(
        { error: 'to, subject e body sao obrigatorios' },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY nao configurada, email nao enviado')
      return NextResponse.json({ success: true, mock: true })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: 'RecuperaTuba <noreply@recuperatuba.com.br>',
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #2563eb;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-radius: 0 0 8px 8px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 12px;
            }
            h2 {
              margin: 0 0 10px 0;
            }
            p {
              margin: 10px 0;
            }
            strong {
              color: #111;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RecuperaTuba</h1>
          </div>
          <div class="content">
            ${htmlBody}
          </div>
          <div class="footer">
            <p>Este email foi enviado automaticamente pelo RecuperaTuba.</p>
            <p>Sistema de recuperacao de credito para lojistas.</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}
