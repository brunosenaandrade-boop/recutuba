import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar config do lojista
  const { data: config } = await supabase
    .from('config')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} config={config} />
      <SidebarInset>
        <DashboardHeader user={user} config={config} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
