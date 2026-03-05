import React from "react"
import { Outlet } from "react-router"
import { Sidebar } from "./Sidebar"
import { Bell, Search, User } from "lucide-react"
import { Badge } from "../components/ui/badge"

function TopBar() {
  return (
    <header className="h-16 px-8 border-b border-border-subtle bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search bids, intel, documents..." 
            className="w-full h-10 bg-surface border border-border-subtle rounded-md pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-main transition-all font-mono placeholder:font-sans"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Badge variant="live">LIVE</Badge>
           <span className="text-xs text-text-muted font-mono tracking-widest uppercase">London DC-01 Active</span>
        </div>

        <button className="relative p-2 text-text-muted hover:text-text-main transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full glow-primary"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-border-subtle pl-6">
          <div className="w-8 h-8 rounded-full bg-surface border border-primary flex items-center justify-center glow-primary/50">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-main leading-tight">Cmdr. Shepard</span>
            <span className="text-xs text-text-muted font-mono uppercase">Bid Director</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-text-main flex overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none bg-blueprint opacity-50 z-0"></div>
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
