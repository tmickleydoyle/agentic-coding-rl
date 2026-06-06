# Vet Visit Log

A single-page React app for tracking veterinary visits for multiple pets.

## Seed Data

Two pets pre-loaded with vet visit history:
- **Bella** (Dog):
  - Visit 1: date="2024-01-15", vet="Dr. Smith", diagnosis="Annual checkup", treatment="Vaccines", nextAppt="2025-01-15"
  - Visit 2: date="2024-06-10", vet="Dr. Smith", diagnosis="Ear infection", treatment="Antibiotics", nextAppt="2024-06-24"
- **Mittens** (Cat):
  - Visit 1: date="2024-02-20", vet="Dr. Jones", diagnosis="Dental cleaning", treatment="Cleaning + polish", nextAppt="2025-02-20"

## UI Layout

### Pet Selector
- A row of buttons, one per pet, labeled with the pet's name.
- Active pet button has bold font weight.
- Show selected pet name (data-testid="pet-name") and species (data-testid="pet-species") below buttons.

### Visit Log Table
- data-testid="visit-table"
- Columns: Date | Vet | Diagnosis | Treatment | Next Appt | Actions
- Each row: data-testid="visit-row-<index>" (0-based, sorted by date ascending)
- Delete button per row: data-testid="delete-visit-<index>"
- If no visits: show "No visits recorded" (data-testid="no-visits-msg")

### Next Upcoming Appointment Banner
- data-testid="next-appt-banner"
- Show "Next appointment: <date>" using the earliest nextAppt date among all visits for the selected pet that is in the future relative to today (hardcoded as "2024-07-01" for testing purposes).
- If no future appointments, show "No upcoming appointments".

### Add Visit Form
- data-testid="add-visit-form"
- Fields:
  - "Visit Date" — date input (data-testid="visit-date-input")
  - "Vet Name" — text input (data-testid="visit-vet-input")
  - "Diagnosis" — text input (data-testid="visit-diagnosis-input")
  - "Treatment" — text input (data-testid="visit-treatment-input")
  - "Next Appointment" — date input (data-testid="visit-next-input")
  - Submit button: "Add Visit"
- On submit: add visit to selected pet's log. Clear form.
- If visit date or vet name is empty, do not add.

## Behaviors & Edge Cases

- Visits are sorted by date ascending in the table.
- Switching pets shows that pet's visits only.
- Deleting a visit removes it from the log.
- Today's date for the banner comparison is hardcoded as "2024-07-01".
- All state managed with useState.
