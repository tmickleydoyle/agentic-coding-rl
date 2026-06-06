# Salary Negotiation Tracker

A single-page React app for tracking salary negotiation rounds, counteroffers, and tactics for a job offer.

## Seed Data

### Active Negotiation (pre-loaded)
- company: "TechCorp"
- role: "Senior Engineer"
- initialOffer: 130000
- targetSalary: 155000
- deadline: "2024-02-15"

### Negotiation Rounds (3 pre-loaded)
| id | round | offerAmount | counterAmount | tactic | date | status |
|----|-------|-------------|---------------|--------|------|--------|
| 1 | 1 | 130000 | 145000 | Cited market rate data from Levels.fyi | 2024-01-15 | Pending |
| 2 | 2 | 138000 | 150000 | Mentioned competing offer from Beta Inc | 2024-01-20 | Pending |
| 3 | 3 | 145000 | 155000 | Asked for signing bonus as alternative | 2024-01-25 | Accepted |

## UI Layout

### Header
- Title: "Salary Negotiation Tracker"
- Shows company and role of active negotiation — `data-testid="active-company"`, `data-testid="active-role"`
- Shows initial offer — `data-testid="initial-offer"`
- Shows target salary — `data-testid="target-salary"`
- Shows deadline — `data-testid="deadline"`
- Shows gap (target - latest counter) — `data-testid="gap"`

### Progress Bar
- Visual progress bar showing progress from initialOffer to targetSalary based on latest counterAmount
- `data-testid="progress-bar"` — width as percentage style attribute

### Negotiation Rounds List
- Each round as a card — `data-testid="round-card-{id}"`
- Shows: round number, date, offerAmount, counterAmount, tactic, status badge
- Status badge — `data-testid="round-status-{id}"`
- Delete button — `data-testid="delete-round-{id}"`
- Status select to change status — `data-testid="status-select-{id}"` (options: "Pending", "Accepted", "Rejected")

### Add Round Form
- Fields: offerAmount, counterAmount, tactic, date
  - `data-testid`: `input-round-offer`, `input-round-counter`, `input-round-tactic`, `input-round-date`
- Submit button — `data-testid="add-round-btn"`

### Tactics Library
- List of reusable tactic suggestions — `data-testid="tactic-{index}"` (0-indexed)
- Pre-loaded tactics:
  - "Research market rates on Glassdoor and Levels.fyi"
  - "Mention competing offers without revealing exact amounts"
  - "Request signing bonus as a compromise"
  - "Emphasize unique skills and recent accomplishments"
- "Copy" button for each tactic — `data-testid="copy-tactic-{index}"`
- Clicking Copy populates the input-round-tactic field with that tactic text

## Behaviors

1. **Gap calculation**: gap = targetSalary - latest counterAmount (most recent round by id).
2. **Progress**: progress = (latestCounter - initialOffer) / (targetSalary - initialOffer) * 100, clamped 0-100.
3. **Add round**: submitting with offerAmount and counterAmount adds a new round (auto-increments round number).
4. **Delete round**: removes round, recalculates gap and progress.
5. **Status change**: changing status-select updates the round status badge.
6. **Copy tactic**: copies tactic text into input-round-tactic field.
7. **Round numbering**: new rounds auto-assign next sequential round number.

## Edge Cases

- Adding round with empty offerAmount or counterAmount does nothing.
- If no rounds exist, gap shows full gap (targetSalary - initialOffer).
- Progress bar capped at 100% even if counter exceeds target.
