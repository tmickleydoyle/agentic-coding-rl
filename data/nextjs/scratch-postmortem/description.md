# Postmortem Tracker

A single-page app for writing and tracking postmortems after production incidents. Each postmortem documents the incident, contributing factors, and action items to prevent recurrence.

## Seed Data

Pre-populate with these postmortems:

| id | title | incidentDate | author | severity | summary | contributing | actionItems |
|----|-------|--------------|--------|----------|---------|-------------|-------------|
| 1 | "DB Connection Pool Exhaustion — Mar 1" | 2024-03-01 | alice | P1 | "Payment service went down for 105 min due to DB pool exhaustion caused by a connection leak introduced in v3.2.1." | ["Connection leak in new ORM version", "No alerting on pool utilization", "Pool size not scaled with traffic growth"] | [{ id:1, text:"Add pool utilization alert at 70%", done:true }, { id:2, text:"Audit ORM upgrade for connection handling", done:false }, { id:3, text:"Document pool sizing runbook", done:false }] |
| 2 | "Auth Token Expiry Bug — Mar 8" | 2024-03-08 | bob | P2 | "Users logged out unexpectedly 1 hour early due to a timezone bug in token expiry calculation." | ["Timezone offset not applied in JWT generation", "No automated test for token expiry edge cases"] | [{ id:4, text:"Add timezone-aware token expiry tests", done:false }, { id:5, text:"Deploy hotfix to staging first", done:true }] |
| 3 | "CDN Cache Purge Loop — Mar 3" | 2024-03-03 | carol | P2 | "CDN served stale content for 75 min due to a misconfigured purge rule that evicted cache on every request." | ["Config change not reviewed by second engineer", "No staging CDN environment"] | [{ id:6, text:"Add CDN config peer review requirement", done:false }, { id:7, text:"Create staging CDN environment", done:false }, { id:8, text:"Add cache-hit-rate alert", done:true }] |

## Fields

Each postmortem:
- **id** (number)
- **title** (string)
- **incidentDate** (string: YYYY-MM-DD)
- **author** (string)
- **severity** ("P1" | "P2" | "P3")
- **summary** (string)
- **contributing** (string[]): list of contributing factor strings
- **actionItems** (array of { id, text, done })

## Behaviors

### Display
- Postmortems listed newest-first by id (seed: id 3 first... wait — use id order reversed: id 3, id 2, id 1).
- Each card shows: title, incidentDate, author, severity badge, summary, contributing factors list, and action items with checkboxes.

### Add Postmortem
- Form fields: title, incidentDate, author, severity (select), summary.
- Clicking "Create Postmortem" validates all fields non-empty.
- On failure: show "All fields are required."
- On success: prepend to list with empty contributing and actionItems arrays. Clear form.

### Toggle Action Item Done
- Each action item has a checkbox. Clicking toggles `done`.
- The card shows a completion summary: "N/M done" where N = done count, M = total.

### Add Contributing Factor
- Each postmortem card has a text input and "Add Factor" button.
- Clicking adds a non-empty trimmed string to the `contributing` array.
- Empty input: do nothing.

### Add Action Item
- Each postmortem card has a text input and "Add Action" button.
- Clicking adds a new unchecked action item.
- Empty input: do nothing.
- Clear the input after adding.

### Filter by Severity
- Buttons: "All", "P1", "P2", "P3". Active has aria-pressed="true".

### Search
- Text input labeled "Search postmortems" filters by title or summary (case-insensitive).
- Filter and search apply simultaneously.

## Edge Cases
- If no postmortems match, show "No postmortems found."
- A new postmortem starts with "0/0 done" (no items).
- Whitespace-only form fields are invalid.
