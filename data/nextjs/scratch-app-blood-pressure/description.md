# Blood Pressure Monitor App

Build a blood pressure tracking app where users can record BP readings, view history, and analyze trends.

## Data Model
- `id`, `date` (YYYY-MM-DD), `time` (HH:MM)
- `systolic`, `diastolic`, `pulse`: integers
- `note`: optional string
- `category`: auto-computed from systolic/diastolic:
  - Normal: systolic < 120 AND diastolic < 80
  - Elevated: systolic 120-129 AND diastolic < 80
  - High Stage 1: systolic 130-139 OR diastolic 80-89
  - High Stage 2: systolic >= 140 OR diastolic >= 90
  - Crisis: systolic >= 180 OR diastolic >= 120
- `createdAt`: Unix timestamp

## Routes
1. **Home** — latest reading, total count, record button
2. **Record** — form with systolic, diastolic, pulse, note. Validates systolic and diastolic > 0.
3. **History** — all readings newest-first with date, time, values, category label
4. **Trends** — average systolic/diastolic/pulse, category breakdown counts

## API
- `GET /api/readings` — all readings + averages object
- `POST /api/readings` — create reading (auto-computes category)
- `DELETE /api/readings?id=<id>` — delete reading
