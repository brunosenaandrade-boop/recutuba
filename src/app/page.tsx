import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadCaptureForm } from '@/components/lead-capture-form'
import {
  MessageSquare,
  DollarSign,
  Clock,
  Bell,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  FileSpreadsheet,
  QrCode,
  Star,
  BadgeCheck,
  Gift,
  Timer,
  Phone,
  Lock,
  Award,
  X
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dividas')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barra de Urgencia */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 text-center text-sm font-medium">
        <span className="animate-pulse inline-block mr-2">🔥</span>
        ACESSO ANTECIPADO: Vagas limitadas para o lancamento exclusivo!
        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">Beta Gratuito</span>
      </div>

      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">RecuperaTuba</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="#cadastro">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30">
                Quero Testar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZTEwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Pare de perder dinheiro com
                <span className="relative">
                  <span className="relative z-10 text-green-600"> clientes caloteiros</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 4 298 10" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                O <strong>unico sistema</strong> que cobra automaticamente via WhatsApp,
                gera Pix na hora e <strong>recupera dividas</strong> sem voce
                precisar fazer nada.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                  <span>Sem cartao de credito</span>
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4 text-green-600" />
                  <span>Ativo em 2 minutos</span>
                </div>
              </div>
            </div>

            {/* Formulario de Captura */}
            <div id="cadastro">
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </section>

      {/* Problema - Agitacao */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Voce esta perdendo dinheiro <span className="text-red-400">AGORA MESMO</span>
            </h2>
            <p className="text-xl text-gray-400">
              Enquanto voce le isso, clientes devedores estao gastando o dinheiro
              que deveriam pagar para voce.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tempo perdido</h3>
              <p className="text-gray-400">
                Lojistas perdem horas toda semana cobrando clientes manualmente.
                Tempo que voce poderia usar para VENDER.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dividas acumuladas</h3>
              <p className="text-gray-400">
                Sem cobranca sistematica, as dividas acumulam e ficam cada vez
                mais dificeis de recuperar. Dinheiro que vai embora todo mes.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Clientes perdidos</h3>
              <p className="text-gray-400">
                Cobrar pessoalmente e constrangedor. Voce perde o cliente E a divida.
                Com mensagem automatica, voce mantem o relacionamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solucao */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              A SOLUCAO
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              RecuperaTuba: Cobranca que funciona no <span className="text-green-600">piloto automatico</span>
            </h2>
            <p className="text-xl text-gray-600">
              Cadastre uma vez, deixe o sistema cobrar para sempre.
              Simples assim.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">WhatsApp Automatico</CardTitle>
                <CardDescription className="text-base">
                  Mensagens personalizadas enviadas nos momentos certos: 2 dias antes,
                  no dia e apos o vencimento. O cliente recebe no WhatsApp, onde ele VE.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <QrCode className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Pix Instantaneo</CardTitle>
                <CardDescription className="text-base">
                  Cliente respondeu "quero pagar"? Em 3 segundos ele recebe o QR Code
                  Pix. Sem fricao, sem desculpa. O dinheiro cai na SUA conta.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Alertas em Tempo Real</CardTitle>
                <CardDescription className="text-base">
                  Receba notificacao no SEU WhatsApp quando um cliente quiser negociar.
                  Voce entra so quando precisa, o sistema faz o resto.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Importacao em Massa</CardTitle>
                <CardDescription className="text-base">
                  Tem centenas de dividas em uma planilha? Importa tudo de uma vez.
                  CSV, Excel, tanto faz. Em 1 clique todas estao no sistema.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Dashboard Completo</CardTitle>
                <CardDescription className="text-base">
                  Veja em tempo real: quanto recuperou, quantas dividas abertas,
                  taxa de conversao. Dados para tomar decisoes inteligentes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Dinheiro Direto na Conta</CardTitle>
                <CardDescription className="text-base">
                  Sem intermediarios. Cliente paga, dinheiro cai na SUA conta
                  do Asaas, Mercado Pago ou Efi. Voce tem controle total.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              3 passos para recuperar seu dinheiro
            </h2>
            <p className="text-xl text-gray-600">
              Comece a receber em menos de 5 minutos
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 relative z-10">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-green-600/30">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">Cadastre as Dividas</h3>
                  <p className="text-gray-600">
                    Digite ou importe de planilha. Nome, telefone, valor, vencimento.
                    Pronto, cadastrado em segundos.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 relative z-10">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-green-600/30">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sistema Cobra Sozinho</h3>
                  <p className="text-gray-600">
                    Mensagens automaticas via WhatsApp. Lembrete, cobranca, Pix.
                    Tudo no piloto automatico 24/7.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 relative z-10">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-green-600/30">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Receba o Dinheiro</h3>
                  <p className="text-gray-600">
                    Cliente paga o Pix, dinheiro cai na sua conta.
                    Voce ve tudo no dashboard em tempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="#cadastro">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-10 py-7 shadow-xl shadow-green-600/30">
                Quero Testar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que lojistas escolhem o <span className="text-green-600">RecuperaTuba</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Cobranca profissional sem constrangimento</h3>
                <p className="text-gray-600">
                  Mensagens educadas e automaticas. Voce mantem o bom relacionamento com o cliente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Pix cai direto na sua conta</h3>
                <p className="text-gray-600">
                  Sem intermediarios. Voce conecta seu gateway e recebe diretamente.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Funciona 24 horas, 7 dias</h3>
                <p className="text-gray-600">
                  O sistema trabalha enquanto voce dorme. Cobrancas automaticas mesmo de madrugada.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Sem conhecimento tecnico</h3>
                <p className="text-gray-600">
                  Interface simples e intuitiva. Se voce sabe usar WhatsApp, sabe usar o RecuperaTuba.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precos Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              LANCAMENTO ESPECIAL
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Acesso antecipado 100% GRATUITO
            </h2>
            <p className="text-xl text-gray-600">
              Seja um dos primeiros a usar e ajude a moldar o produto.
              Em troca, voce ganha acesso gratuito durante o periodo beta.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-green-600 relative shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                VAGAS LIMITADAS
              </div>
              <CardHeader className="pt-8 text-center">
                <CardTitle className="text-2xl">Acesso Beta</CardTitle>
                <CardDescription>Para primeiros usuarios</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-green-600">GRATIS</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Acesso completo ao sistema</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Cobranca automatica via WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Geracao de Pix instantaneo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Dashboard completo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Suporte direto com o time</span>
                  </li>
                </ul>
                <Link href="#cadastro" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg" size="lg">
                    Quero Participar do Beta
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Preciso ter WhatsApp Business?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>Nao!</strong> Nos cuidamos de toda a infraestrutura do WhatsApp. Voce so precisa
                  cadastrar suas dividas e o sistema faz o resto. Zero configuracao tecnica.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Como recebo o dinheiro?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Voce conecta sua conta do Asaas, Mercado Pago ou Efi (Gerencianet).
                  Quando o cliente paga o Pix, o dinheiro vai <strong>direto para SUA conta</strong>.
                  Nao ficamos com nada.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  E se o cliente reclamar da cobranca?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  O sistema detecta automaticamente quando um cliente quer negociar ou
                  tem alguma duvida, e te avisa na hora. As mensagens sao educadas e profissionais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Meus dados estao seguros?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>100% seguros.</strong> Usamos criptografia de ponta e seguimos todas as normas
                  da LGPD. Seus dados nunca sao compartilhados com terceiros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZjEwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Garanta sua vaga no beta gratuito
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Vagas limitadas para o lancamento. Cadastre-se agora e seja um dos
            primeiros a usar o RecuperaTuba.
          </p>
          <Link href="#cadastro">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-8 shadow-2xl transform hover:scale-105 transition-all duration-200">
              <Gift className="mr-2 w-6 h-6" />
              Quero Minha Vaga Gratis
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <p className="text-green-200 mt-6 text-sm">
            Sem cartao de credito • 100% gratuito durante o beta
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RecuperaTuba</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Lock className="w-4 h-4" />
                <span>Site Seguro</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Shield className="w-4 h-4" />
                <span>Dados Protegidos</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm">&copy; 2024 RecuperaTuba. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <Link href="#cadastro">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-600/50 animate-bounce">
            <Gift className="mr-2 w-5 h-5" />
            Quero Testar Gratis
          </Button>
        </Link>
      </div>
    </div>
  )
}
