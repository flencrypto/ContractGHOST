import { Card } from "@/components/ui/card"

export default function ValuationPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Valuation</h1>
        <p className="text-sm text-vv-text/60 mt-1">Collection-wide value insights.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-vv-panel border-vv-border p-4">
          <div className="text-xs text-vv-text/60">Collection low</div>
          <div className="mt-1 text-2xl font-bold">—</div>
        </Card>
        <Card className="bg-vv-panel border-vv-border p-4">
          <div className="text-xs text-vv-text/60">Collection mid</div>
          <div className="mt-1 text-2xl font-bold">—</div>
        </Card>
        <Card className="bg-vv-panel border-vv-border p-4">
          <div className="text-xs text-vv-text/60">Collection high</div>
          <div className="mt-1 text-2xl font-bold">—</div>
        </Card>
      </div>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Confidence Distribution</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: breakdown of high/medium/low confidence valuations.
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Weak Data — Records to Improve</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: list of items that would improve with matrix/photos.
        </div>
      </Card>
    </div>
  )
}
