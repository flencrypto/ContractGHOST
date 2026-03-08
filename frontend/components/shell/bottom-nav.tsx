"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, LibraryBig, PlusCircle, ClipboardList, Settings } from "lucide-react"

const items = [
  { href: "/vault", label: "Vault", icon: Home },
  { href: "/library", label: "Library", icon: LibraryBig },
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/review", label: "Review", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-5">
      {items.map((it) => {
        const active = pathname === it.href || pathname.startsWith(it.href + "/")
        const Icon = it.icon
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2 text-xs",
              active ? "text-vv-cyan" : "text-vv-text/70"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="leading-none">{it.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
