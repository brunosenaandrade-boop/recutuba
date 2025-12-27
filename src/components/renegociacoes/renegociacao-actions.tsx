'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  MoreHorizontal,
  Phone,
  Check,
  X,
  QrCode,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface RenegociacaoActionsProps {
  renegociacao: {
    id: string
    divida_id: string
    status: string
    divida?: {
      telefone: string
      nome_devedor: string
      valor: number
    }
  }
}

export function RenegociacaoActions({ renegociacao }: RenegociacaoActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('renegociacoes')
      .update({ status: newStatus })
      .eq('id', renegociacao.id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success('Status atualizado')

      // Se resolvido, marcar divida como paga
      if (newStatus === 'resolvido') {
        await supabase
          .from('dividas')
          .update({ status: 'pago' })
          .eq('id', renegociacao.divida_id)
      }

      router.refresh()
    }
    setLoading(false)
  }

  const openWhatsApp = () => {
    const phone = renegociacao.divida?.telefone
    if (phone) {
      const formattedPhone = phone.startsWith('55') ? phone : `55${phone}`
      window.open(`https://wa.me/${formattedPhone}`, '_blank')
    }
  }

  const handleGeneratePix = async () => {
    toast.info('Funcionalidade em desenvolvimento')
    // TODO: Implementar geracao de Pix
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acoes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={openWhatsApp}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGeneratePix}>
          <QrCode className="mr-2 h-4 w-4" />
          Gerar Pix
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {renegociacao.status === 'novo' && (
          <DropdownMenuItem onClick={() => handleStatusChange('em_contato')}>
            <Phone className="mr-2 h-4 w-4 text-blue-600" />
            Marcar Em Contato
          </DropdownMenuItem>
        )}
        {renegociacao.status !== 'resolvido' && (
          <DropdownMenuItem onClick={() => handleStatusChange('resolvido')}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Marcar como Resolvido
          </DropdownMenuItem>
        )}
        {renegociacao.status !== 'perdido' && (
          <DropdownMenuItem onClick={() => handleStatusChange('perdido')}>
            <X className="mr-2 h-4 w-4 text-red-600" />
            Marcar como Perdido
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
