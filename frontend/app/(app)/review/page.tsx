import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ISSUE_TYPES = [
  "Variant unresolved",
  "Missing Cat#/Label",
  "Missing condition",
  "Duplicate suspected",
  "Photos needed",
  "Conflicting metadata",
]

export default function ReviewPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Needs Review</h1>
          <p className="text-sm text-vv-text/60 mt-1">0 items to review.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ISSUE_TYPES.map((t) => (
          <Badge key={t} variant="outline" className="cursor-pointer hover:bg-vv-card">
            {t}
          </Badge>
        ))}
      </div>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Review Queue</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: ReviewItemCard list — each showing issue badge, record preview, &ldquo;Fix now&rdquo; and &ldquo;Snooze&rdquo; actions.
        </div>
      </Card>
    </div>
  )
}
