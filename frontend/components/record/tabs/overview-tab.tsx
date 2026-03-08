import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OverviewTab({ record }: { record: any }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Metadata</div>
        <Separator className="my-3 bg-vv-divider" />
        <div className="text-sm text-vv-text/75 space-y-2">
          <div>Artist: <span className="text-vv-text">{record.artist}</span></div>
          <div>Title: <span className="text-vv-text">{record.title}</span></div>
          <div>Label/Cat#: <span className="text-vv-text">{record.label ?? "—"} {record.cat ?? ""}</span></div>
          <div>Format: <span className="text-vv-text">{record.format ?? "—"}</span></div>
          <div>Country/Year: <span className="text-vv-text">{record.country ?? "—"} / {record.year ?? "—"}</span></div>
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Provenance</div>
        <Separator className="my-3 bg-vv-divider" />
        <div className="text-sm text-vv-text/70">
          Placeholder: acquisition date, seller/shop, price paid, notes.
        </div>
      </Card>
    </div>
  )
}
