# Fish Feeding Tracker

Build a single-page fish feeding tracker where users can log feedings for each tank and view daily totals.

## Seed Data

Pre-populate with these tanks and their feeding records on load:

Tanks:
| id | name        | fishCount |
|----|-------------|-----------|
| 1  | Reef Tank   | 8         |
| 2  | Freshwater  | 12        |
| 3  | Quarantine  | 2         |
| 4  | Planted     | 6         |

Feedings (today's date for all seed records):
| id | tankId | amount   | food        | time  |
|----|--------|----------|-------------|-------|
| 1  | 1      | 1 pinch  | Flake       | 08:00 |
| 2  | 2      | 2 pinches| Pellet      | 08:30 |
| 3  | 1      | 1 pinch  | Frozen Mysis| 17:00 |

## Fields

Each feeding record has:
- **id**: unique number (auto-increment)
- **tankId**: number referencing a tank
- **amount**: string (e.g. "1 pinch")
- **food**: string (food type)
- **time**: string HH:MM

## UI Layout

1. **Heading**: "Fish Feeding Tracker" as an `<h1>`
2. **Add Feeding form**:
   - Label "Tank" + `<select>` listing all 4 tanks by name, `data-testid="tank-select"`
   - Label "Food Type" + `<input type="text">`, `data-testid="food-input"`
   - Label "Amount" + `<input type="text">`, `data-testid="amount-input"`
   - Label "Time" + `<input type="time">`, `data-testid="time-input"`
   - Submit `<button>` "Log Feeding", `data-testid="log-button"`
3. **Tanks summary list**: `data-testid="tanks-list"` — one row per tank showing:
   - `data-testid="tank-name-{id}"` — tank name
   - `data-testid="tank-fish-count-{id}"` — fish count
   - `data-testid="tank-feeding-count-{id}"` — number of feedings logged for that tank today
4. **Feedings log**: `data-testid="feedings-list"` — one item per feeding record:
   - `data-testid="feeding-{id}"` wrapping each entry
   - `data-testid="feeding-tank-{id}"` — tank name
   - `data-testid="feeding-food-{id}"` — food type
   - `data-testid="feeding-amount-{id}"` — amount
   - `data-testid="feeding-time-{id}"` — time
   - Delete button `data-testid="delete-feeding-{id}"`
5. **Total feedings count**: `data-testid="total-feedings"` showing e.g. "3 feedings logged"

## Behaviors

- **Add**: clicking "Log Feeding" appends a new feeding. Food and amount must be non-empty (trim); if either is empty, do not add. Clears food and amount inputs after success.
- **Delete**: removes the feeding from the list and decrements that tank's feeding count.
- **Tank feeding count**: updates reactively as feedings are added/deleted.
- **Total count**: always reflects the total number of feedings in the list.

## Edge Cases

- Submitting with empty food or empty amount does nothing.
- Deleting a feeding updates the per-tank count immediately.
- All 4 tanks always appear in the summary list even if they have zero feedings.
