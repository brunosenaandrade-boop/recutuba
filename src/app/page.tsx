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
  QrCode
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Se logado, redireciona para o dashboard
  if (user) {
    redirect('/dividas')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RecuperaTuba</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">
                Comecar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Cobranca automatizada via WhatsApp
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            Recupere suas vendas no fiado com{' '}
            <span className="text-green-600">WhatsApp automatico</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema completo de cobranca para lojistas do varejo. Envie lembretes,
            gere Pix e receba pagamentos - tudo no piloto automatico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                Comecar Agora - Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Demonstracao
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Sem cartao de credito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cansado de correr atras de cliente devedor?
            </h2>
            <p className="text-lg text-gray-600">
              Sabemos como e dificil cobrar sem parecer chato. O cliente some,
              nao atende, e voce fica no prejuizo.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tempo perdido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  Horas ligando, mandando mensagem, e o cliente ainda nao paga.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Dinheiro parado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  Capital de giro preso em dividas que so aumentam o prejuizo.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Relacionamento desgastado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  Cobrar pessoalmente e constrangedor para voce e para o cliente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solucao Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Com o RecuperaTuba, a cobranca vai no automatico
            </h2>
            <p className="text-lg text-gray-600">
              Cadastre a divida uma vez e deixe o sistema trabalhar por voce,
              24 horas por dia, 7 dias por semana.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Cobranca via WhatsApp</CardTitle>
                <CardDescription>
                  Mensagens automaticas nos momentos certos: antes, no dia e apos o vencimento.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Pix na Hora</CardTitle>
                <CardDescription>
                  Gere QR Code Pix automaticamente. Cliente responde "quero pagar" e recebe o codigo.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Notificacoes em Tempo Real</CardTitle>
                <CardDescription>
                  Saiba na hora quando um cliente quer negociar. Receba alerta por WhatsApp ou email.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Importacao em Massa</CardTitle>
                <CardDescription>
                  Importe suas dividas de planilhas Excel ou CSV. Cadastre centenas de uma vez.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Dashboard Completo</CardTitle>
                <CardDescription>
                  Acompanhe quanto ja recuperou, quantas dividas estao pendentes e mais.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Seguro e Confiavel</CardTitle>
                <CardDescription>
                  Seus dados protegidos. O dinheiro vai direto para sua conta, sem intermediarios.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona em 3 passos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre a Divida</h3>
              <p className="text-gray-600">
                Adicione o nome, telefone, valor e data de vencimento. Pode importar de planilha.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Sistema Cobra Automatico</h3>
              <p className="text-gray-600">
                Mensagens sao enviadas automaticamente: 2 dias antes, no dia, e apos o vencimento.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba o Pagamento</h3>
              <p className="text-gray-600">
                Cliente recebe Pix, paga, e o dinheiro cai direto na sua conta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Precos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-lg text-gray-600">
              Comece gratis e so pague quando crescer
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Gratis</CardTitle>
                <CardDescription>Para comecar</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$0</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Ate 20 dividas ativas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Cobranca automatica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Geracao de Pix
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="w-5 h-5" />
                    Importacao em massa
                  </li>
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Comecar Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </div>
              <CardHeader>
                <CardTitle>Profissional</CardTitle>
                <CardDescription>Para lojistas ativos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$49</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Dividas ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Cobranca automatica
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Geracao de Pix
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Importacao em massa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Suporte prioritario
                  </li>
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Assinar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Empresarial</CardTitle>
                <CardDescription>Para grandes operacoes</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$149</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Tudo do Profissional
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Multiplos usuarios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    API de integracao
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Relatorios avancados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Suporte dedicado
                  </li>
                </ul>
                <Link href="/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Falar com Vendas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "Recuperei mais de R$15.000 em dividas antigas no primeiro mes.
                  O sistema faz o trabalho chato por mim."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">JM</span>
                  </div>
                  <div>
                    <p className="font-semibold">Joao Mercado</p>
                    <p className="text-sm text-gray-500">Mercadinho do Joao - SP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "Antes eu tinha vergonha de cobrar. Agora o WhatsApp cobra pra mim
                  e os clientes ainda agradecem o lembrete!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold">Maria Costa</p>
                    <p className="text-sm text-gray-500">Loja da Maria - RJ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "O Pix automatico e genial. Cliente responde que quer pagar
                  e ja recebe o codigo. Taxa de conversao altissima."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">PS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Pedro Santos</p>
                    <p className="text-sm text-gray-500">Construcoes Pedro - MG</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preciso ter WhatsApp Business?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nao! Nos cuidamos de toda a infraestrutura do WhatsApp. Voce so precisa
                  cadastrar suas dividas e o sistema faz o resto.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como recebo o dinheiro?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Voce conecta sua conta do Asaas, Mercado Pago ou Efi (Gerencianet).
                  Quando o cliente paga o Pix, o dinheiro vai direto para sua conta.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">E se o cliente reclamar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  O sistema detecta automaticamente quando um cliente quer negociar ou
                  tem alguma duvida, e te avisa na hora para voce entrar em contato.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso testar antes de pagar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sim! O plano gratuito permite ate 20 dividas ativas. Voce pode testar
                  todas as funcionalidades antes de decidir assinar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para recuperar suas vendas?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de lojistas que ja recuperaram milhares de reais
            em dividas com o RecuperaTuba.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6">
              Comecar Agora - E Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">RecuperaTuba</span>
              </div>
              <p className="text-sm">
                Sistema de cobranca automatizada via WhatsApp para lojistas do varejo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-white">Precos</Link></li>
                <li><Link href="#" className="hover:text-white">Integraces</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Central de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-white">Contato</Link></li>
                <li><Link href="#" className="hover:text-white">Status do Sistema</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="#" className="hover:text-white">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-white">LGPD</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 RecuperaTuba. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
