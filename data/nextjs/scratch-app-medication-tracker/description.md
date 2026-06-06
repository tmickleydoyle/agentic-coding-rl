# Medication Tracker App

Build a medication management app where users can add medications, view their schedule, log doses, and track adherence.

## Data Model

### Medication
- `id`, `name`, `dosage`, `frequency` (daily/twice-daily/weekly/as-needed)
- `instructions`: string, `active`: boolean, `createdAt`: timestamp

### DoseLog
- `id`, `medicationId`, `medicationName`, `takenAt` (timestamp), `note`

## Routes
1. **Home** — active medication count, dose count, active meds list, button to add
2. **Add** — form with name, dosage, frequency select, instructions. Name + dosage required.
3. **Schedule** — all medications with frequency, active status, "Log Dose" and "Activate/Deactivate" buttons
4. **Dose Log** — all dose logs sorted newest-first with med name, timestamp, note

## API
- `GET /api/medications` — all medications + logs
- `POST /api/medications` — add medication (name + dosage required)
- `PATCH /api/medications?id=<id>` — toggle active status
- `DELETE /api/medications?id=<id>` — delete medication
- `PUT /api/medications` — log a dose (body: { medicationId, note })
