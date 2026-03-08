"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Camera, Download, Pencil } from "lucide-react"

import OverviewTab from "@/components/record/tabs/overview-tab"
import VariantTab from "@/components/record/tabs/variant-tab"
import ConditionTab from "@/components/record/tabs/condition-tab"
import ValueTab from "@/components/record/tabs/value-tab"
import MediaTab from "@/components/record/tabs/media-tab"
import ActivityTab from "@/components/record/tabs/activity-tab"

export default function RecordDetailClient({
  record,
}: {
  record: {
    id: string
    artist: string
    title: string
    label?: string
    cat?: string
    year?: string
    country?: string
    format?: string
    condition?: { media?: string; sleeve?: string }
    variantConfidence?: "High" | "Medium" | "Low"
    valuationConfidence?: "High" | "Medium" | "Low"
  }
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <Card className="bg-vv-panel border-vv-border p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="text-lg md:text-xl font-semibold tracking-tight truncate">
              {record.artist} — {record.title}
            </div>

            <div className="mt-1 text-sm text-vv-text/65">
              {(record.label ?? "—")}{record.cat ? ` • ${record.cat}` : ""}{" "}
              <span className="mx-1">•</span>
              {record.format ?? "—"}{" "}
              <span className="mx-1">•</span>
              {record.country ?? "—"}{" "}
              <span className="mx-1">•</span>
              {record.year ?? "—"}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Media: {record.condition?.media ?? "—"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Sleeve: {record.condition?.sleeve ?? "—"}
              </Badge>

              <Badge className="text-xs" variant="outline">
                Variant confidence: {record.variantConfidence ?? "—"}
              </Badge>
              <Badge className="text-xs" variant="outline">
                Valuation confidence: {record.valuationConfidence ?? "—"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card">
              <Camera className="h-4 w-4 mr-2" />
              Add photo
            </Button>
            <Button variant="outline" className="border-vv-border bg-vv-panel hover:bg-vv-card" asChild>
              <Link href="/reports">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-4 bg-vv-divider" />

        <div className="text-xs text-vv-text/60">
          Tip: keep the archive clean — resolve the pressing and add at least one label/runout photo for high confidence.
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-vv-panel border border-vv-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variant">Pressing / Variant</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
          <TabsTrigger value="value">Value</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab record={record} />
        </TabsContent>

        <TabsContent value="variant">
          <VariantTab record={record} />
        </TabsContent>

        <TabsContent value="condition">
          <ConditionTab record={record} />
        </TabsContent>

        <TabsContent value="value">
          <ValueTab record={record} />
        </TabsContent>

        <TabsContent value="media">
          <MediaTab />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
