import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        OFERTA ESPECIAL: Primeiros 100 cadastros ganham 30 dias do plano PRO gratis!
        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">Restam apenas 23 vagas</span>
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
            <Link href="/register">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30">
                Comecar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZTEwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge de Prova Social */}
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">J</div>
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">M</div>
                <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">P</div>
              </div>
              +847 lojistas ja recuperaram R$2.3M este mes
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Pare de perder dinheiro com
              <span className="relative">
                <span className="relative z-10 text-green-600"> clientes caloteiros</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 4 298 10" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              O <strong>unico sistema</strong> que cobra automaticamente via WhatsApp,
              gera Pix na hora e <strong>recupera ate 73% das dividas</strong> sem voce
              precisar fazer nada.
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-10 py-7 shadow-xl shadow-green-600/30 transform hover:scale-105 transition-all duration-200 group">
                  <Gift className="mr-2 w-5 h-5" />
                  Comecar Gratis Agora
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
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

          {/* Stats Bar */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">R$2.3M</div>
                <div className="text-sm text-gray-500">Recuperados este mes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">847+</div>
                <div className="text-sm text-gray-500">Lojistas ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">73%</div>
                <div className="text-sm text-gray-500">Taxa de recuperacao</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">4.9</div>
                <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Avaliacao
                </div>
              </div>
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
              <h3 className="text-xl font-bold mb-2">6 horas por semana</h3>
              <p className="text-gray-400">
                E o tempo medio que lojistas perdem cobrando clientes manualmente.
                Tempo que voce poderia usar para VENDER.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">R$3.200 perdidos</h3>
              <p className="text-gray-400">
                Media mensal de dividas nao cobradas por lojistas que fazem cobranca
                manual. Dinheiro que vai embora todo mes.
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
                  Tem 500 dividas em uma planilha? Importa tudo de uma vez.
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
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-10 py-7 shadow-xl shadow-green-600/30">
                Quero Comecar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lojistas que ja estao <span className="text-green-600">recuperando dinheiro</span>
            </h2>
            <p className="text-xl text-gray-600">
              Veja os resultados reais de quem usa o RecuperaTuba
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">
                  "No primeiro mes recuperei <strong className="text-green-600">R$18.750</strong> em dividas
                  que eu ja tinha dado como perdidas. O sistema se pagou em 1 dia."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JM</span>
                  </div>
                  <div>
                    <p className="font-bold">Joao Mendes</p>
                    <p className="text-sm text-gray-500">Mercadinho Bom Preco - SP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">
                  "Eu perdia 2 horas por dia cobrando cliente. Agora o sistema faz tudo
                  e minha <strong className="text-green-600">taxa de recebimento subiu 47%</strong>."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">MC</span>
                  </div>
                  <div>
                    <p className="font-bold">Maria Clara</p>
                    <p className="text-sm text-gray-500">Loja da Maria - RJ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">
                  "O Pix automatico e genial. Cliente responde, recebe o codigo e paga.
                  <strong className="text-green-600"> R$12.000 recuperados</strong> so nesse mes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">PS</span>
                  </div>
                  <div>
                    <p className="font-bold">Pedro Santos</p>
                    <p className="text-sm text-gray-500">Construcoes Pedro - MG</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Precos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              OFERTA ESPECIAL
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comece GRATIS e so pague quando crescer
            </h2>
            <p className="text-xl text-gray-600">
              Sem compromisso. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 relative">
              <CardHeader>
                <CardTitle className="text-2xl">Gratis</CardTitle>
                <CardDescription>Para testar</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">R$0</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Ate 20 dividas ativas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Cobranca automatica</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Geracao de Pix</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>Importacao em massa</span>
                  </li>
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button className="w-full" variant="outline" size="lg">
                    Comecar Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-600 relative shadow-xl scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                MAIS POPULAR
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl">Profissional</CardTitle>
                <CardDescription>Para lojistas ativos</CardDescription>
                <div className="mt-4">
                  <span className="text-gray-400 line-through text-lg">R$97</span>
                  <span className="text-5xl font-bold text-green-600 ml-2">R$49</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span><strong>Dividas ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Cobranca automatica</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Geracao de Pix</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Importacao em massa</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Suporte prioritario</span>
                  </li>
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    Assinar Agora
                  </Button>
                </Link>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Garantia de 7 dias ou seu dinheiro de volta
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 relative">
              <CardHeader>
                <CardTitle className="text-2xl">Empresarial</CardTitle>
                <CardDescription>Para grandes operacoes</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">R$149</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Tudo do Profissional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Multiplos usuarios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>API de integracao</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Relatorios avancados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Suporte dedicado</span>
                  </li>
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button className="w-full" variant="outline" size="lg">
                    Falar com Vendas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Garantia */}
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 border-2 border-green-200 shadow-lg">
              <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Garantia Incondicional de 7 Dias</h3>
              <p className="text-gray-600">
                Se por qualquer motivo voce nao ficar satisfeito, devolvemos 100% do seu dinheiro.
                Sem perguntas, sem burocracia. O risco e todo nosso.
              </p>
            </div>
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
                  tem alguma duvida, e te avisa na hora. As mensagens sao educadas e profissionais -
                  <strong> 97% dos clientes nao reclamam</strong>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="w-5 h-5 text-green-600" />
                  Em quanto tempo vejo resultados?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A maioria dos lojistas ve os primeiros pagamentos em <strong>24 a 48 horas</strong> apos
                  cadastrar as dividas. O sistema comeca a trabalhar imediatamente.
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
            Comece a recuperar seu dinheiro HOJE
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Enquanto voce espera, suas dividas estao envelhecendo e ficando mais dificeis de cobrar.
            Cadastre-se agora e comece a receber em 24 horas.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-8 shadow-2xl transform hover:scale-105 transition-all duration-200">
              <Gift className="mr-2 w-6 h-6" />
              Comecar Gratis Agora
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <p className="text-green-200 mt-6 text-sm">
            Sem cartao de credito • Ativo em 2 minutos • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">RecuperaTuba</span>
              </div>
              <p className="text-sm">
                Sistema de cobranca automatizada via WhatsApp para lojistas do varejo.
                Recupere suas vendas no fiado de forma profissional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Precos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integracoes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status do Sistema</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">LGPD</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; 2024 RecuperaTuba. Todos os direitos reservados.</p>
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
        </div>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <Link href="/register">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-600/50 animate-bounce">
            <Gift className="mr-2 w-5 h-5" />
            Comecar Gratis
          </Button>
        </Link>
      </div>
    </div>
  )
}
