import type { ReactNode } from "react"
import Sidebar from "@/components/shell/sidebar"
import Topbar from "@/components/shell/topbar"
import BottomNav from "@/components/shell/bottom-nav"

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-vv-bg text-vv-text">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-72 lg:w-80 border-r border-vv-border bg-vv-panel">
          <Sidebar />
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-vv-border bg-vv-panel/95 backdrop-blur">
            <Topbar />
          </header>

          <main className="flex-1 px-4 py-5 md:px-6 lg:px-8 pb-20 md:pb-6">
            {children}
          </main>

          {/* Mobile bottom nav */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-vv-border bg-vv-panel/95 backdrop-blur">
            <BottomNav />
          </nav>
        </div>
      </div>
    </div>
  )
}
