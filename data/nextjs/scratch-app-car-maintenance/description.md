# Car Maintenance Tracker

A single-page React app to track vehicles, service history, and maintenance reminders.

## Routes / Pages

- **Home** (`home`): Dashboard — total vehicles, overdue reminders count (dueDate < today), total service records.
- **Vehicles** (`vehicles`): Manage vehicles. Each vehicle: make, model, year (number), mileage (number). Add vehicle. Update mileage. Delete vehicle (removes its service records and reminders).
- **Service** (`service`): Service records. Each record: vehicleId, serviceType (string), date (ISO date), mileageAtService (number), cost (number), notes. Add record. Delete record.
- **Reminders** (`reminders`): Maintenance reminders. Each reminder: vehicleId, title (string), dueDate (ISO date), dueMileage (number), completed (boolean). Add reminder. Toggle completed. Delete reminder.

## Seed Data

- Vehicle: `{ id: "v1", make: "Toyota", model: "Camry", year: 2018, mileage: 45000 }`
- Vehicle: `{ id: "v2", make: "Honda", model: "Civic", year: 2020, mileage: 28000 }`
- Service: `{ id: "s1", vehicleId: "v1", serviceType: "Oil Change", date: "2025-09-15", mileageAtService: 44500, cost: 45, notes: "Synthetic 5W-30" }`
- Service: `{ id: "s2", vehicleId: "v2", serviceType: "Tire Rotation", date: "2025-09-20", mileageAtService: 27800, cost: 25, notes: "" }`
- Reminder: `{ id: "r1", vehicleId: "v1", title: "Next Oil Change", dueDate: "2026-03-15", dueMileage: 49500, completed: false }`
- Reminder: `{ id: "r2", vehicleId: "v2", title: "Brake Inspection", dueDate: "2025-06-01", dueMileage: 30000, completed: false }`

## Behaviors

- Overdue reminders: dueDate < today's ISO date and completed === false.
- Dashboard uses current date for overdue calculation (r2 dueDate 2025-06-01 is overdue as of 2026-06-06).
- Deleting a vehicle cascades to its service records and reminders.
- Adding vehicle requires make, model, year > 0.
- Adding service requires vehicleId, serviceType (non-empty), date.
- Adding reminder requires vehicleId, title, dueDate.
- NavBar: Home, Vehicles, Service, Reminders. Active route `data-active="true"`.

## API Routes

`/api/vehicles` — GET all; POST create `{ make, model, year, mileage }`; PATCH `?id=` body `{ mileage }` updates mileage; DELETE `?id=` (cascades).

## Data-testids

- `nav-home`, `nav-vehicles`, `nav-service`, `nav-reminders`
- `dashboard-vehicle-count`, `dashboard-overdue-count`, `dashboard-service-count`
- `vehicle-list`, `vehicle-item`, `vehicle-add-form`, `vehicle-make-input`, `vehicle-model-input`, `vehicle-year-input`, `vehicle-mileage-input`, `vehicle-submit`, `vehicle-delete`, `vehicle-mileage-update`, `vehicle-mileage-field`
- `service-list`, `service-item`, `service-add-form`, `service-vehicle-select`, `service-type-input`, `service-date-input`, `service-mileage-input`, `service-cost-input`, `service-notes-input`, `service-submit`, `service-delete`
- `reminder-list`, `reminder-item`, `reminder-add-form`, `reminder-vehicle-select`, `reminder-title-input`, `reminder-due-date-input`, `reminder-due-mileage-input`, `reminder-submit`, `reminder-toggle`, `reminder-delete`
