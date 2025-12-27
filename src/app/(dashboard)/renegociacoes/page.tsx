import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Phone, DollarSign, MessageSquare, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RenegociacaoActions } from '@/components/renegociacoes/renegociacao-actions'

export default async function RenegociacoesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: renegociacoes } = await supabase
    .from('renegociacoes')
    .select(`
      *,
      divida:dividas(*)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      novo: { variant: 'destructive', label: 'Novo' },
      em_contato: { variant: 'secondary', label: 'Em Contato' },
      resolvido: { variant: 'default', label: 'Resolvido' },
      perdido: { variant: 'outline', label: 'Perdido' },
    }
    const { variant, label } = variants[status] || variants.novo
    return <Badge variant={variant}>{label}</Badge>
  }

  const novos = renegociacoes?.filter(r => r.status === 'novo').length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Renegociacoes</h1>
          <p className="text-muted-foreground">
            Clientes que demonstraram interesse em pagar
          </p>
        </div>
        {novos > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {novos} nova{novos > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Renegociacoes</CardTitle>
          <CardDescription>
            Quando um cliente responde ao WhatsApp querendo pagar, ele aparece aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renegociacoes && renegociacoes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Recebido em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renegociacoes.map((renegociacao) => (
                  <TableRow key={renegociacao.id} className={renegociacao.status === 'novo' ? 'bg-yellow-50' : ''}>
                    <TableCell className="font-medium">
                      {renegociacao.divida?.nome_devedor}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {renegociacao.divida?.telefone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {formatCurrency(Number(renegociacao.divida?.valor || 0))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 max-w-xs">
                        <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate text-sm">
                          {renegociacao.mensagem_interesse || 'Cliente quer negociar'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(renegociacao.created_at), "dd/MM 'as' HH:mm", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(renegociacao.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <RenegociacaoActions renegociacao={renegociacao} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma renegociacao</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quando um cliente responder ao WhatsApp querendo pagar, ele aparecera aqui.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
