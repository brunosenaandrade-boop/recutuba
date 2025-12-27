'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Upload, FileSpreadsheet, Check, X, Loader2, Download } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

interface DividaImport {
  nome_devedor: string
  telefone: string
  valor: number
  data_vencimento: string
  valid: boolean
  error?: string
}

export default function ImportarDividasPage() {
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [dividas, setDividas] = useState<DividaImport[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const parseDate = (value: unknown): string | null => {
    if (!value) return null

    // Se for numero (Excel date serial)
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value)
      if (date) {
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
      }
    }

    // Se for string
    if (typeof value === 'string') {
      // Tenta formato dd/mm/yyyy
      const brMatch = value.match(/(\d{2})\/(\d{2})\/(\d{4})/)
      if (brMatch) {
        return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`
      }
      // Tenta formato yyyy-mm-dd
      const isoMatch = value.match(/(\d{4})-(\d{2})-(\d{2})/)
      if (isoMatch) {
        return value
      }
    }

    return null
  }

  const parsePhone = (value: unknown): string => {
    if (!value) return ''
    return String(value).replace(/\D/g, '')
  }

  const parseValue = (value: unknown): number => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      // Remove R$, espacos e troca virgula por ponto
      const cleaned = value.replace(/[R$\s]/g, '').replace(',', '.')
      return parseFloat(cleaned) || 0
    }
    return 0
  }

  const validateDivida = (divida: DividaImport): DividaImport => {
    const errors: string[] = []

    if (!divida.nome_devedor || divida.nome_devedor.trim().length < 2) {
      errors.push('Nome invalido')
    }

    if (!divida.telefone || divida.telefone.length < 10) {
      errors.push('Telefone invalido')
    }

    if (!divida.valor || divida.valor <= 0) {
      errors.push('Valor invalido')
    }

    if (!divida.data_vencimento) {
      errors.push('Data invalida')
    }

    return {
      ...divida,
      valid: errors.length === 0,
      error: errors.length > 0 ? errors.join(', ') : undefined
    }
  }

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

        // Pula a primeira linha (cabecalho)
        const rows = jsonData.slice(1)

        const parsedDividas: DividaImport[] = rows
          .filter((row: unknown[]) => row.length >= 4 && row[0])
          .map((row: unknown[]) => {
            const divida: DividaImport = {
              nome_devedor: String(row[0] || '').trim(),
              telefone: parsePhone(row[1]),
              valor: parseValue(row[2]),
              data_vencimento: parseDate(row[3]) || '',
              valid: true
            }
            return validateDivida(divida)
          })

        setDividas(parsedDividas)
        toast.success(`${parsedDividas.length} dividas encontradas`)
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        toast.error('Erro ao processar arquivo')
      }
      setLoading(false)
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const handleImport = async () => {
    const validDividas = dividas.filter(d => d.valid)
    if (validDividas.length === 0) {
      toast.error('Nenhuma divida valida para importar')
      return
    }

    setImporting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Usuario nao autenticado')
      setImporting(false)
      return
    }

    const { error } = await supabase
      .from('dividas')
      .insert(
        validDividas.map(d => ({
          user_id: user.id,
          nome_devedor: d.nome_devedor,
          telefone: d.telefone,
          valor: d.valor,
          data_vencimento: d.data_vencimento,
        }))
      )

    if (error) {
      toast.error('Erro ao importar dividas: ' + error.message)
      setImporting(false)
      return
    }

    toast.success(`${validDividas.length} dividas importadas com sucesso!`)
    router.push('/dividas')
    router.refresh()
  }

  const downloadTemplate = () => {
    const template = [
      ['Nome', 'Telefone', 'Valor', 'Vencimento'],
      ['Joao da Silva', '48999999999', '150.00', '2025-01-15'],
      ['Maria Santos', '48988888888', '250.50', '2025-01-20'],
    ]
    const ws = XLSX.utils.aoa_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dividas')
    XLSX.writeFile(wb, 'modelo_dividas.xlsx')
  }

  const validCount = dividas.filter(d => d.valid).length
  const invalidCount = dividas.filter(d => !d.valid).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dividas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Importar Dividas</h1>
          <p className="text-muted-foreground">
            Importe dividas a partir de uma planilha Excel ou CSV
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
            <CardDescription>
              Selecione um arquivo .xlsx, .xls ou .csv
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {fileName || 'Clique para selecionar um arquivo'}
                </span>
              </label>
            </div>

            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar Modelo de Planilha
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formato Esperado</CardTitle>
            <CardDescription>
              Sua planilha deve ter as seguintes colunas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coluna</TableHead>
                  <TableHead>Exemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nome</TableCell>
                  <TableCell>Joao da Silva</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Telefone</TableCell>
                  <TableCell>48999999999</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Valor</TableCell>
                  <TableCell>150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Vencimento</TableCell>
                  <TableCell>2025-01-15 ou 15/01/2025</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {dividas.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pre-visualizacao</CardTitle>
                <CardDescription>
                  {validCount} validas, {invalidCount} com erro
                </CardDescription>
              </div>
              <Button onClick={handleImport} disabled={importing || validCount === 0}>
                {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Importar {validCount} Dividas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">OK</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Erro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dividas.map((divida, index) => (
                    <TableRow key={index} className={!divida.valid ? 'bg-red-50' : ''}>
                      <TableCell>
                        {divida.valid ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>{divida.nome_devedor}</TableCell>
                      <TableCell>{divida.telefone}</TableCell>
                      <TableCell>R$ {divida.valor.toFixed(2)}</TableCell>
                      <TableCell>{divida.data_vencimento}</TableCell>
                      <TableCell className="text-red-600 text-sm">
                        {divida.error}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
