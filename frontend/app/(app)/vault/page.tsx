import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vault</h1>
        <p className="text-sm text-vv-text/60 mt-1">Your collector archive at a glance.</p>
      </div>

      {/* Totals row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total records", value: "—" },
          { label: "Artists", value: "—" },
          { label: "Labels", value: "—" },
          { label: "Needs review", value: "—", href: "/review", accent: true },
        ].map((stat) => (
          <Card key={stat.label} className="bg-vv-panel border-vv-border p-4">
            {stat.href ? (
              <Link href={stat.href} className="block">
                <div className="text-xs text-vv-text/60">{stat.label}</div>
                <div className="mt-1 text-2xl font-bold text-vv-cyan">{stat.value}</div>
              </Link>
            ) : (
              <>
                <div className="text-xs text-vv-text/60">{stat.label}</div>
                <div className="mt-1 text-2xl font-bold">{stat.value}</div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Main row */}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="bg-vv-panel border-vv-border p-4">
          <div className="font-semibold">Recently Added</div>
          <div className="mt-4 text-sm text-vv-text/60">
            Placeholder: last 10 added records with artist / title / date added.
          </div>
        </Card>

        <Card className="bg-vv-panel border-vv-border p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Needs Review</div>
            <Badge variant="destructive" className="text-xs">0</Badge>
          </div>
          <div className="mt-4 text-sm text-vv-text/60">
            Placeholder: top 5 items from{" "}
            <Link href="/review" className="text-vv-cyan underline underline-offset-2">
              review queue
            </Link>
            .
          </div>
        </Card>
      </div>

      {/* Value snapshot */}
      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Value Snapshot</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: collection value range, confidence distribution, link to{" "}
          <Link href="/valuation" className="text-vv-cyan underline underline-offset-2">
            Valuation
          </Link>
          .
        </div>
      </Card>
    </div>
  )
}
