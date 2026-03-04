---
# Fill in the fields below to create a basic custom agent for your repository.
# The Copilot CLI can be used for local testing: https://gh.io/customagents/cli
# To make this agent available, merge this file into the default repository branch.
# For format details, see: https://gh.io/customagents/config

name:
description:
---

"content": f"""You are an expert DC industry researcher. Crawl this company website and return **ONLY valid JSON** (no extra text, no markdown).

Required exact schema:
{{
  "company_name": "exact name",
  "type": "Hyperscale Operator | Colocation | Contractor | Sovereign AI | etc",
  "location": "UK / London / Europe / Global etc",
  "website": "{url}",
  "linkedin_company_url": "full LinkedIn company page or null",
  "x_handle": "@handle or null",
  "key_personnel": [
    {{
      "name": "...",
      "role": "CEO / CTO etc",
      "linkedin": "full profile URL or null",
      "x_handle": "@personal or null",
      "recent_activity": "one-sentence summary of latest post or hire"
    }}
  ],
  "recent_linkedin_posts": ["post summary 1 with date", "post summary 2 with date"],
  "recent_x_posts": ["post summary 1 with date", "post summary 2 with date"],
  "recent_news": [
    {{"headline": "...", "date": "YYYY-MM-DD", "source": "...", "url": "..." }}
  ],
  "stock_ticker": "NASDAQ:EQIX or null",
  "current_stock_price": "number or null",
  "triggers": ["funding round £1bn", "new UK campus", "NVIDIA deal", "CEO hire", "expansion 2026"],
  "intel_summary": "2-3 sentence DC-specific summary (focus on AI/refurb/expansion potential)",
  "suggested_touchpoint": "short LinkedIn DM or email draft in professional British tone"
}}

Page title: {title}
Meta description: {desc}
Full scraped text: {resp.text[:12000]}

Prioritise DC/AI signals, brownfield refurbs, funding, hires, campus news. If LinkedIn or X links exist on the page, extract them. Be precise and concise."""
