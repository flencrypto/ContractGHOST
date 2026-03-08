import Link from "next/link"
import SidebarNav from "@/components/shell/sidebar-nav"

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-5 border-b border-vv-border">
        <Link href="/vault" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-vv bg-vv-card border border-vv-border grid place-items-center">
            <span className="text-sm font-semibold tracking-tight">VV</span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold">VinylVault</div>
            <div className="text-xs text-vv-text/60">Collector archive</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-3 py-4">
        <SidebarNav />
      </div>

      <div className="px-5 py-4 border-t border-vv-border text-xs text-vv-text/60">
        <div>Quiet, accurate, collector-first.</div>
      </div>
    </div>
  )
}
