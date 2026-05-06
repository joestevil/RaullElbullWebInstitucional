import AppShell from "@/components/AppShell";

// Forzar renderizado dinámico para todas las páginas del dashboard
// ya que requieren autenticación y no pueden ser pre-renderizadas estáticamente
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
