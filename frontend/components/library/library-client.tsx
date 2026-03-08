"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import RecordCard from "@/components/library/record-card"
import RecordRow from "@/components/library/record-row"

type MockRecord = {
  id: string
  artist: string
  title: string
  label?: string
  cat?: string
  year?: string
  country?: string
  format?: "LP" | "12\"" | "7\"" | "EP"
  hasPhotos?: boolean
  needsReview?: boolean
}

const MOCK: MockRecord[] = [
  { id: "okc", artist: "Radiohead", title: "OK Computer", label: "Parlophone", cat: "NODATA", year: "1997", country: "UK", format: "LP", hasPhotos: true },
  { id: "saw", artist: "Aphex Twin", title: "Selected Ambient Works 85–92", year: "1992", country: "UK", format: "LP", needsReview: true },
  { id: "blue", artist: "Joni Mitchell", title: "Blue", year: "1971", country: "US", format: "LP" },
  { id: "kind", artist: "Miles Davis", title: "Kind of Blue", year: "1959", country: "US", format: "LP", hasPhotos: true },
]

type ViewMode = "grid" | "list"

export default function LibraryClient() {
  const [view, setView] = useState<ViewMode>("grid")
  const [q, setQ] = useState("")
  const [filters, setFilters] = useState({
    hasPhotos: false,
    needsReview: false,
    formatLP: false,
    format12: false,
    format7: false,
    formatEP: false,
  })

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()

    return MOCK.filter((r) => {
      if (query) {
        const hay = `${r.artist} ${r.title} ${r.label ?? ""} ${r.cat ?? ""}`.toLowerCase()
        if (!hay.includes(query)) return false
      }

      if (filters.hasPhotos && !r.hasPhotos) return false
      if (filters.needsReview && !r.needsReview) return false

      const formatFiltersOn =
        filters.formatLP || filters.format12 || filters.format7 || filters.formatEP

      if (formatFiltersOn) {
        const f = r.format
        const ok =
          (filters.formatLP && f === "LP") ||
          (filters.format12 && f === '12"') ||
          (filters.format7 && f === '7"') ||
          (filters.formatEP && f === "EP")
        if (!ok) return false
      }

      return true
    })
  }, [q, filters])

  const FiltersPanel = (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium">Flags</div>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm text-vv-text/80">
            <Checkbox
              checked={filters.hasPhotos}
              onCheckedChange={(v) => setFilters((s) => ({ ...s, hasPhotos: Boolean(v) }))}
            />
            Has photos
          </label>
          <label className="flex items-center gap-2 text-sm text-vv-text/80">
            <Checkbox
              checked={filters.needsReview}
              onCheckedChange={(v) => setFilters((s) => ({ ...s, needsReview: Boolean(v) }))}
            />
            Needs review
          </label>
        </div>
      </div>

      <Separator className="bg-vv-divider" />

      <div>
        <div className="text-sm font-medium">Format</div>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm text-vv-text/80">
            <Checkbox
              checked={filters.formatLP}
              onCheckedChange={(v) => setFilters((s) => ({ ...s, formatLP: Boolean(v) }))}
            />
            LP
          </label>
          <label className="flex items-center gap-2 text-sm text-vv-text/80">
            <Checkbox
              checked={filters.format12}
              onCheckedChange={(v) => setFilters((s) => ({ ...s, format12: Boolean(v) }))}
            />
            12&quot;
          </label>
          <label className="flex items-center gap-2 text-sm text-vv-text/80">
            <Checkbox
              checked={filters.format7}
              onCheckedChange={(v) => setFilters((s) => ({ ...s, format7: Boolean(v) }))}
            />
            7&quot;
          </label>
          <label className="flex items-center gap-2 text-sm text-vv-text/80">
            <Checkbox
              checked={filters.formatEP}
              onCheckedChange={(v) => setFilters((s) => ({ ...s, formatEP: Boolean(v) }))}
            />
            EP
          </label>
        </div>
      </div>

      <Separator className="bg-vv-divider" />

      <Button
        variant="outline"
        className="w-full border-vv-border bg-vv-panel hover:bg-vv-card"
        onClick={() =>
          setFilters({
            hasPhotos: false,
            needsReview: false,
            formatLP: false,
            format12: false,
            format7: false,
            formatEP: false,
          })
        }
      >
        Clear filters
      </Button>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Library</h1>
          <p className="text-sm text-vv-text/60">Browse, filter, and open records in your Vault.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn("border-vv-border bg-vv-panel hover:bg-vv-card", view === "grid" && "ring-2 ring-vv-cyan ring-offset-2 ring-offset-vv-bg")}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn("border-vv-border bg-vv-panel hover:bg-vv-card", view === "list" && "ring-2 ring-vv-cyan ring-offset-2 ring-offset-vv-bg")}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>

          {/* Mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden border-vv-border bg-vv-panel hover:bg-vv-card">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-vv-panel text-vv-text border-vv-border">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">{FiltersPanel}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search artist, title, label, cat#…"
          className="bg-vv-panel border-vv-border"
        />
        <div className="hidden md:block text-sm text-vv-text/60 whitespace-nowrap">
          {results.length} result{results.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[280px_1fr]">
        {/* Desktop filters */}
        <Card className="hidden md:block bg-vv-panel border-vv-border p-4 h-fit">
          <div className="text-sm font-semibold">Filters</div>
          <div className="mt-4">{FiltersPanel}</div>
        </Card>

        {/* Results */}
        <div className="space-y-3">
          <div className="md:hidden text-sm text-vv-text/60">
            {results.length} result{results.length === 1 ? "" : "s"}
          </div>

          {view === "grid" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((r) => (
                <RecordCard key={r.id} record={r} />
              ))}
            </div>
          ) : (
            <Card className="bg-vv-panel border-vv-border overflow-hidden">
              <div className="divide-y divide-vv-border">
                {results.map((r) => (
                  <RecordRow key={r.id} record={r} />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
