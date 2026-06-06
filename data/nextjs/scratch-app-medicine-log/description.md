# Medicine Log App

A multi-route application for tracking medications, logging doses, and managing medication schedules.

## Routes
- **Home** (`home`): Dashboard showing total medicines count and today's log entries count.
- **Medicines** (`medicines`): List all medications with name, dosage, frequency, and notes. Add new medicine form. Delete a medicine.
- **Log** (`log`): List dose log entries with medicine name, datetime, and notes. Add new log entry (select medicine, datetime, notes).
- **Schedule** (`schedule`): Show medicines grouped by frequency. Display each medicine's name, dosage, and next expected time based on frequency.

## Seed Data
Three medicines on load:
1. Aspirin, 100mg, daily, "Take with food"
2. Metformin, 500mg, twice daily, "Take with meals"
3. Vitamin D, 1000IU, weekly, "Take in the morning"

Two log entries:
1. Aspirin, 2024-06-10T08:00, "Taken with breakfast"
2. Metformin, 2024-06-10T07:30, "Morning dose"

## Fields & Validation
- Medicine: name (required), dosage (required), frequency (daily/twice daily/weekly), notes (optional)
- Log entry: medicineId (required), datetime (required), notes (optional)

## Behaviors
- Medicines page: clicking Delete removes a medicine from the list
- Log page: entries show medicine name resolved from medicineId
- Schedule page: groups medicines by frequency (daily, twice daily, weekly sections)
- All forms reset after successful submission
- API returns 400 with `{ error: "..." }` for missing required fields

## API
- `GET /api/medicines` — list all medicines
- `POST /api/medicines` — create medicine `{ name, dosage, frequency, notes? }`
- `DELETE /api/medicines` — delete medicine `{ id }` (body)
- `GET /api/log` — list log entries
- `POST /api/log` — create log entry `{ medicineId, datetime, notes? }`

## data-testid Requirements
- `nav-home`, `nav-medicines`, `nav-log`, `nav-schedule`
- `dashboard-medicine-count`, `dashboard-log-count`
- `medicine-list`, `medicine-item`, `add-medicine-form`, `medicine-name-input`, `medicine-dosage-input`, `medicine-frequency-select`, `medicine-notes-input`, `submit-medicine`, `delete-medicine`
- `log-list`, `log-item`, `add-log-form`, `log-medicine-select`, `log-datetime-input`, `log-notes-input`, `submit-log`
- `schedule-list`, `schedule-item`
