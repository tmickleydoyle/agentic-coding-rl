# Offer Comparison

A single-page React app to compare job offers side by side, calculating total compensation and ranking them.

## Seed Data

3 job offers pre-loaded:

| id | company | role | baseSalary | bonus | equity | benefits | location | remote |
|----|---------|------|------------|-------|--------|----------|----------|--------|
| 1 | Acme Corp | Senior Engineer | 150000 | 15000 | 50000 | 12000 | New York, NY | false |
| 2 | Beta Inc | Staff Engineer | 170000 | 20000 | 80000 | 10000 | Remote | true |
| 3 | Gamma LLC | Principal Engineer | 160000 | 25000 | 100000 | 15000 | San Francisco, CA | false |

Total compensation = baseSalary + bonus + (equity / 4) + benefits (equity vested over 4 years).

## UI Layout

### Header
- Title: "Offer Comparison"
- "Best Offer" badge showing company name of highest total comp — `data-testid="best-offer"`

### Offer Cards
- Each offer in a card — `data-testid="offer-card-{id}"`
- Shows: company, role, location, remote status ("Remote" or "On-site")
- Shows: base salary, bonus, equity, benefits formatted as currency
- Shows computed total comp — `data-testid="total-comp-{id}"`
- Shows rank (1 = highest total comp) — `data-testid="rank-{id}"`
- Delete button — `data-testid="delete-offer-{id}"`

### Add Offer Form
- Fields: company, role, baseSalary, bonus, equity, benefits, location, remote (checkbox)
  - `data-testid`: `input-offer-company`, `input-offer-role`, `input-offer-base`, `input-offer-bonus`, `input-offer-equity`, `input-offer-benefits`, `input-offer-location`, `input-offer-remote`
- Submit button — `data-testid="add-offer-btn"`

### Comparison Table
- A summary table — `data-testid="comparison-table"`
- One row per offer showing company and total comp
- Rows in descending order of total comp

## Behaviors

1. **Total comp calculation**: totalComp = baseSalary + bonus + (equity / 4) + benefits.
2. **Ranking**: rank 1 = highest total comp; ties share the same rank.
3. **Best offer**: best-offer badge shows company with rank 1.
4. **Add offer**: submitting with company and role adds a new card; recalculates ranks.
5. **Delete offer**: removes card; recalculates ranks and best-offer.
6. **Comparison table**: always sorted by total comp descending.

## Edge Cases

- Adding offer with empty company or role does nothing.
- Numeric fields default to 0 if left empty.
- After deletion with 0 offers, best-offer shows "None".
- Display numbers as integers (no decimals) for total comp.
