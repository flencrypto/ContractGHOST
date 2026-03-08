import { Card } from "@/components/ui/card"

export default function AddPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Add / Scan</h1>
        <p className="text-sm text-vv-text/60 mt-1">Add records via quick entry, barcode, or photos.</p>
      </div>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Quick Add</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: QuickAddForm with artist, title, media/sleeve condition fields and autosave draft.
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Barcode</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: manual barcode entry or photo upload → candidate matches.
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Photos</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: upload front/back/labels/runout/inserts, attach to draft.
        </div>
      </Card>
    </div>
  )
} 
