import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-vv-text/60 mt-1">Manage your account and preferences.</p>
      </div>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Preferences</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: grading system, default format, conservative grading toggle, display currency.
        </div>
      </Card>

      <Card className="bg-vv-panel border-vv-border p-4">
        <div className="font-semibold">Account</div>
        <div className="mt-4 text-sm text-vv-text/60">
          Placeholder: email, password change, export all data, delete account.
        </div>
      </Card>
    </div>
  )
}
