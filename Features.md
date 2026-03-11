# aLiGN — Feature Reference

> **AI-native Bid + Delivery Operating System for Data Centre Refurbs & New Builds**
> *"Win more DC projects with less bid pain."*

---

## Overview

**aLiGN** replaces messy stacks of spreadsheets, email chains, SharePoint folders, and tribal knowledge with a structured, AI-assisted platform that guides every deal through the complete lifecycle:

```
Target → Lead → Qualified → Bid → Win → Deliver → Expand
```

This document is the canonical reference for every feature in the platform, organised by functional area.

---

## Table of Contents

1. [Account & Site Intelligence](#a-account--site-intelligence-)
2. [Opportunity Qualification](#b-opportunity-qualification-)
3. [Bid Pack Builder](#c-bid-pack-builder-)
4. [Estimating & Scope Gap Detection](#d-estimating--scope-gap-detection-)
5. [Delivery Handover Mode](#e-delivery-handover-mode-)
6. [Intelligence & Signal Detection](#f-intelligence--signal-detection-)
7. [Call Intelligence](#g-call-intelligence-)
8. [Bid Debrief & Learning Loop](#h-bid-debrief--learning-loop-)
9. [Procurement Framework Tracking](#i-procurement-framework-tracking-)
10. [AI Agent Suite](#j-ai-agent-suite-)
11. [Geospatial Intelligence](#k-geospatial-intelligence-)
12. [Blog & Content Management](#l-blog--content-management-)
13. [CRM Integration](#m-crm-integration-)
14. [Data Import & Export](#n-data-import--export-)
15. [Async Processing & Webhooks](#o-async-processing--webhooks-)
16. [Frontend Pages](#frontend-pages)
17. [Technical Stack](#technical-stack)

---

## A. Account & Site Intelligence 🏢

Build a living map of the data centre market — prospects, stakeholders, and organisational relationships — all in one place.

| Feature | Description |
|---|---|
| **Target List Builder** | Create and manage prospect target lists for data centre operators and developers |
| **Trigger Signal Alerts** | Monitor planning approvals, grid announcements, and hiring spikes to surface timely opportunities |
| **Contact / Stakeholder Mapping** | Build organisational relationship maps linking people to accounts and roles |
| **Company Profiling** | Capture company details including industry, regions of operation, and strategic priorities |
| **Executive Tracking** | Track key decision-makers and sponsors across target organisations |

---

## B. Opportunity Qualification 🎯

Know instantly whether a deal is worth chasing. The Go/No-Go engine scores every opportunity across five dimensions and gives a clear recommendation.

### Go / No-Go Scoring Engine

Each dimension is scored **0–10** and combined into an overall qualification verdict:

| Dimension | What It Measures |
|---|---|
| **Budget Confidence** | How certain is the client's funding and approval status? |
| **Route-to-Market Clarity** | Is the procurement route direct, framework-based, or unclear? |
| **Incumbent Lock-in Risk** | How entrenched is the existing supplier relationship? |
| **Procurement Timeline Realism** | Is the timeline achievable given resourcing and lead times? |
| **Technical Fit** | How well does our capability match the project scope? |

**Verdict thresholds:**

| Score Range | Decision |
|---|---|
| 40–50 | ✅ **Go** |
| 25–39 | ⚠️ **Conditional Go** |
| 0–24 | ❌ **No-Go** |

### Additional Qualification Features

- **Opportunity Tracking** — Stage management across: Prospecting → Qualified → Bidding → Won / Lost
- **MEP Complexity Classification** — Rate mechanical, electrical, and plumbing complexity to calibrate resource requirements

---

## C. Bid Pack Builder 📋

Transform raw RFQ/RFP documents into structured, AI-drafted bid responses — in a fraction of the time.

| Feature | Description |
|---|---|
| **Document Ingestion** | Upload RFQ / RFP documents in PDF or Word format |
| **Compliance Matrix Autopilot** | Automatically extract requirements and generate a compliance item list |
| **RFI Generator** | AI-assisted creation of Requests for Information, ready to send |
| **Method Statement Templates** | Pre-built templates for standard bid response sections |
| **Document Parsing** | Structured extraction of bid requirements via `pdfplumber` + Grok LLM |
| **LLM-Assisted Answer Generation** | AI drafts compliance responses based on parsed requirements |

### Export Formats

| Export | Format | Contents |
|---|---|---|
| **Pursuit Pack** | PDF | Executive summary, win themes, key risks |
| **Tender Response** | Word (`.docx`) | Full formatted response document |
| **Compliance Matrix** | Excel (`.xlsx`) | Requirement-by-requirement compliance tracker |

---

## D. Estimating & Scope Gap Detection 🔍

Never miss a scope item again. The gap checker systematically reviews eight critical categories and flags anything missing before you submit.

### 8-Category Gap Checker

| # | Category | What's Checked |
|---|---|---|
| 1 | **Enabling Works** | Site prep, demolition, access requirements |
| 2 | **Temporary Power** | Generator hire, temporary distribution |
| 3 | **Commissioning** | Functional testing, witness plans |
| 4 | **Testing & Handover** | FAT/SAT, documentation, O&M manuals |
| 5 | **Site Logistics** | Cranage, laydown, access restrictions |
| 6 | **Installation Labour** | Trade resource planning and allocation |
| 7 | **Equipment Lead-Times** | Switchgear, UPS, chillers, generators |
| 8 | **Contingency** | Risk allowances and provisional sums |

### Additional Estimating Features

- **Scope Completeness Scoring** — Instant percentage score for bid completeness
- **Lead-Time Intelligence** — Database of switchgear, UPS, chillers, and generators with realistic delivery lead times
- **Gap Risk Alerts** — Flagged missing items with associated lead-time impacts highlighted
- **Checklist Management** — Interactive, category-level checklist for bid requirements review

---

## E. Delivery Handover Mode 🚀

Once the bid is won, aLiGN doesn't stop. Transition seamlessly from bid to live project without losing the context built during pursuit.

| Feature | Description |
|---|---|
| **Bid → Project Transition** | Convert a won bid into a live delivery project in one action |
| **Scope Baseline** | Lock the scope agreed at contract award as the project baseline |
| **Change Control** | Formally track all scope changes post-contract with status and value |
| **Outage Planning** | Schedule and document planned downtime windows for live environments |
| **Project Tracking** | Monitor delivery status from handover through to practical completion |

---

## F. Intelligence & Signal Detection 📡

Stay ahead of the market. aLiGN continuously monitors multiple data sources to surface early signals of data centre investment.

| Signal Source | What's Monitored |
|---|---|
| **News Aggregation** | Automated scraping of news outlets for data centre project announcements |
| **Planning Portal Scraping** | UK planning applications flagged for data centre expansions and new builds |
| **Vendor Press Releases** | Infrastructure vendor announcements (power, cooling, connectivity) |
| **Job Posting Signals** | Hiring spikes detected as a leading indicator of upcoming CapEx programmes |
| **Infrastructure Announcements** | Grid connections, power upgrades, and fibre route announcements |
| **Signal Event Classification** | Every detected event tagged by type (planning / hiring / vendor / infrastructure) and status |

---

## G. Call Intelligence 📞

Every customer conversation is a source of intelligence. aLiGN transcribes, analyses, and extracts actionable insights automatically.

| Feature | Description |
|---|---|
| **Audio Transcription** | Convert call recordings to text with speaker attribution |
| **Sentiment Analysis** | Customer sentiment scored 0–100 per call |
| **Competitive Intelligence Extraction** | Automatically surface competitor mentions and context |
| **Budget Signal Detection** | Flag budget-related keywords and phrases |
| **Timeline Mention Extraction** | Identify and extract project timeline references |
| **Risk Language Detection** | Flag negative language, objections, and hesitation signals |
| **Opportunity Auto-Linking** | Suggest related opportunities based on call content analysis |
| **Key Point Extraction** | Automatically extract action items and key meeting outcomes |

---

## H. Bid Debrief & Learning Loop 🔁

Every bid — win or lose — is an opportunity to improve. The learning loop captures debrief data and surfaces patterns over time.

| Feature | Description |
|---|---|
| **Win / Loss Debrief Capture** | Structured post-bid feedback collection for every submitted tender |
| **Insights Aggregation** | Surface patterns and lessons learned across historical bids |
| **Performance Analytics** | Track win rate, average bid value, and average time-to-win |

---

## I. Procurement Framework Tracking 📑

Stay on top of every framework registration that unlocks access to public and private sector DC projects.

| Feature | Description |
|---|---|
| **Framework Registration** | Record and manage all procurement framework registrations |
| **Status Tracking** | Monitor framework status: Active / Expired / Pending Renewal |
| **Framework Insights** | Aggregate and view opportunities flowing through each framework |

---

## J. AI Agent Suite 🤖

Five specialist AI agents, each with a defined scope and focus area, ready to be tasked from within the platform.

| Agent | Role | What It Does |
|---|---|---|
| 🏗️ **Build Captain** | Engineering Lead | Turns goals into implementable build plans with clear steps and dependencies |
| 🎨 **UI Surgeon** | Frontend Architect | Decomposes UI designs into components with a prioritised build order |
| 🧪 **Test Pilot** | QA Engineer | Generates QA checklists and Playwright test scripts for frontend flows |
| 📊 **Data Curator** | Data Engineer | Designs valuation and pricing data pipelines with schema recommendations |
| ⚙️ **Ops Boss** | DevOps Engineer | Configures CI/CD pipelines and manages environment setup |

---

## K. Geospatial Intelligence 🗺️

Visualise where the data centre market is moving — at national and regional level.

| Feature | Description |
|---|---|
| **Project Mapping** | Interactive Leaflet map plotting all tracked DC projects by location |
| **Regional Heatmaps** | Aggregate project density overlaid on UK regional boundaries |
| **Capacity Planning** | View infrastructure capacity headroom by geography |
| **CapEx Insights** | Track and compare regional capital expenditure trends over time |

---

## L. Blog & Content Management ✍️

Publish market insights, project case studies, and sector commentary directly within aLiGN.

| Feature | Description |
|---|---|
| **Blog Post Creation** | Rich-text authoring and publishing of articles and insights |
| **Status Tracking** | Manage content through Draft → Published → Archived lifecycle states |

---

## M. CRM Integration 🔗

Keep aLiGN and HubSpot in sync — no double entry, no stale contact records.

| Feature | Description |
|---|---|
| **HubSpot Integration** | Native sync of contacts and companies between aLiGN and HubSpot CRM |
| **Account Sync** | Bi-directional push/pull of account data |
| **Contact Mapping** | Link aLiGN stakeholders to their corresponding HubSpot contact records |

---

## N. Data Import & Export 📤

Move data in and out of aLiGN in the formats your team already uses.

| Direction | Format | What's Supported |
|---|---|---|
| **Import** | CSV | Bulk import of accounts, opportunities, and contacts |
| **Export** | CSV | Export any dataset for external analysis or reporting |
| **Export** | PDF | Formatted pursuit packs and reports via `reportlab` |
| **Export** | Word | Tender response documents via `python-docx` |
| **Export** | Excel | Compliance matrices and schedules via `openpyxl` |

---

## O. Async Processing & Webhooks ⚙️

Heavy computation and external integrations run reliably in the background — without blocking the UI.

| Feature | Description |
|---|---|
| **Background Workers** | APScheduler-driven async processing for document parsing, signal scraping, and report generation |
| **Webhook Handling** | Receive and process inbound events from external systems (CRM, planning portals, email) |
| **Setup Wizards** | Step-by-step configuration wizards for onboarding integrations |

---

## Frontend Pages

| Route | Page |
|---|---|
| `/dashboard` | Main dashboard — key metrics and activity feed |
| `/dashboard/accounts` | Account list, search, and filters |
| `/dashboard/accounts/[id]` | Account detail — contacts, opportunities, signals |
| `/dashboard/opportunities` | Opportunity pipeline — Kanban and list views |
| `/dashboard/bids` | Bid management — documents, compliance, exports |
| `/dashboard/estimating` | Scope gap detection and estimating checklist |
| `/dashboard/signals` | Trigger signals and alert feed |
| `/dashboard/intelligence` | Intelligence hub — map, heatmap, capacity, CapEx |
| `/dashboard/intel` | Company intelligence and news aggregation |
| `/dashboard/lead-times` | Equipment lead-time reference database |
| `/dashboard/frameworks` | Procurement framework tracker |
| `/dashboard/calls` | Call intelligence and recordings library |
| `/dashboard/agents` | AI agent interface |
| `/dashboard/blog` | Blog and news feed |
| `/dashboard/photos` | Media and photo gallery |
| `/dashboard/widgets` | Dashboard widget customisation |
| `/dashboard/tenders` | Tender tracking |
| `/dashboard/setup` | Configuration and onboarding |

---

## Technical Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 15 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| UI Library | React |
| Authentication | Clerk |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |

### Backend

| Layer | Technology |
|---|---|
| Language | Python 3.11 |
| Framework | FastAPI |
| ORM | SQLAlchemy 2 |
| Validation | Pydantic v2 |
| Task Scheduling | APScheduler |

### Data & Storage

| Concern | Technology |
|---|---|
| Database (dev) | SQLite |
| Database (prod) | PostgreSQL 16 |
| File Storage (dev) | Local filesystem |
| File Storage (prod) | Amazon S3 |

### AI & Document Processing

| Concern | Technology |
|---|---|
| LLM / AI | Grok API |
| PDF Parsing | pdfplumber |
| Word Processing | python-docx |
| Excel Export | openpyxl |
| PDF Export | reportlab |
| Web Scraping | BeautifulSoup |

### Infrastructure & Integrations

| Concern | Technology |
|---|---|
| Authentication | Clerk / Auth0 (JWT, configurable) |
| Email | Gmail API (OAuth) with fallback notifications |
| CRM | HubSpot |
| Containerisation | Docker Compose |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway / Render / fly.io |

---

*This document reflects the full feature set of the aLiGN platform. For deployment instructions see [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md). For setup and onboarding see [`README.md`](./README.md).*
