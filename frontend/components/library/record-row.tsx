import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function RecordRow({
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
    <Link
      href={`/record/${record.id}`}
      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-vv-card transition-colors"
    >
      <div className="min-w-0">
        <div className="font-medium truncate">{record.artist} — {record.title}</div>
        <div className="text-xs text-vv-text/60">
          {record.format ?? "—"} • {record.country ?? "—"} • {record.year ?? "—"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {record.hasPhotos ? <Badge variant="secondary" className="text-xs">Photos</Badge> : null}
        {record.needsReview ? <Badge variant="destructive" className="text-xs">Review</Badge> : null}
      </div>
    </Link>
  )
}
