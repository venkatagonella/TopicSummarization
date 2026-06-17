# TopicSummarization — Daily Brief

A local dashboard that summarizes what needs your attention each day across
**Slack**, **Jira**, and **Gmail** — priority tasks, items needing a response,
and what to look at first thing in the morning.

## What it does

- **Left pane (30%)**: source sections — Slack, Jira, Gmail (more can be added).
- **Right pane (70%)**: topic summary for the selected source, grouped by day,
  filterable by date range (Today, Yesterday, Last 7/30 days, This week, or a
  custom range).
- A **draggable vertical divider** lets you rebalance the two panes
  (double-click to reset, arrow keys for fine control).
- Each item shows a **priority** badge and an **Action** flag when it needs a
  response from you.

## How data flows

A standalone web app can't call Cursor's MCP tools directly, so the flow is
**agent-driven**:

1. You prompt the agent (e.g. "refresh my dashboard").
2. The agent runs the [`refresh-dashboard`](.cursor/skills/refresh-dashboard/SKILL.md)
   skill: it pulls your Slack mentions/DMs and Jira assigned issues via MCP,
   normalizes them, and writes JSON into `web/public/data/`.
3. The React UI reads those JSON files at runtime — just refresh the browser.

Gmail is a **placeholder** section: there is currently no Gmail MCP connected.
It will populate once a Gmail connector (OAuth or MCP) is wired up.

## Run it

```bash
cd web
npm install      # first time only
npm run dev
```

Open http://localhost:5273/ (the dev server opens it automatically).

Or just ask the agent: **"start my daily brief"** / **"enable localhost"**.

## Project layout

```
web/
  public/data/        # JSON the UI reads (slack.json, jira.json, gmail.json, meta.json)
  src/
    config/sections.js   # registry of left-hand sections — add new sources here
    components/           # Sidebar, SplitPane, SummaryPanel, ...
    lib/dates.js          # date range presets & helpers
    hooks/                # data fetching
.cursor/skills/refresh-dashboard/   # the daily MCP refresh workflow
```

## Adding a new source later

1. Add a JSON file in `web/public/data/<source>.json` (same item schema).
2. Add an entry to `web/src/config/sections.js`.
3. Extend the fetch steps in the `refresh-dashboard` skill.

No other code changes are needed — the UI is data-driven.

## Item schema

```json
{
  "id": "stable id",
  "date": "YYYY-MM-DD",
  "title": "short headline",
  "summary": "1-2 sentences on what's needed",
  "priority": "high | medium | low",
  "actionNeeded": true,
  "link": "deep link",
  "meta": { "chip-key": "chip-value" }
}
```
