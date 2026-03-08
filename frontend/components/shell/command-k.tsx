"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type Hit = { label: string; href: string; group: "Records" | "Pages" }

const mockHits: Hit[] = [
  { label: "Vault", href: "/vault", group: "Pages" },
  { label: "Library", href: "/library", group: "Pages" },
  { label: "Needs Review", href: "/review", group: "Pages" },
  { label: "Radiohead — OK Computer (example)", href: "/record/okc", group: "Records" },
  { label: "Aphex Twin — Selected Ambient Works (example)", href: "/record/saw", group: "Records" },
]

export default function CommandK() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const pages = useMemo(() => mockHits.filter((h) => h.group === "Pages"), [])
  const records = useMemo(() => mockHits.filter((h) => h.group === "Records"), [])

  return (
    <>
      <Button
        variant="outline"
        className="w-[320px] justify-start text-vv-text/70 border-vv-border bg-vv-panel hover:bg-vv-card"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2 text-vv-text/60" />
        Search your Vault…
        <span className="ml-auto text-xs text-vv-text/50">Ctrl K</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search records, cat#, barcode, matrix…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>

          <CommandGroup heading="Records">
            {records.map((h) => (
              <CommandItem
                key={h.href}
                onSelect={() => {
                  setOpen(false)
                  router.push(h.href)
                }}
              >
                {h.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Pages">
            {pages.map((h) => (
              <CommandItem
                key={h.href}
                onSelect={() => {
                  setOpen(false)
                  router.push(h.href)
                }}
              >
                {h.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
