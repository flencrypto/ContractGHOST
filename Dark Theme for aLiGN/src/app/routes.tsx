import { createBrowserRouter } from "react-router"
import { AppLayout } from "./layout/Layout"
import { Dashboard } from "./pages/Dashboard"
import { PlaceholderPage } from "./pages/Placeholder"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { 
        path: "intel", 
        Component: () => <PlaceholderPage title="Account Intelligence" desc="Deep-dive metrics & competitor analysis module" /> 
      },
      { 
        path: "bids", 
        Component: () => <PlaceholderPage title="Bid Pack Builder" desc="Technical document assembly & pricing engine" /> 
      },
      { 
        path: "tasks", 
        Component: () => <PlaceholderPage title="Task Management" desc="Global assignment tracking" /> 
      },
      { 
        path: "diary", 
        Component: () => <PlaceholderPage title="Project Diary" desc="Chronological event log & scheduling" /> 
      },
      { 
        path: "docs", 
        Component: () => <PlaceholderPage title="Document Vault" desc="Secure file storage & version control" /> 
      },
      { 
        path: "news", 
        Component: () => <PlaceholderPage title="News Feed" desc="Market intelligence & internal updates" /> 
      },
      { 
        path: "settings", 
        Component: () => <PlaceholderPage title="System Configuration" desc="Access control & environment variables" /> 
      },
    ],
  },
])
