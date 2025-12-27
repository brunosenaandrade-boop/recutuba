'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, Store, CreditCard, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { Config } from '@/types'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<Partial<Config>>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    async function fetchConfig() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      const { data } = await supabase
        .from('config')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (isMounted) {
        if (data) {
          setConfig(data)
        }
        setLoading(false)
      }
    }

    fetchConfig()

    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Usuario nao autenticado')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('config')
      .upsert({
        ...config,
        user_id: user.id,
      })

    if (error) {
      toast.error('Erro ao salvar: ' + error.message)
    } else {
      toast.success('Configuracoes salvas com sucesso!')
      router.refresh()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuracoes</h1>
          <p className="text-muted-foreground">
            Configure sua conta e integracoes
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Salvar Alteracoes
        </Button>
      </div>

      <Tabs defaultValue="loja" className="space-y-4">
        <TabsList>
          <TabsTrigger value="loja">
            <Store className="mr-2 h-4 w-4" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="pagamentos">
            <CreditCard className="mr-2 h-4 w-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="mr-2 h-4 w-4" />
            Notificacoes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loja">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Loja</CardTitle>
              <CardDescription>
                Informacoes basicas da sua loja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_loja">Nome da Loja</Label>
                  <Input
                    id="nome_loja"
                    value={config.nome_loja || ''}
                    onChange={(e) => setConfig({ ...config, nome_loja: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={config.email || ''}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone_whatsapp">Telefone WhatsApp (para receber notificacoes)</Label>
                <Input
                  id="telefone_whatsapp"
                  placeholder="48999999999"
                  value={config.telefone_whatsapp || ''}
                  onChange={(e) => setConfig({ ...config, telefone_whatsapp: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Gateway de Pagamento</CardTitle>
              <CardDescription>
                Configure o gateway para gerar cobranças Pix
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gateway_pagamento">Gateway</Label>
                <Select
                  value={config.gateway_pagamento || ''}
                  onValueChange={(value) => setConfig({ ...config, gateway_pagamento: value as 'asaas' | 'efi' | 'mercadopago' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asaas">Asaas</SelectItem>
                    <SelectItem value="efi">Efi (Gerencianet)</SelectItem>
                    <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateway_api_key">API Key / Access Token</Label>
                <Input
                  id="gateway_api_key"
                  type="password"
                  placeholder="Sua chave de API"
                  value={config.gateway_api_key || ''}
                  onChange={(e) => setConfig({ ...config, gateway_api_key: e.target.value })}
                />
              </div>
              {config.gateway_pagamento && (
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  {config.gateway_pagamento === 'asaas' && (
                    <p>Obtenha sua API Key em: minhaconta.asaas.com &gt; Integracoes &gt; API</p>
                  )}
                  {config.gateway_pagamento === 'efi' && (
                    <p>Obtenha suas credenciais em: gerencianet.com.br &gt; API &gt; Minhas Aplicacoes</p>
                  )}
                  {config.gateway_pagamento === 'mercadopago' && (
                    <p>Obtenha seu Access Token em: mercadopago.com.br &gt; Seu negocio &gt; Configuracoes &gt; Credenciais</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Notificacoes</CardTitle>
              <CardDescription>
                Configure como voce quer ser notificado sobre novas renegociacoes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificar via WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba uma mensagem quando um cliente quiser negociar
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notificar_whatsapp ?? true}
                    onChange={(e) => setConfig({ ...config, notificar_whatsapp: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificar via Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba um email quando um cliente quiser negociar
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notificar_email ?? true}
                    onChange={(e) => setConfig({ ...config, notificar_email: e.target.checked })}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
