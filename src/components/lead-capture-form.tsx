'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle, Gift, ArrowRight } from 'lucide-react'

interface LeadCaptureFormProps {
  className?: string
  variant?: 'hero' | 'inline' | 'modal'
}

export function LeadCaptureForm({ className = '', variant = 'hero' }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Capturar UTM params da URL
      const urlParams = new URLSearchParams(window.location.search)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          whatsapp,
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
            Em breve entraremos em contato pelo WhatsApp com acesso exclusivo ao sistema.
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
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
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
              <Input
                type="tel"
                placeholder="WhatsApp (XX) XXXXX-XXXX"
                value={whatsapp}
                onChange={handleWhatsappChange}
                required
                className="h-12 text-base"
                maxLength={16}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-semibold shadow-lg shadow-green-600/30 group"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Gift className="mr-2 w-5 h-5" />
              )}
              Quero Acesso Gratuito
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Seus dados estao seguros. Nao enviamos spam.
          </p>
        </div>
      </form>
    </div>
  )
}
