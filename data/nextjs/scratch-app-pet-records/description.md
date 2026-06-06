# Pet Records

A single-page React app to manage pet health records including vet visits and medications.

## Routes / Pages

- **Home** (`home`): Dashboard — total pets, upcoming vet visits (visits where date >= today), total active medications.
- **Pets** (`pets`): List all pets. Each pet: name, species (dog|cat|bird|rabbit|other), birthDate (ISO date), weight (number, kg). Add pet. Delete pet (removes their visits and medications).
- **Visits** (`visits`): Vet visit records. Each visit: petId, vetName, date (ISO date), reason, notes. Add visit. Delete visit.
- **Medications** (`medications`): Medication tracking. Each medication: petId, name, dosage (string), frequency (daily|weekly|monthly), active (boolean). Add medication. Toggle active. Delete medication.

## Seed Data

- Pet: `{ id: "pt1", name: "Buddy", species: "dog", birthDate: "2019-05-01", weight: 12 }`
- Pet: `{ id: "pt2", name: "Whiskers", species: "cat", birthDate: "2021-03-15", weight: 4 }`
- Visit: `{ id: "v1", petId: "pt1", vetName: "Dr. Smith", date: "2025-11-10", reason: "Checkup", notes: "Healthy" }`
- Medication: `{ id: "m1", petId: "pt1", name: "Heartgard", dosage: "1 tablet", frequency: "monthly", active: true }`
- Medication: `{ id: "m2", petId: "pt2", name: "Flea Treatment", dosage: "0.5ml", frequency: "monthly", active: false }`

## Behaviors

- Dashboard upcoming visits: count visits where date (ISO string) >= today's ISO date (YYYY-MM-DD comparison).
- Active medications count: medications where active === true.
- Deleting a pet removes all their visits and medications.
- Adding a pet requires name (non-empty) and species.
- Adding a visit requires petId, vetName, date.
- Adding a medication requires petId, name, dosage, frequency.
- NavBar: Home, Pets, Visits, Medications. Active route `data-active="true"`.

## API Routes

`/api/pets` — GET all pets; POST create `{ name, species, birthDate, weight }`; DELETE `?id=` (cascades).

## Data-testids

- `nav-home`, `nav-pets`, `nav-visits`, `nav-medications`
- `dashboard-pet-count`, `dashboard-upcoming-visits`, `dashboard-active-meds`
- `pet-list`, `pet-item`, `pet-add-form`, `pet-name-input`, `pet-species-select`, `pet-birth-input`, `pet-weight-input`, `pet-submit`, `pet-delete`
- `visit-list`, `visit-item`, `visit-add-form`, `visit-pet-select`, `visit-vet-input`, `visit-date-input`, `visit-reason-input`, `visit-notes-input`, `visit-submit`, `visit-delete`
- `med-list`, `med-item`, `med-add-form`, `med-pet-select`, `med-name-input`, `med-dosage-input`, `med-freq-select`, `med-submit`, `med-toggle`, `med-delete`
