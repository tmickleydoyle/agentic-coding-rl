# Freelance Rate Calculator

A single-page React app to help freelancers calculate their effective hourly rate based on income goals and working hours.

## Seed Data / Default Values

The calculator starts with these defaults:
- Annual income goal: $80,000
- Weeks per year: 48 (allowing 4 weeks vacation)
- Hours per week: 40
- Non-billable hours %: 30 (admin, marketing, etc.)
- Business expenses per year: $5,000
- Tax rate %: 25

## Fields

| Field                    | Type   | Min  | Max  |
|--------------------------|--------|------|------|
| Annual income goal ($)   | number | 0    | —    |
| Weeks per year           | number | 1    | 52   |
| Hours per week           | number | 1    | 80   |
| Non-billable hours (%)   | number | 0    | 99   |
| Business expenses/yr ($) | number | 0    | —    |
| Tax rate (%)             | number | 0    | 99   |

## UI Layout

- Page heading: "Rate Calculator"
- Input form with all 6 fields (number inputs with labels)
- Results panel (updates live as inputs change):
  - **Gross income needed**: income goal + expenses + tax amount
  - **Billable hours/year**: total work hours minus non-billable percentage
  - **Minimum hourly rate**: gross income needed / billable hours per year
  - **Recommended rate**: minimum rate × 1.2 (20% buffer)
- Preset buttons: "Part-time", "Full-time", "Consulting" — sets fields to preset values

## Preset Values

| Preset      | Income goal | Weeks | Hrs/wk | Non-billable % | Expenses | Tax % |
|-------------|-------------|-------|--------|----------------|----------|-------|
| Part-time   | 40,000      | 48    | 20     | 20             | 2,000    | 20    |
| Full-time   | 80,000      | 48    | 40     | 30             | 5,000    | 25    |
| Consulting  | 150,000     | 46    | 50     | 40             | 15,000   | 30    |

## Calculations

- **Tax amount** = income_goal × (tax_rate / 100)
- **Gross needed** = income_goal + expenses + tax_amount
- **Total work hours/yr** = weeks × hours_per_week
- **Billable hours/yr** = total_hours × (1 - non_billable_pct / 100)
- **Minimum rate** = gross_needed / billable_hours (rounded to 2 decimal places)
- **Recommended rate** = minimum_rate × 1.2 (rounded to 2 decimal places)

## Behaviors

1. Results update immediately whenever any input changes.
2. Clicking a preset button fills all 6 fields with preset values and recalculates.
3. All dollar amounts displayed with $ prefix and 2 decimal places.
4. If billable hours computes to 0 or less, display "N/A" for rate fields.

## Edge Cases

- Zero weeks or zero hours: show "N/A" for rates.
- 100% non-billable: show "N/A" (no billable hours).
- Negative inputs: treat as 0.
