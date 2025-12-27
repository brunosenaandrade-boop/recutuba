import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
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
import Link from 'next/link'
import { Plus, Upload, Phone, Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DividaActions } from '@/components/dividas/divida-actions'

export default async function DividasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: dividas } = await supabase
    .from('dividas')
    .select('*')
    .eq('user_id', user?.id)
    .order('data_vencimento', { ascending: true })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      pendente: { variant: 'destructive', label: 'Pendente' },
      pago: { variant: 'default', label: 'Pago' },
      renegociando: { variant: 'secondary', label: 'Renegociando' },
      cancelado: { variant: 'outline', label: 'Cancelado' },
    }
    const { variant, label } = variants[status] || variants.pendente
    return <Badge variant={variant}>{label}</Badge>
  }

  const isVencida = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dividas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as dividas dos seus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dividas/importar">
              <Upload className="mr-2 h-4 w-4" />
              Importar
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Dividas</CardTitle>
          <CardDescription>
            {dividas?.length || 0} dividas cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dividas && dividas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Devedor</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dividas.map((divida) => (
                  <TableRow key={divida.id}>
                    <TableCell className="font-medium">
                      {divida.nome_devedor}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {divida.telefone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {formatCurrency(Number(divida.valor))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className={isVencida(divida.data_vencimento) && divida.status === 'pendente' ? 'text-red-600 font-medium' : ''}>
                          {format(new Date(divida.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(divida.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DividaActions divida={divida} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma divida cadastrada</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece cadastrando uma divida ou importando uma planilha.
              </p>
              <div className="mt-6 flex justify-center gap-2">
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
