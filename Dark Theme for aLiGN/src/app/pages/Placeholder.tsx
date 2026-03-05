import React from "react"
import { Badge } from "../components/ui/badge"

export function PlaceholderPage({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-6 h-full min-h-[500px] items-center justify-center text-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all"></div>
        <div className="w-24 h-24 rounded-full border border-primary bg-surface flex items-center justify-center relative z-10 glow-primary">
           <span className="text-primary font-mono text-3xl">_</span>
        </div>
      </div>
      <div className="max-w-md">
        <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-text-muted font-mono text-sm uppercase tracking-widest">{desc}</p>
        <div className="mt-8 pt-8 border-t border-border-subtle flex flex-col items-center gap-4">
           <Badge variant="live">MODULE LOADING</Badge>
           <span className="text-xs text-text-muted font-mono">CONNECTION ESTABLISHED... AWAITING DATA STREAM</span>
        </div>
      </div>
    </div>
  )
}
