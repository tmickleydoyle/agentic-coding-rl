# Weight Log App

Build a weight tracking application where users can log daily weigh-ins, view history, and see statistics.

## Data Model
- `id`: unique string
- `date`: YYYY-MM-DD
- `weight`: positive number
- `unit`: "kg" | "lbs"
- `note`: optional text
- `createdAt`: Unix timestamp

## Routes
1. **Home** — latest entry, total count, button to log
2. **Log** — form with weight (number input), unit selector (kg/lbs), note. Validates weight > 0.
3. **History** — all entries sorted newest-first
4. **Stats** — min, max, average weight, total change from first to last entry

## API
- `GET /api/weights` — all entries + stats object
- `POST /api/weights` — create entry (weight > 0 required)
- `DELETE /api/weights?id=<id>` — delete entry
