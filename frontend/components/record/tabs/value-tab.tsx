import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ValueTab({ record }: { record: any }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Valuation</div>
        <Separator className="my-3 bg-vv-divider" />
        <div className="text-sm text-vv-text/70 space-y-2">
          <div>Estimated range: <span className="text-vv-text">—</span></div>
          <div>Confidence: <span className="text-vv-text">{record.valuationConfidence ?? "—"}</span></div>
          <div className="text-vv-text/60">
            Placeholder: comps table with filters (exact pressing, condition, region, recency).
          </div>
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">What would improve confidence</div>
        <Separator className="my-3 bg-vv-divider" />
        <ul className="text-sm text-vv-text/70 list-disc pl-5 space-y-1">
          <li>Add runout photo or matrix text</li>
          <li>Confirm label variation / cat#</li>
          <li>Add condition notes (playback)</li>
        </ul>
      </Card>
    </div>
  )
}
