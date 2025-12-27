# RecuperaTuba

Sistema de cobranca automatizada via WhatsApp para lojistas de varejo.

## Funcionalidades

- Dashboard com metricas de inadimplencia e recuperacao
- Cadastro manual de dividas
- Importacao de planilhas (Excel/CSV)
- Integracao com WhatsApp (Meta Cloud API)
- Bot de deteccao de interesse de pagamento
- Regua de cobranca automatica (D-2, D0, D+5, D+15, D+30)
- Geracao de Pix (Asaas, Efi, Mercado Pago)
- Notificacoes por email e WhatsApp
- Confirmacao automatica de pagamento

## Stack

- **Frontend:** Next.js 14 + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes
- **Banco:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **WhatsApp:** Meta Cloud API
- **Pagamentos:** Asaas / Efi / Mercado Pago
- **Email:** Resend
- **Deploy:** Vercel

## Setup Local

1. Clone o repositorio
2. Instale as dependencias:
   ```bash
   npm install
   ```

3. Configure as variaveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```

4. Preencha as variaveis no `.env.local`:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o SQL em `supabase/migrations/001_initial_schema.sql`
   - Configure o WhatsApp em [developers.facebook.com](https://developers.facebook.com)

5. Rode o projeto:
   ```bash
   npm run dev
   ```

## Deploy na Vercel

1. Conecte o repositorio na Vercel
2. Configure as variaveis de ambiente
3. Deploy!

O cron job para a regua de cobranca roda automaticamente as 10h (configurado em `vercel.json`).

## Configuracao do WhatsApp

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um app do tipo Business
3. Adicione o produto WhatsApp
4. Configure o webhook apontando para: `https://seu-dominio.com/api/webhooks/whatsapp`
5. Use o Verify Token definido em `WHATSAPP_VERIFY_TOKEN`
6. Copie o Phone Number ID e Access Token para as configuracoes

## Configuracao de Pagamentos

### Asaas
1. Acesse [minhaconta.asaas.com](https://minhaconta.asaas.com)
2. Va em Integracoes > API
3. Copie a API Key

### Efi (Gerencianet)
1. Acesse [gerencianet.com.br](https://gerencianet.com.br)
2. Va em API > Minhas Aplicacoes
3. Copie Client ID e Client Secret (formato: `client_id:client_secret`)

### Mercado Pago
1. Acesse [mercadopago.com.br](https://mercadopago.com.br)
2. Va em Seu negocio > Configuracoes > Credenciais
3. Copie o Access Token

## Webhooks

Configure os webhooks dos gateways de pagamento:

- **Asaas:** `https://seu-dominio.com/api/webhooks/pagamentos?gateway=asaas`
- **Efi:** `https://seu-dominio.com/api/webhooks/pagamentos?gateway=efi`
- **Mercado Pago:** `https://seu-dominio.com/api/webhooks/pagamentos?gateway=mercadopago`

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/           # Paginas de login/registro
│   ├── (dashboard)/      # Paginas do dashboard
│   └── api/              # API Routes
├── components/           # Componentes React
├── lib/                  # Bibliotecas e utilitarios
│   ├── supabase/        # Cliente Supabase
│   ├── whatsapp/        # Integracao WhatsApp
│   └── pagamentos/      # Gateways de pagamento
└── types/               # Tipos TypeScript
```

## Licenca

Proprietario - Todos os direitos reservados.
