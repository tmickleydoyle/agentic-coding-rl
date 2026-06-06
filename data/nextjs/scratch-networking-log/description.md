# Networking Log

A single-page app to record contacts met at a conference and track follow-up status.

## Seed Data

Five pre-loaded contacts:

| id | name | company | role | email | metAt | followUp | notes |
|----|------|---------|------|-------|-------|----------|-------|
| 1 | "Alice Tran" | "TechCorp" | "Engineer" | "alice@techcorp.com" | "Day 1 - Keynote" | "pending" | "Interested in OSS collaboration" |
| 2 | "Ben Okafor" | "StartupX" | "Founder" | "ben@startupx.io" | "Day 1 - Lunch" | "done" | "Sent follow-up email already" |
| 3 | "Cara White" | "DesignLab" | "Designer" | "cara@designlab.co" | "Day 1 - Workshop" | "pending" | "Shared Figma tips" |
| 4 | "David Kim" | "CloudBase" | "DevOps" | "david@cloudbase.dev" | "Day 2 - Networking" | "skipped" | "Will connect on LinkedIn" |
| 5 | "Eva Russo" | "DataFlow" | "Data Scientist" | "eva@dataflow.ai" | "Day 2 - Panel" | "pending" | "Interested in dataset sharing" |

## Fields Displayed

Each contact card shows: name, company, role, email (as a mailto link), metAt, followUp status badge, notes.

## Behaviors

### Add Contact
- Form with fields: Name, Company, Role, Email, Met At, Notes (all text inputs/textarea)
- Follow-up status defaults to "pending" on new entries
- "Add Contact" button submits; all fields except Notes are required
- Submitting with any required field empty does nothing
- Form clears after successful add

### Follow-Up Status Toggle
- Each contact has a "Mark Done" button (visible when status is "pending" or "skipped")
- And a "Skip" button (visible when status is "pending")
- Clicking "Mark Done" sets status to "done"
- Clicking "Skip" sets status to "skipped"
- When status is "done", show a "Reset" button that sets it back to "pending"

### Filter by Status
- Three filter buttons: "All", "Pending", "Done"
  - "Pending" shows contacts with status "pending" or "skipped"
  - "Done" shows contacts with status "done"
- Default: "All"

### Search
- A text input labelled "Search contacts"
- Filters by name or company (case-insensitive substring match)
- Combined with status filter

### Contact Count
- Text "X contacts" updates with filters

## Edge Cases
- Search and status filter are combined (both must match)
- Empty search shows all contacts (within status filter)
- "No contacts found" when filters yield zero results
