'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Divida } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MoreHorizontal,
  Send,
  Check,
  X,
  Trash2,
  QrCode,
  MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'

interface DividaActionsProps {
  divida: Divida
}

export function DividaActions({ divida }: DividaActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('dividas')
      .update({ status: newStatus })
      .eq('id', divida.id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success('Status atualizado com sucesso')
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('dividas')
      .delete()
      .eq('id', divida.id)

    if (error) {
      toast.error('Erro ao excluir divida')
    } else {
      toast.success('Divida excluida com sucesso')
      router.refresh()
    }
    setLoading(false)
    setShowDeleteDialog(false)
  }

  const handleSendMessage = async () => {
    toast.info('Funcionalidade em desenvolvimento')
    // TODO: Implementar envio de mensagem
  }

  const handleGeneratePix = async () => {
    toast.info('Funcionalidade em desenvolvimento')
    // TODO: Implementar geracao de Pix
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acoes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSendMessage}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGeneratePix}>
            <QrCode className="mr-2 h-4 w-4" />
            Gerar Pix
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {divida.status !== 'pago' && (
            <DropdownMenuItem onClick={() => handleStatusChange('pago')}>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Marcar como Pago
            </DropdownMenuItem>
          )}
          {divida.status !== 'cancelado' && (
            <DropdownMenuItem onClick={() => handleStatusChange('cancelado')}>
              <X className="mr-2 h-4 w-4 text-yellow-600" />
              Cancelar Divida
            </DropdownMenuItem>
          )}
          {divida.status !== 'pendente' && (
            <DropdownMenuItem onClick={() => handleStatusChange('pendente')}>
              <Send className="mr-2 h-4 w-4" />
              Marcar como Pendente
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Divida</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a divida de {divida.nome_devedor}?
              Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
