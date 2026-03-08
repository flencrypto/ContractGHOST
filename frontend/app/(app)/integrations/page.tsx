import { Card } from "@/components/ui/card"

export default function IntegrationsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-sm text-vv-text/60 mt-1">Connect external services and import sources.</p>
      </div>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Discogs</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: OAuth connect, import collection, sync comps.
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Import / Export</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: CSV/JSON bulk import, full export.
        </div>
      </Card>
    </div>
  )
}
