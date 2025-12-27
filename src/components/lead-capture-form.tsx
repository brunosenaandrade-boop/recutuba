'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle, Gift, ArrowRight, AlertCircle, Phone } from 'lucide-react'

interface LeadCaptureFormProps {
  className?: string
  variant?: 'hero' | 'inline' | 'modal'
}

export function LeadCaptureForm({ className = '', variant = 'hero' }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [whatsappVerified, setWhatsappVerified] = useState(false)
  const [whatsappError, setWhatsappError] = useState<string | null>(null)

  const formatWhatsapp = (value: string) => {
    // Remove tudo que nao e numero
    const numbers = value.replace(/\D/g, '')

    // Formata como (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value)
    setWhatsapp(formatted)
    // Reset verification when number changes
    setWhatsappVerified(false)
    setWhatsappError(null)
  }

  const verifyWhatsapp = async () => {
    const numbers = whatsapp.replace(/\D/g, '')
    if (numbers.length < 10) {
      setWhatsappError('Numero muito curto')
      return false
    }

    setVerifying(true)
    setWhatsappError(null)

    try {
      const response = await fetch('/api/verify-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp }),
      })

      const data = await response.json()

      if (!data.valid) {
        setWhatsappError(data.error || 'Numero nao e WhatsApp')
        setWhatsappVerified(false)
        return false
      }

      setWhatsappVerified(true)
      setWhatsappError(null)
      return true
    } catch (err) {
      setWhatsappError('Erro ao verificar numero')
      return false
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Verificar WhatsApp se ainda nao foi verificado
    if (!whatsappVerified) {
      const isValid = await verifyWhatsapp()
      if (!isValid) {
        return
      }
    }

    setLoading(true)

    try {
      // Capturar UTM params da URL
      const urlParams = new URLSearchParams(window.location.search)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          whatsapp,
          whatsapp_verificado: true, // Ja foi verificado antes de chegar aqui
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar cadastro')
      }

      setSuccess(true)
      setEmail('')
      setWhatsapp('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar cadastro')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`${className} text-center`}>
        <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-8 max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Cadastro realizado!</h3>
          <p className="text-gray-600">
            Voce recebeu uma mensagem no WhatsApp confirmando seu cadastro. Em breve entraremos em contato com mais informacoes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Gift className="w-4 h-4" />
              ACESSO ANTECIPADO GRATUITO
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Seja um dos primeiros a testar
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Vagas limitadas para acesso beta
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            <div>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="WhatsApp (XX) XXXXX-XXXX"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  required
                  className={`h-12 text-base pr-10 ${
                    whatsappError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : whatsappVerified
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                        : ''
                  }`}
                  maxLength={16}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {verifying ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : whatsappVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : whatsappError ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Phone className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              {whatsappError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {whatsappError}
                </p>
              )}
              {whatsappVerified && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  WhatsApp verificado!
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || verifying}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-semibold shadow-lg shadow-green-600/30 group"
            >
              {loading || verifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {verifying ? 'Verificando WhatsApp...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  <Gift className="mr-2 w-5 h-5" />
                  Quero Acesso Gratuito
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Seus dados estao seguros. Verificamos o WhatsApp para garantir contato.
          </p>
        </div>
      </form>
    </div>
  )
}
