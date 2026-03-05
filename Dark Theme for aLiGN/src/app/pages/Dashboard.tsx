import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table"
import { 
  LineChart, 
  Line, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"
import { ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

// Mock Data
const TASK_DATA = [
  { id: "T-01", desc: "Submit FRA phase 2 pricing", time: "10:00", status: "pending" },
  { id: "T-02", desc: "Review generator specs LHR", time: "11:30", status: "urgent" },
  { id: "T-03", desc: "Sign-off electrical schematics", time: "14:00", status: "done" },
  { id: "T-04", desc: "Client sync: Cooling strategy", time: "15:45", status: "pending" },
  { id: "T-05", desc: "Finalize bid pack DUB-03", time: "17:00", status: "urgent" },
]

const NEWLY_FORMED = [
  { id: "PRJ-901", name: "Project Titan (Slough)", val: "£45M", stage: "Pre-Q" },
  { id: "PRJ-902", name: "Atlas DC Expansion", val: "£12M", stage: "RFP" },
  { id: "PRJ-903", name: "Frankfurt Hyperscale", val: "£110M", stage: "Design" },
  { id: "PRJ-904", name: "LHR Edge Node", val: "£4.5M", stage: "RFI" },
]

const TOP_BIDS = [
  { name: "Project Titan", prob: 85, value: 45 },
  { name: "Atlas DC", prob: 60, value: 12 },
  { name: "FRA Hyper", prob: 40, value: 110 },
  { name: "LHR Edge", prob: 95, value: 4.5 },
  { name: "DUB-03", prob: 70, value: 38 },
]

const CHART_DATA = [
  { name: "Jan", val: 400 },
  { name: "Feb", val: 300 },
  { name: "Mar", val: 550 },
  { name: "Apr", val: 450 },
  { name: "May", val: 700 },
  { name: "Jun", val: 650 },
]

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main flex items-center gap-3">
             Command Centre
             <Badge variant="live" className="ml-2">System Active</Badge>
          </h1>
          <p className="text-sm text-text-muted mt-1 font-mono uppercase">
             Global Overview &middot; Bid Intelligence OS
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-mono text-xs">Export Report</Button>
          <Button className="font-mono text-xs"><ArrowUpRight className="w-4 h-4 mr-2"/> Initialize New Bid</Button>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Column 1: Diary & Tasks */}
        <div className="flex flex-col gap-6">
          <Card priority>
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <CardTitle className="text-sm font-mono text-primary flex items-center justify-between">
                <span>[01] TASKS TODAY</span>
                <span className="text-text-muted text-xs">5 ACTIVE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <Table>
                <TableBody>
                  {TASK_DATA.map((task) => (
                    <TableRow key={task.id} className="cursor-pointer">
                      <TableCell className="w-[80px] text-text-muted font-mono text-xs">{task.id}</TableCell>
                      <TableCell className="font-sans text-sm max-w-[150px] truncate" title={task.desc}>
                        {task.desc}
                      </TableCell>
                      <TableCell className="text-right">
                         {task.status === 'urgent' && <Badge variant="danger" className="py-0 uppercase text-[10px]">Urgent</Badge>}
                         {task.status === 'done' && <CheckCircle2 className="w-4 h-4 text-success inline" />}
                         {task.status === 'pending' && <span className="text-text-muted text-xs font-mono">{task.time}</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <CardTitle className="text-sm font-mono text-primary flex items-center justify-between">
                <span>[02] UPCOMING DIARY</span>
                <span className="text-text-muted text-xs">T+24H</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
               <div className="flex items-start gap-4 p-3 rounded-md bg-surface border border-border-subtle hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden group">
                  <div className="w-1 bg-warning absolute left-0 top-0 bottom-0" />
                  <div className="flex flex-col items-center justify-center min-w-[50px] font-mono border-r border-border-subtle pr-4">
                     <span className="text-xs text-text-muted">10:00</span>
                     <span className="text-sm font-bold text-text-main">AM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium leading-none mb-1">FRA Tier III Site Visit</h4>
                    <p className="text-xs text-text-muted line-clamp-1">Client walk-through with lead engineers.</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4 p-3 rounded-md bg-surface border border-border-subtle hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden group">
                  <div className="w-1 bg-primary absolute left-0 top-0 bottom-0 group-hover:glow-primary" />
                  <div className="flex flex-col items-center justify-center min-w-[50px] font-mono border-r border-border-subtle pr-4">
                     <span className="text-xs text-text-muted">14:30</span>
                     <span className="text-sm font-bold text-text-main">PM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium leading-none mb-1 text-primary">Board Review: Titan</h4>
                    <p className="text-xs text-text-muted line-clamp-1">Final pricing sign-off required.</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Intelligence & News */}
        <div className="flex flex-col gap-6">
          <Card priority>
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <CardTitle className="text-sm font-mono text-primary flex items-center justify-between">
                <span>[03] PIPELINE VELOCITY</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CHART_DATA}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `£${val}m`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161F33', borderColor: '#1F2A44', borderRadius: '4px', fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                      itemStyle={{ color: '#00E5FF' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#00E5FF" 
                      strokeWidth={2}
                      dot={{ fill: '#00E5FF', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 6, fill: '#0A0F1C', stroke: '#00E5FF', strokeWidth: 2 }} 
                    />
                  </LineChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <CardTitle className="text-sm font-mono text-primary flex items-center justify-between">
                <span>[04] SECTOR INTEL</span>
                <Badge variant="warning" className="uppercase text-[10px] py-0">Updates Available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
               <div className="border-l-2 border-border-subtle pl-4 hover:border-primary transition-colors">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">08:42 GMT - Global Data</span>
                  <p className="text-sm text-text-main line-clamp-2">Competitor XYZ reports supply chain delays on cooling units impacting Q3 delivery schedules.</p>
               </div>
               <div className="border-l-2 border-border-subtle pl-4 hover:border-primary transition-colors">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">11:15 GMT - Regulatory</span>
                  <p className="text-sm text-text-main line-clamp-2">New EU environmental directives on PUE standards published. Affects 3 active bids.</p>
               </div>
               <div className="border-l-2 border-border-subtle pl-4 hover:border-primary transition-colors">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">Yesterday - Internal</span>
                  <p className="text-sm text-text-main line-clamp-2">Cost model template V4.2 rolled out. Update all live models.</p>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Bids & Projects */}
        <div className="flex flex-col gap-6">
          <Card priority>
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <CardTitle className="text-sm font-mono text-primary flex items-center justify-between">
                <span>[05] NEWLY-FORMED BIDS</span>
                <span className="text-text-muted text-xs">LAST 7 DAYS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
               <Table>
                <TableBody>
                  {NEWLY_FORMED.map((bid) => (
                    <TableRow key={bid.id} className="cursor-pointer">
                      <TableCell className="w-[80px] text-text-muted font-mono text-xs">{bid.id}</TableCell>
                      <TableCell className="font-sans text-sm font-medium">{bid.name}</TableCell>
                      <TableCell className="text-right font-mono text-primary text-xs">{bid.val}</TableCell>
                      <TableCell className="text-right">
                         <Badge variant="neutral" className="py-0 uppercase text-[10px]">{bid.stage}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border-subtle/50">
              <CardTitle className="text-sm font-mono text-primary flex items-center justify-between">
                <span>[06] TOP-N PRIORITY</span>
                <span className="text-text-muted text-xs">BY WIN PROBABILITY</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
               {TOP_BIDS.sort((a,b) => b.prob - a.prob).slice(0,4).map((bid, i) => (
                  <div key={bid.name} className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-sm font-medium">{bid.name}</span>
                        <span className="text-xs font-mono text-text-muted">EST: £{bid.value}M</span>
                     </div>
                     <div className="flex items-center gap-3 w-1/2">
                        <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-primary glow-primary" 
                              style={{ width: `${bid.prob}%` }}
                           />
                        </div>
                        <span className="text-xs font-mono text-primary w-8 text-right">{bid.prob}%</span>
                     </div>
                  </div>
               ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
