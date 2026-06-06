# Sleep Tracker App

Build a sleep tracking application where users log nightly sleep, view history, and get insights about sleep patterns.

## Data Model
- `id`, `date` (morning date YYYY-MM-DD), `bedtime` (HH:MM), `wakeTime` (HH:MM)
- `durationHours`: auto-computed from bedtime to wakeTime (handles overnight: if wake < bed, add 24h)
- `quality`: 1-5 (1=Terrible, 5=Excellent), `notes`, `createdAt`

## Routes
1. **Home** — nights logged, average sleep duration, latest entry, log button
2. **Log** — form: date, bedtime (time input), wake time (time input), quality (range 1-5), notes. All three date/time fields required.
3. **History** — all entries newest-first with date, duration, quality label, bedtime, wake time
4. **Insights** — avg duration, avg quality, best and worst nights by date

## API
- `GET /api/sleep` — all entries + insights object
- `POST /api/sleep` — create entry (date, bedtime, wakeTime required; auto-computes durationHours)
- `DELETE /api/sleep?id=<id>` — delete entry
