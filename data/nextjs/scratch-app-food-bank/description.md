# Food Bank Manager

A food bank management app with Inventory, Donations, Clients, and a REST API.

## Routes
- `/` — Shell
- `/inventory` — food items (name, category: Produce/Canned/Dry/Dairy, quantity, unit, expiry date), add item, adjust quantity
- `/donations` — incoming donations (donor name, items donated, date, status: Received/Pending), mark received
- `/clients` — client records (name, household size, last visit date), add client, log visit (updates last visit to today)

## Data / Seed
### Inventory
```
{ id: "item1", name: "Canned Beans", category: "Canned", quantity: 150, unit: "cans", expiry: "2025-12-01" }
{ id: "item2", name: "Rice", category: "Dry", quantity: 80, unit: "lbs", expiry: "2026-06-01" }
{ id: "item3", name: "Apples", category: "Produce", quantity: 40, unit: "lbs", expiry: "2024-06-15" }
```

### Donations
```
{ id: "don1", donor: "Local Supermarket", items: "50 cans beans, 20 lbs rice", date: "2024-06-01", status: "Received" }
{ id: "don2", donor: "Community Drive", items: "30 lbs apples", date: "2024-06-05", status: "Pending" }
```

### Clients
```
{ id: "cli1", name: "Smith Family", householdSize: 4, lastVisit: "2024-05-20" }
{ id: "cli2", name: "Jones Family", householdSize: 2, lastVisit: "2024-06-01" }
{ id: "cli3", name: "Rivera Family", householdSize: 5, lastVisit: "2024-05-15" }
```

## Behaviors
- Inventory: add item form (name, category, quantity, unit, expiry); +/- buttons to adjust quantity by 1
- Donations: "Mark Received" button changes status Pending→Received
- Clients: add client form (name, householdSize); "Log Visit" button sets lastVisit to today's date
- API GET /api/inventory returns all inventory items
- API POST /api/inventory adds an item (body: {name, category, quantity, unit, expiry})

## Edge Cases
- Quantity cannot go below 0 via - button
- Empty state: "No clients yet" when client list empty
- Add item: name required
