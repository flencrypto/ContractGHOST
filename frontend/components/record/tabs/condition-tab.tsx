import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ConditionTab({ record }: { record: any }) {
  return (
    <Card className="bg-vv-panel border-vv-border p-4">
      <div className="font-semibold">Condition</div>
      <Separator className="my-3 bg-vv-divider" />
      <div className="text-sm text-vv-text/70 space-y-2">
        <div>Media: <span className="text-vv-text">{record.condition?.media ?? "—"}</span></div>
        <div>Sleeve: <span className="text-vv-text">{record.condition?.sleeve ?? "—"}</span></div>
        <div className="text-vv-text/60">
          Placeholder: grading helper, playback notes, inserts toggles, private vs buyer notes.
        </div>
      </div>
    </Card>
  )
}
