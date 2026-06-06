# Job Search Tracker

A single-page React app for tracking job applications through the hiring pipeline.

## Seed Data

Start with these 5 job applications pre-loaded:

| id | company | role | location | status | appliedDate | notes |
|----|---------|------|----------|--------|-------------|-------|
| 1 | Acme Corp | Frontend Engineer | New York, NY | Applied | 2024-01-10 | Referral from Sarah |
| 2 | Beta Inc | Full Stack Developer | Remote | Interview | 2024-01-08 | Phone screen done |
| 3 | Gamma LLC | React Developer | San Francisco, CA | Offer | 2024-01-05 | Offer: $140k |
| 4 | Delta Co | Software Engineer | Austin, TX | Rejected | 2024-01-03 | No feedback given |
| 5 | Epsilon Ltd | UI Engineer | Remote | Applied | 2024-01-12 | Applied via LinkedIn |

## Fields

Each job application has:
- **company** (string, required)
- **role** (string, required)
- **location** (string, required)
- **status** (enum: "Applied" | "Interview" | "Offer" | "Rejected")
- **appliedDate** (string, YYYY-MM-DD)
- **notes** (string, optional)

## UI Layout

### Header
- App title: "Job Search Tracker"
- Count showing total applications: e.g., "5 Applications"

### Filter Bar
- Status filter dropdown (options: "All", "Applied", "Interview", "Offer", "Rejected") — `data-testid="status-filter"`
- Text search input filtering by company or role — `data-testid="search-input"`

### Add Application Form
- Inputs for company, role, location, appliedDate, notes
- Status select defaulting to "Applied"
- Submit button labeled "Add Application" — `data-testid="add-btn"`
- All input `data-testid` values: `input-company`, `input-role`, `input-location`, `input-date`, `input-notes`, `input-status`

### Application List
- Each application rendered in a card — `data-testid="job-card-{id}"`
- Shows company name, role, location, applied date, notes, status badge
- Status badge — `data-testid="status-{id}"`
- Delete button — `data-testid="delete-{id}"`
- Edit button — `data-testid="edit-{id}"`

### Edit Mode
- Clicking Edit replaces the card with an inline edit form
- Fields pre-filled with current values
- Save button — `data-testid="save-{id}"`
- Cancel button — `data-testid="cancel-{id}"`
- Saving updates the card; Cancel discards changes

## Behaviors

1. **Filter by status**: selecting a status hides non-matching cards; "All" shows all.
2. **Search**: typing in search input filters cards matching company or role (case-insensitive).
3. **Add**: submitting form with all required fields adds new card; clears form on success.
4. **Delete**: clicking Delete removes that card permanently.
5. **Edit/Save**: clicking Edit shows inline form; Save persists changes; Cancel restores original.
6. **Count**: header count reflects currently visible (filtered) count.
7. **Empty state**: when no applications match filters, show text "No applications found" — `data-testid="empty-state"`.

## Edge Cases

- Submitting add form with empty company or role does nothing (no new card added).
- Search and status filter compose (both apply simultaneously).
- Status badge text matches the status value exactly.
