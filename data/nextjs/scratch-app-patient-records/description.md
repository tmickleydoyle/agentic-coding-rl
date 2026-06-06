# Patient Records App

A multi-route clinical patient records application for managing patients, appointments, and medical records.

## Routes
- **Home** (`home`): Dashboard showing total patients, today's appointments count, and recent activity summary.
- **Patients** (`patients`): List all patients with search by name. Add new patient form (name, dob, gender, phone). Click patient to view detail.
- **Appointments** (`appointments`): List appointments with patient name, date, time, reason, status (scheduled/completed/cancelled). Add new appointment (select patient, date, time, reason). Mark appointment as completed or cancelled.
- **Records** (`records`): List medical records with patient name, date, diagnosis, notes. Add new record (select patient, date, diagnosis, notes).

## Seed Data
Three patients on load:
1. Alice Johnson, DOB: 1985-03-12, Female, Phone: 555-0101
2. Bob Smith, DOB: 1972-07-24, Male, Phone: 555-0102
3. Carol White, DOB: 1990-11-05, Female, Phone: 555-0103

Two appointments:
1. Alice Johnson, 2024-06-10, 09:00, Annual Checkup, scheduled
2. Bob Smith, 2024-06-11, 14:30, Follow-up, completed

Two medical records:
1. Alice Johnson, 2024-05-01, Hypertension, "Prescribed lisinopril 10mg"
2. Bob Smith, 2024-04-15, Diabetes Type 2, "Diet and exercise plan recommended"

## Fields & Validation
- Patient: name (required, non-empty), dob (required), gender (Male/Female/Other), phone (required)
- Appointment: patientId (required), date (required), time (required), reason (required), status defaults to "scheduled"
- Record: patientId (required), date (required), diagnosis (required), notes (optional)

## Behaviors
- Patients page: filter list by name substring (case-insensitive) using search input
- Appointments page: badge showing status color (scheduled=blue, completed=green, cancelled=red)
- Dashboard counts update when new items are added
- All forms reset after successful submission
- API returns 400 with `{ error: "..." }` for missing required fields

## API
- `GET /api/patients` — list all patients
- `POST /api/patients` — create patient `{ name, dob, gender, phone }`
- `GET /api/appointments` — list appointments
- `POST /api/appointments` — create appointment `{ patientId, date, time, reason }`
- `GET /api/records` — list records
- `POST /api/records` — create record `{ patientId, date, diagnosis, notes? }`

## data-testid Requirements
- `nav-home`, `nav-patients`, `nav-appointments`, `nav-records`
- `dashboard-patient-count`, `dashboard-appointment-count`
- `patient-list`, `patient-item`, `patient-search`, `add-patient-form`, `patient-name-input`, `patient-dob-input`, `patient-gender-select`, `patient-phone-input`, `submit-patient`
- `appointment-list`, `appointment-item`, `add-appointment-form`, `appointment-patient-select`, `appointment-date-input`, `appointment-time-input`, `appointment-reason-input`, `submit-appointment`, `complete-appointment`, `cancel-appointment`
- `record-list`, `record-item`, `add-record-form`, `record-patient-select`, `record-date-input`, `record-diagnosis-input`, `record-notes-input`, `submit-record`
