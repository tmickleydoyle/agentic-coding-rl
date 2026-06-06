# Sleep Log

A single-page app for tracking nightly sleep.

## Seed Data

Three pre-existing sleep records:
- Date: 2024-01-15, Bedtime: 23:00, Wake: 07:00, Quality: Good
- Date: 2024-01-16, Bedtime: 00:30, Wake: 06:30, Quality: Fair
- Date: 2024-01-17, Bedtime: 22:00, Wake: 06:00, Quality: Excellent

## UI Elements

- Page heading: "Sleep Log"
- List of sleep records; each <li> has data-testid="sleep-record" showing:
  date, bedtime, wake time, hours slept, and quality. Example:
  "2024-01-15 | Bed: 23:00 | Wake: 07:00 | 8.0 hrs | Good"
- Average sleep display (data-testid="avg-sleep"): e.g. "Avg: 7.7 hrs"
  (average of hours slept across all records, rounded to 1 decimal)
- Form fields:
  - Label "Date" → date input (type="date")
  - Label "Bedtime" → time input (type="time")
  - Label "Wake Time" → time input (type="time")
  - Label "Quality" → select with options: Excellent, Good, Fair, Poor
  - Button "Add Record"
- Button "Clear All" to remove all records

## Behaviors

### Hours Slept Calculation
- Hours = (wake datetime - bed datetime) in hours, treating wake as next day if wake <= bed.
- Display to 1 decimal place.

### Add Record
- All fields required (date, bedtime, wake time, quality). If any empty, does nothing.
- Appends record; updates average.
- Clears form inputs after success (date, bedtime, wake time reset to empty; quality resets to "Excellent").

### Clear All
- Removes all records; average display shows "Avg: 0.0 hrs".

### Average
- Sum of all hours / count, rounded to 1 decimal.
- With seed data: (8.0 + 6.0 + 8.0) / 3 = 7.3 hrs  
  (2024-01-15: 23:00->07:00 = 8h; 2024-01-16: 00:30->06:30 = 6h; 2024-01-17: 22:00->06:00 = 8h)

## Edge Cases
- Bedtime after midnight (e.g. 00:30) treated correctly by adding 24h to wake when wake <= bed.
- Duplicate dates allowed.
