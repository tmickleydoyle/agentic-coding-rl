# Pet Adoption Tracker

A single-page React app for managing pet adoption listings and their statuses.

## Seed Data

Four pets pre-loaded:
- { id: 1, name: "Daisy", species: "Dog", breed: "Beagle", age: 2, status: "Available", applicant: "", notes: "Friendly and energetic" }
- { id: 2, name: "Oliver", species: "Cat", breed: "Tabby", age: 4, status: "Pending", applicant: "Jane Doe", notes: "Calm indoor cat" }
- { id: 3, name: "Nibbles", species: "Rabbit", breed: "Lop", age: 1, status: "Adopted", applicant: "Bob Smith", notes: "Loves veggies" }
- { id: 4, name: "Spike", species: "Dog", breed: "Bulldog", age: 3, status: "Available", applicant: "", notes: "" }

## UI Layout

### Filter Bar
- Three filter buttons: "All", "Available", "Pending", "Adopted"
- data-testid="filter-all", "filter-available", "filter-pending", "filter-adopted"
- Active filter button is bold.
- Clicking a filter shows only pets with that status (or all pets for "All").

### Pets List
- data-testid="pets-list"
- Each pet card: data-testid="pet-card-<id>" (using the pet's numeric id)
  - Shows: name (data-testid="pet-card-name-<id>"), species, breed, age
  - Status badge: data-testid="pet-status-<id>" showing current status
  - Applicant field: data-testid="pet-applicant-<id>"
  - Notes field: data-testid="pet-notes-<id>"
- If no pets match filter: data-testid="no-pets-msg" "No pets found"

### Status Count Summary
- data-testid="count-available" — "Available: N"
- data-testid="count-pending" — "Pending: N"
- data-testid="count-adopted" — "Adopted: N"
- Counts are always based on ALL pets (not filtered view).

### Edit Pet Panel
- Clicking a pet card selects it and shows an edit panel (data-testid="edit-panel").
- Edit panel shows:
  - "Status" select with options Available, Pending, Adopted (data-testid="edit-status-select")
  - "Applicant" text input (data-testid="edit-applicant-input")
  - "Notes" textarea (data-testid="edit-notes-textarea")
  - "Save Changes" button (data-testid="save-changes-btn")
  - "Cancel" button (data-testid="cancel-edit-btn")
- On "Save Changes": update the pet's status, applicant, and notes. Close the panel.
- On "Cancel": close the panel without saving.
- Only one pet can be selected at a time.

### Add Pet Form
- data-testid="add-pet-form"
- "Name" text input (data-testid="add-name-input")
- "Species" text input (data-testid="add-species-input")
- "Breed" text input (data-testid="add-breed-input")
- "Age" number input (data-testid="add-age-input")
- Submit button: "Add Pet"
- On submit: add new pet with status "Available", empty applicant, empty notes. Clear form.
- If name or species is empty, do not add.

## Behaviors & Edge Cases

- Status counts update when pets are edited or added.
- Filter persists when pets are edited.
- Changing status to "Available" should clear the applicant field on save.
- All state managed with useState.
