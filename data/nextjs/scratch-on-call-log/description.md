# On-Call Log

A single-page app for engineers to log pages, alerts, and actions during on-call shifts. Each entry records what happened and what action was taken.

## Seed Data

Pre-populate with the following log entries:

| id | timestamp | service | severity | summary | action | resolved |
|----|-----------|---------|----------|---------|--------|---------|
| 1 | 2024-02-05 02:14 | payments | critical | "Payment processor timeout — 503 errors spiking" | "Restarted payment worker pods; errors cleared after 3 mins." | true |
| 2 | 2024-02-05 08:47 | auth | warning | "Login latency elevated — p99 > 2s" | "Identified slow DB query; added index. Deployed hotfix." | true |
| 3 | 2024-02-06 14:30 | api-gateway | critical | "API gateway returning 502 for 15% of requests" | "Rolled back last deployment. Investigating root cause." | false |
| 4 | 2024-02-06 19:05 | notifications | info | "Email notification queue depth > 10k" | "Scaled up notification workers x2." | true |
| 5 | 2024-02-07 03:22 | storage | warning | "Disk usage on storage-01 at 85%" | "Deleted old log archives. Disk at 60%." | true |

## Fields

Each log entry has:
- **timestamp** (string): datetime string, e.g. "2024-02-05 02:14"
- **service** (string, required): affected service name
- **severity** ("info" | "warning" | "critical", required): alert severity
- **summary** (string, required): brief description of the alert/page
- **action** (string, required): what the on-call engineer did
- **resolved** (boolean): whether the issue is resolved

## Behaviors

### Display
- Entries are listed newest-first (seed data shown with id 5 first).
- Each card shows: timestamp, service badge, severity badge, summary, action taken, and a resolved/unresolved indicator.

### Add Entry
- A form has inputs for: timestamp (text), service, severity (select: info/warning/critical), summary, action, and a resolved checkbox.
- Clicking "Log Entry" validates that timestamp, service, severity, summary, and action are non-empty.
- On validation failure: show "All fields are required."
- On success: prepend to list, clear the form (resolved checkbox unchecked by default).

### Toggle Resolved
- Each entry card has a "Mark Resolved" / "Mark Unresolved" button (depending on current state).
- Clicking it toggles the `resolved` field for that entry.

### Filter by Severity
- Buttons: "All", "info", "warning", "critical".
- Active button has aria-pressed="true".
- Clicking filters the list to only entries with that severity.

### Filter by Resolved
- A checkbox labeled "Show only unresolved" — when checked, hides all resolved entries.
- The severity filter and the unresolved filter apply simultaneously (AND logic).

### Summary Stats
- Above the list, show: total entries visible, how many are unresolved (among ALL entries, not just filtered).

## Edge Cases
- Whitespace-only fields are invalid.
- If no entries match filters, show "No entries found."
- Toggling resolved status while a filter is active does not reset the filter.
