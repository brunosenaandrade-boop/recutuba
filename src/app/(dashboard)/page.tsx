import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  Plus,
  Upload
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Buscar metricas
  const { data: dividas } = await supabase
    .from('dividas')
    .select('*')
    .eq('user_id', user?.id)

  const { data: renegociacoes } = await supabase
    .from('renegociacoes')
    .select('*')
    .eq('user_id', user?.id)
    .eq('status', 'novo')

  const totalDividas = dividas?.length || 0
  const dividasPendentes = dividas?.filter(d => d.status === 'pendente').length || 0
  const dividasPagas = dividas?.filter(d => d.status === 'pago').length || 0

  const totalInadimplente = dividas
    ?.filter(d => d.status === 'pendente')
    .reduce((acc, d) => acc + Number(d.valor), 0) || 0

  const totalRecuperado = dividas
    ?.filter(d => d.status === 'pago')
    .reduce((acc, d) => acc + Number(d.valor), 0) || 0

  const renegociacoesNovas = renegociacoes?.length || 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visao geral das suas cobranças
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dividas/importar">
              <Upload className="mr-2 h-4 w-4" />
              Importar Planilha
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dividas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Divida
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de Metricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inadimplente
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalInadimplente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dividasPendentes} dividas pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recuperado
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRecuperado)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dividasPagas} dividas pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Dividas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDividas}</div>
            <p className="text-xs text-muted-foreground">
              cadastradas no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Renegociacoes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {renegociacoesNovas}
            </div>
            <p className="text-xs text-muted-foreground">
              aguardando seu contato
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acoes Rapidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acoes Rapidas</CardTitle>
            <CardDescription>
              Comece a recuperar suas vendas agora
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dividas/nova">
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar divida manualmente
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dividas/importar">
                <Upload className="mr-2 h-4 w-4" />
                Importar planilha de dividas
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/renegociacoes">
                <AlertCircle className="mr-2 h-4 w-4" />
                Ver renegociacoes pendentes
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
            <CardDescription>
              O RecuperaTuba trabalha por voce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
              <p>Cadastre suas dividas ou importe uma planilha</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                2
              </div>
              <p>O sistema envia lembretes automaticos via WhatsApp</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                3
              </div>
              <p>Quando o cliente responder, voce e notificado para negociar</p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                4
              </div>
              <p>Gere o Pix e receba o pagamento automaticamente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
