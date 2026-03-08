"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  LibraryBig,
  PlusCircle,
  ClipboardList,
  BarChart3,
  FileText,
  Settings,
  PlugZap,
} from "lucide-react"

const nav = [
  { href: "/vault", label: "Vault", icon: Home },
  { href: "/library", label: "Library", icon: LibraryBig },
  { href: "/add", label: "Add / Scan", icon: PlusCircle },
  { href: "/review", label: "Needs Review", icon: ClipboardList },
  { href: "/valuation", label: "Valuation", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/integrations", label: "Integrations", icon: PlugZap },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="space-y-1">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-vv px-3 py-2 text-sm transition-colors",
              "hover:bg-vv-card hover:text-vv-text",
              active ? "bg-vv-card text-vv-text border border-vv-border" : "text-vv-text/75"
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-vv-cyan" : "text-vv-text/60")} />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
