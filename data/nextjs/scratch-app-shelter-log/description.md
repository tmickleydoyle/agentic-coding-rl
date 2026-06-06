# Shelter Log

A homeless shelter management app with Residents, Beds, Services, and a REST API.

## Routes
- `/` — Shell
- `/residents` — resident records (name, age, check-in date, status: Staying/Departed), add resident, mark departed
- `/beds` — bed roster (bed number, wing: A/B/C, occupied: boolean, resident name if occupied)
- `/services` — services log (resident name, service: Meal/Counseling/Medical/Job Aid, date, notes)

## Data / Seed
### Residents
```
{ id: "r1", name: "James Doe", age: 34, checkIn: "2024-05-10", status: "Staying" }
{ id: "r2", name: "Maria Santos", age: 28, checkIn: "2024-05-15", status: "Staying" }
{ id: "r3", name: "Tom Webb", age: 45, checkIn: "2024-04-01", status: "Departed" }
```

### Beds
```
{ id: "b1", bedNumber: "A-01", wing: "A", occupied: true, residentId: "r1" }
{ id: "b2", bedNumber: "A-02", wing: "A", occupied: true, residentId: "r2" }
{ id: "b3", bedNumber: "B-01", wing: "B", occupied: false, residentId: null }
{ id: "b4", bedNumber: "B-02", wing: "B", occupied: false, residentId: null }
```

### Services
```
{ id: "s1", residentId: "r1", service: "Meal", date: "2024-06-01", notes: "Dinner" }
{ id: "s2", residentId: "r2", service: "Counseling", date: "2024-06-02", notes: "Weekly session" }
```

## Behaviors
- Residents: add resident form (name, age); "Mark Departed" changes status to Departed
- Beds: shows bed number, wing, occupancy status; "Assign" button (for empty beds) with dropdown of Staying residents
- Services: add service form (select from Staying residents, service type, date, notes)
- API GET /api/residents returns all residents
- API POST /api/residents adds a resident (body: {name, age})

## Edge Cases
- Beds: occupied beds show resident name; unoccupied show "Empty"
- Services: only Staying residents appear in service form dropdown
- Departed residents cannot be assigned beds
