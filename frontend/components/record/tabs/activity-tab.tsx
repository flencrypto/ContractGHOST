import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ActivityTab() {
  return (
    <Card className="bg-vv-panel border-vv-border p-4">
      <div className="font-semibold">Activity</div>
      <Separator className="my-3 bg-vv-divider" />
      <div className="text-sm text-vv-text/70">
        Placeholder: audit trail (edits, resolver decisions, valuation updates, imports).
      </div>
    </Card>
  )
}
