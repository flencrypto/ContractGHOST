import RecordDetailClient from "@/components/record/record-detail-client"

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // MVP: mock record. Replace with DB fetch.
  const record = {
    id,
    artist: "Radiohead",
    title: "OK Computer",
    label: "Parlophone",
    cat: "NODATA",
    year: "1997",
    country: "UK",
    format: "LP",
    condition: { media: "VG+", sleeve: "VG" },
    variantConfidence: "Medium" as const,
    valuationConfidence: "Low" as const,
  }

  return <RecordDetailClient record={record} />
}
