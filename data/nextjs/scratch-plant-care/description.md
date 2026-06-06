# Plant Care Tracker

Build a single-page React app for tracking plant care events.

## Seed Data

```
const PLANTS = [
  { id: 1, name: "Monstera", species: "Monstera deliciosa", location: "Living Room" },
  { id: 2, name: "Pothos", species: "Epipremnum aureum", location: "Kitchen" },
  { id: 3, name: "Snake Plant", species: "Sansevieria trifasciata", location: "Bedroom" },
]

const CARE_EVENTS = [
  { id: 1, plantId: 1, type: "water", date: "2024-01-10", notes: "Soil was dry" },
  { id: 2, plantId: 2, type: "fertilize", date: "2024-01-08", notes: "Monthly feed" },
  { id: 3, plantId: 3, type: "prune", date: "2024-01-05", notes: "Removed dead leaves" },
]
```

## UI Layout

- `<h1>` with text "Plant Care Tracker"
- A plant list section showing all plants with their name, species, and location
- Each plant row has a "Select" button (data-testid="select-plant-{id}")
- A "Selected Plant" panel showing the currently selected plant's details (data-testid="selected-plant")
- A care event form (data-testid="care-form") with:
  - A select dropdown for care type: "water", "fertilize", "prune" (data-testid="care-type-select")
  - A date input (data-testid="care-date-input")
  - A textarea for notes (data-testid="care-notes-input")
  - A submit button "Log Care Event" (data-testid="log-care-btn")
- A care history list (data-testid="care-history") showing events for the selected plant
- Each care event entry shows type, date, notes, and has a "Delete" button (data-testid="delete-event-{id}")

## Behaviors

1. On load, no plant is selected. The selected plant panel and care form are hidden.
2. Clicking "Select" on a plant sets it as the selected plant. The panel, form, and care history appear.
3. Selecting a different plant updates all panels to show that plant's data.
4. The care history shows only events for the currently selected plant, sorted by date descending.
5. Submitting the care form adds a new care event to the history. The new event appears immediately.
6. The form clears after submission (type resets to "water", date and notes cleared).
7. Date input is required — submitting without a date does nothing.
8. Deleting a care event removes it from the history immediately.
9. Care event count per plant is shown next to the plant name as "(N events)" (data-testid="plant-event-count-{id}").
10. If a plant has no care events, show "No care events yet" (data-testid="no-events-msg") in the history.

## Edge Cases

- If the selected plant is deleted from the list... (plants cannot be deleted in this app)
- Notes field is optional — events can be added with empty notes
- The type dropdown must default to "water"
