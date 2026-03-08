import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Plus, Search } from "lucide-react"
import CommandK from "@/components/shell/command-k"

export default function Topbar() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/vault" className="font-semibold tracking-tight">
          VinylVault
        </Link>
      </div>

      <div className="flex-1" />

      {/* Global search (Command palette trigger) */}
      <div className="hidden sm:flex items-center gap-2">
        <CommandK />
      </div>

      <Button asChild className="hidden sm:inline-flex">
        <Link href="/add">
          <Plus className="h-4 w-4 mr-2" />
          Add record
        </Link>
      </Button>

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>

      {/* Mobile search + add */}
      <div className="flex sm:hidden items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
        <Button asChild size="icon" aria-label="Add">
          <Link href="/add">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
