import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VariantTab({ record }: { record: any }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Variant Resolver</div>
        <Separator className="my-3 bg-vv-divider" />
        <div className="text-sm text-vv-text/70 space-y-3">
          <div>Current state: <span className="text-vv-text">{record.variantConfidence ?? "—"} confidence</span></div>
          <div className="text-vv-text/60">
            Placeholder: candidate pressings list + &ldquo;what to check next&rdquo; checklist.
          </div>
          <div className="flex gap-2">
            <Button>Find candidates</Button>
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card">
              Add matrix/runout
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Matrix / Runouts</div>
        <Separator className="my-3 bg-vv-divider" />
        <div className="text-sm text-vv-text/70">
          Placeholder: Side A / Side B entry, label text, barcode.
        </div>
      </Card>
    </div>
  )
}
