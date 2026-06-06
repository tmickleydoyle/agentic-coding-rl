# scratch-app-packing-manager

## Overview
A packing list manager for travelers to create multiple packing lists per trip, add items, and check them off.

## Routes
- `/` — Home: title, total lists count, total items count, total checked items
- `/lists` — All packing lists
- `/add-list` — Form to create a new packing list
- `/checklist` — Master checklist: all items across all lists, filterable by checked/unchecked

## Data Model
```ts
interface PackingItem {
  id: string;
  name: string;
  category: string;   // e.g. "Clothing", "Toiletries", "Electronics"
  checked: boolean;
  quantity: number;
}

interface PackingList {
  id: string;
  tripName: string;
  destination: string;
  departureDate: string;  // "YYYY-MM-DD"
  items: PackingItem[];
}
```

## Seed Data
```ts
[
  {
    id: "1", tripName: "Japan Trip", destination: "Tokyo", departureDate: "2024-03-15",
    items: [
      { id: "i1", name: "Passport", category: "Documents", checked: true, quantity: 1 },
      { id: "i2", name: "T-Shirts", category: "Clothing", checked: false, quantity: 5 },
      { id: "i3", name: "Charger", category: "Electronics", checked: true, quantity: 1 },
    ]
  },
  {
    id: "2", tripName: "Italy Tour", destination: "Rome", departureDate: "2024-05-02",
    items: [
      { id: "i4", name: "Sunscreen", category: "Toiletries", checked: false, quantity: 2 },
      { id: "i5", name: "Camera", category: "Electronics", checked: false, quantity: 1 },
    ]
  },
]
```

## Behaviors

### Home (`/`)
- Heading "Packing Manager"
- data-testid="home-list-count" — number of packing lists
- data-testid="home-item-count" — total items across all lists
- data-testid="home-checked-count" — total checked items

### Lists (`/lists`)
- data-testid="list-card" per packing list
- data-testid="list-name", "list-destination", "list-item-count" within each card
- list-item-count shows total items in that list

### Add List (`/add-list`)
- Fields: tripName (text), destination (text), departureDate (date)
- data-testid: input-trip-name, input-destination, input-departure-date, submit-list
- Creates list with empty items array
- On submit: adds list, navigates to /lists

### Checklist (`/checklist`)
- data-testid="checklist-page"
- Shows all items from all lists
- data-testid="checklist-item" per item
- data-testid="checklist-item-name", "checklist-item-category", "checklist-item-checked" within each
- checklist-item-checked shows "yes" or "no"
- data-testid="filter-checked" button — when clicked, shows only checked items
- data-testid="filter-all" button — shows all items

## API: /api/lists
- GET: all packing lists (with items)
- POST: create list (name, destination, departureDate), return 201 with new list (empty items)

## Edge Cases
- New list has empty items array
- Checklist filter persists until changed
- Home counts reflect actual state
