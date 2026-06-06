# Incident Log

A single-page app for logging production incidents, tracking their status, and appending timeline notes as an incident evolves.

## Seed Data

Pre-populate with these incidents:

| id | title | service | severity | status | startedAt | resolvedAt | description |
|----|-------|---------|----------|--------|-----------|------------|-------------|
| 1 | "Database connection pool exhausted" | database | P1 | resolved | 2024-03-01 09:00 | 2024-03-01 10:45 | "All DB connections used; new queries queuing." |
| 2 | "CDN cache purge loop" | cdn | P2 | resolved | 2024-03-03 14:15 | 2024-03-03 15:30 | "Misconfigured purge rule causing cache to evict on every request." |
| 3 | "Payment service latency spike" | payments | P1 | investigating | 2024-03-07 11:00 | — | "p99 latency jumped from 200ms to 4s. Root cause unknown." |
| 4 | "Auth token expiry bug" | auth | P2 | monitoring | 2024-03-08 08:30 | — | "Tokens expiring 1 hour early due to timezone handling bug." |
| 5 | "Notification email delays" | notifications | P3 | resolved | 2024-03-09 16:00 | 2024-03-09 17:20 | "Email queue backed up due to SMTP rate limiting." |

Each incident also has a `notes` array of timeline notes:
- Incident 1 notes: [{ id: 1, timestamp: "2024-03-01 09:15", text: "Identified pool size misconfiguration." }, { id: 2, timestamp: "2024-03-01 10:00", text: "Increased pool size; connections stabilizing." }]
- Incident 3 notes: [{ id: 3, timestamp: "2024-03-07 11:30", text: "Rolled back last deployment — no improvement." }]
- All others: empty notes array.

## Fields

Each incident:
- **id** (number)
- **title** (string)
- **service** (string)
- **severity** ("P1" | "P2" | "P3")
- **status** ("investigating" | "monitoring" | "resolved")
- **startedAt** (string)
- **resolvedAt** (string or empty "")
- **description** (string)
- **notes** (array of timeline notes)

Each note: { id, timestamp, text }

## Behaviors

### Display
- Incidents listed newest-first (seed: id 5 first).
- Each card shows: title, service, severity badge, status badge, startedAt, resolvedAt (or "—"), description, and all timeline notes.

### Add Incident
- Form fields: title, service, severity (select: P1/P2/P3), status (select: investigating/monitoring/resolved), startedAt, resolvedAt (optional), description.
- Clicking "Add Incident" validates that title, service, severity, status, startedAt, and description are non-empty.
- On failure: show "All required fields must be filled."
- On success: prepend to list, clear form.

### Change Status
- Each incident card has a status select dropdown (investigating/monitoring/resolved).
- Changing the dropdown updates the incident's status immediately.

### Add Timeline Note
- Each incident has a small form: a timestamp input and a text input, plus "Add Note" button.
- Validates both timestamp and text are non-empty; if not, show a per-card error "Note fields required."
- On success: appends note to that incident's notes list; clears the note form.

### Filter by Status
- Buttons: "All", "investigating", "monitoring", "resolved".
- Active button has aria-pressed="true".

### Filter by Severity
- A select element labeled "Severity" with options: "All", "P1", "P2", "P3".
- Both filters apply simultaneously.

## Edge Cases
- Whitespace-only inputs are invalid.
- If no incidents match, show "No incidents found."
- resolvedAt is optional when adding; leave blank for ongoing incidents.
