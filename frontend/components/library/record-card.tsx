import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function RecordCard({
  record,
}: {
  record: {
    id: string
    artist: string
    title: string
    year?: string
    country?: string
    format?: string
    hasPhotos?: boolean
    needsReview?: boolean
  }
}) {
  return (
    <Link href={`/record/${record.id}`}>
      <Card className="bg-vv-panel border-vv-border p-4 hover:bg-vv-card transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold truncate">{record.artist}</div>
            <div className="text-sm text-vv-text/70 truncate">{record.title}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {record.needsReview ? (
              <Badge variant="destructive" className="text-xs">Review</Badge>
            ) : null}
            {record.hasPhotos ? (
              <Badge variant="secondary" className="text-xs">Photos</Badge>
            ) : null}
          </div>
        </div>

        <div className="mt-3 text-xs text-vv-text/60 flex gap-2">
          <span>{record.format ?? "—"}</span>
          <span>•</span>
          <span>{record.country ?? "—"}</span>
          <span>•</span>
          <span>{record.year ?? "—"}</span>
        </div>
      </Card>
    </Link>
  )
}
