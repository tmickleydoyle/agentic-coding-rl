# Repair History

A single-page React app to log and track home repair jobs.

## Seed Data

Start with these repair records pre-loaded:

| Item | Location | Description | Date | Cost ($) | Contractor | Status |
|------|----------|-------------|------|----------|------------|--------|
| Roof Leak | Attic | Replaced 3 shingles | 2023-04-12 | 450 | Bob's Roofing | Completed |
| Water Heater | Basement | Replaced thermocouple | 2023-07-08 | 180 | DIY | Completed |
| HVAC Filter | Living Room | Replaced air filter | 2024-01-20 | 35 | DIY | Completed |
| Kitchen Sink | Kitchen | Fixed dripping faucet | 2024-03-05 | 120 | Plumb Right | Completed |
| Garage Door | Garage | Spring replacement needed | 2024-05-10 | 0 | TBD | Pending |

## Fields

Each repair record has:
- **Item** (text, required) — what was repaired
- **Location** (text, required) — where in the home
- **Description** (text) — what was done
- **Date** (date input)
- **Cost** (number in dollars, min 0)
- **Contractor** (text) — who did the work, can be "DIY"
- **Status** (select: Pending, In Progress, Completed)

## Behaviors

### Add Repair
- A form with inputs for all fields
- "Add Repair" button submits the form
- New record appears in the list
- Form clears after successful submission
- Item and Location are required; do not add if either is empty

### Display
- Show all repairs in a table
- Columns: Item, Location, Description, Date, Cost (as "$X"), Contractor, Status
- Each row has a "Delete" button

### Filter by Status
- Dropdown filter defaulting to "All" with options: All, Pending, In Progress, Completed
- Only matching records are shown

### Sort
- A sort control with options: Date (newest first), Cost (highest first)
- Applies to the displayed (filtered) list

### Summary
- Total repairs count (all records, not filtered)
- Total cost of all repairs (sum of all costs, not filtered)

## Edge Cases
- Deleting removes the record immediately
- Filter and sort do not affect summary totals
- Cost defaults to 0
- Contractor can be blank
- Item and Location are trimmed before validation
