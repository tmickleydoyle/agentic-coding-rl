# Aquarium Livestock Catalog

Build a single-page livestock catalog for tracking fish and invertebrates across multiple tanks with search and filtering.

## Seed Data

Pre-populate with these entries on load:

| id | name            | species                  | tank       | quantity | type         |
|----|-----------------|--------------------------|------------|----------|--------------|
| 1  | Nemo            | Amphiprioninae           | Reef Tank  | 2        | Fish         |
| 2  | Dory            | Paracanthurus hepatus    | Reef Tank  | 1        | Fish         |
| 3  | Turbo Snail     | Turbo fluctuosa          | Reef Tank  | 5        | Invertebrate |
| 4  | Neon Tetra      | Paracheirodon innesi     | Freshwater | 10       | Fish         |
| 5  | Cherry Shrimp   | Neocaridina davidi       | Freshwater | 15       | Invertebrate |

## Fields

Each entry has:
- **id**: unique number (auto-increment)
- **name**: common name (string, required)
- **species**: scientific name (string, required)
- **tank**: string (from dropdown)
- **quantity**: positive integer (required)
- **type**: "Fish" or "Invertebrate"

## Available Tanks
- Reef Tank
- Freshwater
- Quarantine
- Planted

## UI Layout

1. **Heading**: "Livestock Catalog" as an `<h1>`
2. **Add Entry form**:
   - Label "Common Name" + `<input type="text">`, `data-testid="name-input"`
   - Label "Species" + `<input type="text">`, `data-testid="species-input"`
   - Label "Tank" + `<select>`, `data-testid="tank-select"`
   - Label "Quantity" + `<input type="number" min="1">`, `data-testid="quantity-input"`
   - Label "Type" + `<select>` with "Fish" and "Invertebrate", `data-testid="type-select"`
   - Submit `<button>` "Add Animal", `data-testid="add-button"`
3. **Search**: `<input type="text">` placeholder "Search by name or species", `data-testid="search-input"`
4. **Tank filter**: `<select>` with "All" + tanks, `data-testid="tank-filter"`
5. **Catalog list**: `data-testid="catalog-list"` — items matching both search AND tank filter:
   - `data-testid="animal-{id}"` wrapping each
   - `data-testid="animal-name-{id}"` — common name
   - `data-testid="animal-species-{id}"` — scientific name
   - `data-testid="animal-tank-{id}"` — tank
   - `data-testid="animal-quantity-{id}"` — quantity
   - `data-testid="animal-type-{id}"` — type
   - Delete button `data-testid="delete-{id}"`
6. **Stats**:
   - `data-testid="total-animals"` — total count of visible entries
   - `data-testid="total-quantity"` — sum of quantity for visible entries

## Behaviors

- **Add**: name, species must be non-empty (trim); quantity must be >= 1. If invalid do not add. Clears name, species, quantity inputs after success.
- **Search**: filters by partial match (case-insensitive) on name OR species simultaneously.
- **Tank filter**: restricts to selected tank.
- **Combined filter**: both search and tank filter apply at the same time.
- **Delete**: removes the entry.
- **Stats**: total-animals = count of visible entries; total-quantity = sum of quantity of visible entries.

## Edge Cases

- Search + tank filter combine (AND logic): an entry must match both.
- Deleting updates stats immediately.
- Quantity 0 or negative is not allowed.
- All tanks always appear in tank-filter dropdown.
