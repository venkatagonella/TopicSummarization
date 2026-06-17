---
name: refresh-dashboard
description: Refresh the Daily Brief dashboard by pulling the user's Slack mentions/DMs and Jira assigned issues via MCP, normalizing them into JSON, and launching the localhost UI. Use when the user asks to "refresh my dashboard", "start my daily brief", "what do I need to look at today", "enable localhost", or any morning catch-up on Slack/Jira tasks needing a response.
---

# Refresh Daily Brief Dashboard

Pull the user's day-relevant items from Slack and Jira, write them into the
React app's data files, and start the localhost server.

Gmail is a placeholder (no Gmail MCP connected) — leave `gmail.json` untouched.

## Workflow

```
- [ ] 1. Resolve identity (Jira account id + Slack user)
- [ ] 2. Fetch Jira issues assigned to user
- [ ] 3. Fetch Slack mentions + DMs needing reply
- [ ] 4. Normalize into the item schema and write JSON files
- [ ] 5. Update meta.json
- [ ] 6. Start the localhost dev server
```

### 1. Identity
- Jira: `atlassianUserInfo` (or `lookupJiraAccountId`) to get the account id.
  Most JQL can just use `currentUser()`.
- Slack: `slack_read_user_profile` / `slack_search_users` for the user's own
  name + id (used to detect mentions and authored vs received messages).

### 2. Jira
Use `searchJiraIssuesUsingJql` (default last 14 days window for the UI):
```
assignee = currentUser() AND statusCategory != Done ORDER BY duedate ASC, priority DESC
```
Also optionally pull recently updated: `assignee = currentUser() AND updated >= -14d`.
For each issue capture: key, summary, status, duedate, priority, issuetype, URL.

### 3. Slack
Use `slack_search_public_and_private` to find items needing a response in the
last ~7 days. Run a few targeted queries and merge/dedupe:
- mentions of the user: `to:@<username>` or the user's display name
- direct messages addressed to the user
Use `slack_read_thread` only when a result needs context to summarize.
Skip messages the user themselves authored last (no reply needed from them).

### 4. Normalize — item schema
Every source file is `{ source, label, status, items: [] }`. Each item:
```json
{
  "id": "string (stable, e.g. jira key or slack ts)",
  "date": "YYYY-MM-DD (local date the item is relevant for)",
  "title": "short headline",
  "summary": "1-2 sentence summary of what's needed",
  "priority": "high | medium | low",
  "actionNeeded": true,
  "link": "deep link to the source",
  "meta": { "key": "value pairs shown as chips" }
}
```
Priority guidance:
- `high`: due today/overdue, blocker, direct DM/question awaiting your reply
- `medium`: due this week, @mention needing acknowledgement
- `low`: FYI, already-handled, informational

Write files (overwrite):
- `web/public/data/jira.json`
- `web/public/data/slack.json`
Leave `web/public/data/gmail.json` as-is (placeholder).

### 5. meta.json
Overwrite `web/public/data/meta.json`:
```json
{
  "generatedAt": "<ISO timestamp now>",
  "user": { "name": "...", "email": "..." },
  "sources": { "slack": "live", "jira": "live", "gmail": "placeholder" }
}
```

### 6. Start localhost
Check `terminals/` first — if a `vite` dev server is already running, just tell
the user the URL. Otherwise:
```bash
cd web && npm run dev
```
Default URL: http://localhost:5273/ . The UI reads the JSON files at runtime; a
browser refresh picks up new data (no rebuild needed).

## Start / stop on demand
The server runs on a fixed port (5273, `strictPort`).

- **Start** (trigger words: "start my daily brief", "enable localhost"):
  ```bash
  cd web && npm run dev
  ```
  Run it as a background process so the turn isn't blocked.
- **Stop** (trigger words: "stop the daily brief", "shut down localhost"):
  ```bash
  cd web && npm run stop
  ```
  (`npm run stop` kills whatever is listening on port 5273.)
- **Restart**: `cd web && npm run restart`.
- **Check if running**: `lsof -ti tcp:5273` (empty output = not running), or look
  in `terminals/` for a `vite` process.

## Notes
- The "Today" section is an aggregate view derived in the UI from all source
  files — no JSON file to write. New sources are auto-included in it.
- Adding a new source later: add a JSON file in `web/public/data/`, add an entry
  to `web/src/config/sections.js`, and extend this skill's fetch steps.
- Do not invent items. If a query returns nothing, write an empty `items` array.
