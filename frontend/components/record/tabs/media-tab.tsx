import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function MediaTab() {
  return (
    <Card className="bg-vv-panel border-vv-border p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Media</div>
        <Button>Add photos</Button>
      </div>
      <Separator className="my-3 bg-vv-divider" />
      <div className="text-sm text-vv-text/70">
        Placeholder: gallery for front/back/labels/runouts/inserts with lightbox.
      </div>
    </Card>
  )
}
