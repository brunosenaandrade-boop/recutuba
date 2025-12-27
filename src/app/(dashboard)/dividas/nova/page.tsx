'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NovaDividaPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome_devedor: '',
    telefone: '',
    valor: '',
    data_vencimento: '',
    observacoes: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Usuario nao autenticado')
      setLoading(false)
      return
    }

    const telefoneNumeros = formData.telefone.replace(/\D/g, '')

    if (telefoneNumeros.length < 10) {
      toast.error('Telefone invalido')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('dividas')
      .insert({
        user_id: user.id,
        nome_devedor: formData.nome_devedor,
        telefone: telefoneNumeros,
        valor: parseFloat(formData.valor),
        data_vencimento: formData.data_vencimento,
        observacoes: formData.observacoes || null,
      })

    if (error) {
      toast.error('Erro ao cadastrar divida: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Divida cadastrada com sucesso!')
    router.push('/dividas')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dividas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Divida</h1>
          <p className="text-muted-foreground">
            Cadastre uma nova divida manualmente
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados da Divida</CardTitle>
          <CardDescription>
            Preencha os dados do devedor e da divida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome_devedor">Nome do Devedor *</Label>
                <Input
                  id="nome_devedor"
                  placeholder="Joao da Silva"
                  value={formData.nome_devedor}
                  onChange={(e) => setFormData({ ...formData, nome_devedor: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone (WhatsApp) *</Label>
                <Input
                  id="telefone"
                  placeholder="(48) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="150.00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observacoes</Label>
              <Textarea
                id="observacoes"
                placeholder="Informacoes adicionais sobre a divida..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button asChild variant="outline">
                <Link href="/dividas">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cadastrar Divida
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
