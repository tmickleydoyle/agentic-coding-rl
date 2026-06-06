# Garden Planner

A single-page React app to plan a garden: manage plant catalogue, garden beds, and log gardening activities.

## Routes / Pages

- **Home** (`home`): Dashboard — total plants in catalogue, total beds, total log entries this month (current calendar month).
- **Plants** (`plants`): Plant catalogue. Each plant: name, type (vegetable|herb|flower|fruit), sunlight (full|partial|shade), wateringFrequency (daily|weekly|biweekly). Add plant. Delete plant.
- **Beds** (`beds`): Garden beds. Each bed: name, sizesqft (number), plantIds (array of plant IDs assigned). Add bed. Assign plant to bed (select from catalogue). Remove plant from bed. Delete bed.
- **Log** (`log`): Activity log. Each entry: bedId, action (string), date (ISO date), notes (string). Add entry. Delete entry.

## Seed Data

- Plant: `{ id: "pl1", name: "Tomato", type: "vegetable", sunlight: "full", wateringFrequency: "daily" }`
- Plant: `{ id: "pl2", name: "Basil", type: "herb", sunlight: "full", wateringFrequency: "weekly" }`
- Plant: `{ id: "pl3", name: "Lavender", type: "flower", sunlight: "full", wateringFrequency: "biweekly" }`
- Bed: `{ id: "b1", name: "Raised Bed A", sizesqft: 16, plantIds: ["pl1", "pl2"] }`
- Bed: `{ id: "b2", name: "Border B", sizeqft: 8, plantIds: [] }`
- Log: `{ id: "lg1", bedId: "b1", action: "Watered", date: "2025-10-05", notes: "Soaked thoroughly" }`

## Behaviors

- Dashboard "this month" log count: entries where date month+year match the current month (use JS Date).
- Assigning a plant to a bed: plant must not already be in that bed's plantIds.
- NavBar: Home, Plants, Beds, Log. Active route `data-active="true"`.
- Bed item shows count of assigned plants.

## API Routes

`/api/plants` — GET all plants; POST create `{ name, type, sunlight, wateringFrequency }`; DELETE `?id=` (also removes plantId from all beds).

## Data-testids

- `nav-home`, `nav-plants`, `nav-beds`, `nav-log`
- `dashboard-plant-count`, `dashboard-bed-count`, `dashboard-log-count`
- `plant-list`, `plant-item`, `plant-add-form`, `plant-name-input`, `plant-type-select`, `plant-sun-select`, `plant-water-select`, `plant-submit`, `plant-delete`
- `bed-list`, `bed-item`, `bed-add-form`, `bed-name-input`, `bed-size-input`, `bed-submit`, `bed-delete`, `bed-plant-select`, `bed-assign-btn`, `bed-plant-count`
- `log-list`, `log-item`, `log-add-form`, `log-bed-select`, `log-action-input`, `log-date-input`, `log-notes-input`, `log-submit`, `log-delete`
