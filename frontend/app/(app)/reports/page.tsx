import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-vv-text/60 mt-1">Build and export collection reports.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="bg-vv-panel border-vv-border p-4 h-fit space-y-4">
          <div className="font-semibold">Report Builder</div>
          <div className="text-sm text-vv-text/60 space-y-2">
            <p>Placeholder: scope selector (whole vault / saved crate / filtered), include photos toggle, include private notes toggle.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card">Export PDF</Button>
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card">Export CSV</Button>
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card">Export JSON</Button>
          </div>
        </Card>

        <Card className="bg-vv-panel border-vv-border p-4">
          <div className="font-semibold">Preview</div>
          <div className="mt-4 text-sm text-vv-text/60">
            Placeholder: live preview of the report output.
          </div>
        </Card>
      </div>
    </div>
  )
}
