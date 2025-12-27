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
import { MessageSquare, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function MensagensPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: mensagens } = await supabase
    .from('mensagens')
    .select(`
      *,
      divida:dividas(nome_devedor, telefone)
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      enviada: { variant: 'secondary', label: 'Enviada' },
      entregue: { variant: 'default', label: 'Entregue' },
      lida: { variant: 'default', label: 'Lida' },
      falha: { variant: 'destructive', label: 'Falha' },
    }
    const { variant, label } = variants[status] || variants.enviada
    return <Badge variant={variant}>{label}</Badge>
  }

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'outline', label: string }> = {
      texto: { variant: 'outline', label: 'Texto' },
      template: { variant: 'secondary', label: 'Template' },
      pix: { variant: 'default', label: 'Pix' },
    }
    const { variant, label } = variants[tipo] || variants.texto
    return <Badge variant={variant}>{label}</Badge>
  }

  const enviadas = mensagens?.filter(m => m.direcao === 'enviada').length || 0
  const recebidas = mensagens?.filter(m => m.direcao === 'recebida').length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensagens</h1>
          <p className="text-muted-foreground">
            Historico de mensagens enviadas e recebidas
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{enviadas}</div>
            <div className="text-xs text-muted-foreground">Enviadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{recebidas}</div>
            <div className="text-xs text-muted-foreground">Recebidas</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historico de Mensagens</CardTitle>
          <CardDescription>
            Ultimas 100 mensagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mensagens && mensagens.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">Dir.</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mensagens.map((mensagem) => (
                  <TableRow key={mensagem.id}>
                    <TableCell>
                      {mensagem.direcao === 'enviada' ? (
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {mensagem.divida?.nome_devedor || 'Desconhecido'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm max-w-md truncate block">
                        {mensagem.conteudo}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getTipoBadge(mensagem.tipo)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(mensagem.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(mensagem.created_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma mensagem</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                As mensagens enviadas e recebidas aparecerao aqui.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
