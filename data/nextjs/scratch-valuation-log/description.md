# Valuation Log

Build a single-page React app for logging and tracking valuations of collectible items.

## Seed Data

Start with these valuation entries pre-loaded:

| id | itemName | category | valuedBy | date | estimatedValue | notes |
|----|----------|----------|----------|------|----------------|-------|
| 1 | Tiffany Floor Lamp | Glassware | Jane Smith | 2023-03-15 | 12000 | Excellent original shade |
| 2 | Victorian Writing Desk | Furniture | Bob Chen | 2023-06-01 | 3400 | Minor veneer damage |
| 3 | Art Deco Brooch | Jewelry | Jane Smith | 2024-01-20 | 850 | Platinum and diamonds |
| 4 | Meissen Figurine | Ceramics | Alice Park | 2023-11-05 | 2100 | Crossed swords mark |
| 5 | Edwardian Carriage Clock | Clocks | Bob Chen | 2024-02-28 | 1750 | Fully working movement |

## Fields

Each valuation entry has:
- `id` (number, auto-increment)
- `itemName` (string)
- `category` (string: Furniture | Glassware | Jewelry | Ceramics | Clocks | Art | Other)
- `valuedBy` (string)
- `date` (string, ISO format YYYY-MM-DD)
- `estimatedValue` (number, USD)
- `notes` (string, may be empty)

## UI Layout

1. **Header**: "Valuation Log" heading (`data-testid="heading"`)
2. **Add Entry Form** (`data-testid="add-form"`):
   - Text input for item name (`data-testid="input-item-name"`)
   - Select for category (`data-testid="select-category"`)
   - Text input for valued by (`data-testid="input-valued-by"`)
   - Date input for date (`data-testid="input-date"`)
   - Number input for estimated value (`data-testid="input-estimated-value"`)
   - Textarea for notes (`data-testid="input-notes"`)
   - Submit button labeled "Add Entry" (`data-testid="btn-add"`)
3. **Sort & Filter Bar**:
   - Select to sort by (`data-testid="sort-by"`): options "date-asc", "date-desc", "value-asc", "value-desc"; default "date-desc"
   - Select to filter by category (`data-testid="filter-category"`), default "All"
4. **Entry List** (`data-testid="entry-list"`):
   - Each entry rendered as a row/card with `data-testid="entry-{id}"`
   - Shows item name (`data-testid="entry-name-{id}"`), category, valued by, date
   - Shows estimated value formatted as "$X,XXX" (comma-separated thousands) (`data-testid="entry-value-{id}"`)
   - Shows notes if non-empty (`data-testid="entry-notes-{id}"`)
   - "Edit Value" button (`data-testid="btn-edit-{id}"`) — clicking shows an inline number input (`data-testid="edit-input-{id}"`) pre-filled with current value and a "Save" button (`data-testid="btn-save-{id}"`)
   - "Delete" button (`data-testid="btn-delete-{id}"`)
5. **Summary** (`data-testid="summary"`):
   - Total entries (all, not filtered)
   - Average estimated value across all entries (`data-testid="avg-value"`) formatted as "$X,XXX" rounded to nearest dollar
   - Highest valued item name (`data-testid="top-item"`)

## Behaviors

- **Add Entry**: filling form and clicking "Add Entry" appends entry; form clears; id auto-increments.
- **Validation**: item name and valued by must be non-empty; date must be non-empty; estimated value must be > 0. Show error (`data-testid="form-error"`) on violation.
- **Edit Value**: clicking "Edit Value" shows an inline input; user edits value and clicks "Save" to update; the inline input then hides. Only one entry can be in edit mode at a time (opening edit on another closes the current).
- **Delete**: removes entry permanently.
- **Sort**: entries in the list are sorted according to the selected sort option. "date-asc" = oldest first, "date-desc" = newest first, "value-asc" = lowest value first, "value-desc" = highest value first.
- **Filter by Category**: shows only entries of selected category; "All" shows all.
- **Summary**: reflects ALL entries regardless of sort/filter.

## Edge Cases

- Empty item name shows error "Item name is required".
- Empty valued by shows error "Valued by is required".
- Empty date shows error "Date is required".
- Estimated value <= 0 shows error "Estimated value must be greater than 0".
- Average value rounds to nearest whole dollar.
- Saving an edited value of 0 or negative should not update (show inline error or ignore — just keep old value; no separate error element required).
- When only one entry remains, average equals that entry's value.
