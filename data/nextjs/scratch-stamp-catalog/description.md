# Stamp Catalog

Build a single-page React app for cataloging postage stamps.

## Seed Data

Start with these stamps pre-loaded:

| id | name | country | year | denomination | condition |
|----|------|---------|------|--------------|-----------|
| 1 | Penny Black | United Kingdom | 1840 | 1d | Mint |
| 2 | Inverted Jenny | United States | 1918 | 24c | Fine |
| 3 | Blue Mauritius | Mauritius | 1847 | 2d | Poor |
| 4 | Basel Dove | Switzerland | 1845 | 2½r | Mint |
| 5 | Treskilling Yellow | Sweden | 1855 | 3s | Fine |

## Fields

Each stamp has:
- `id` (number, auto-increment)
- `name` (string)
- `country` (string)
- `year` (number)
- `denomination` (string, e.g. "1d", "24c")
- `condition` (string: Mint | Fine | Good | Poor)

## UI Layout

1. **Header**: "Stamp Catalog" heading (`data-testid="heading"`)
2. **Add Stamp Form** (`data-testid="add-form"`):
   - Text input for name (`data-testid="input-name"`)
   - Text input for country (`data-testid="input-country"`)
   - Number input for year (`data-testid="input-year"`)
   - Text input for denomination (`data-testid="input-denomination"`)
   - Select for condition (`data-testid="select-condition"`)
   - Submit button labeled "Add Stamp" (`data-testid="btn-add"`)
3. **Filter Bar**:
   - Text input to filter by country (`data-testid="filter-country"`) — case-insensitive partial match
   - Select to filter by condition (`data-testid="filter-condition"`), default "All"
4. **Stamp List** (`data-testid="stamp-list"`):
   - Each stamp rendered as a row/card with `data-testid="stamp-{id}"`
   - Shows name (`data-testid="stamp-name-{id}"`), country, year, denomination, condition
   - "Upgrade Condition" button (`data-testid="btn-upgrade-{id}"`) — cycles Poor -> Good -> Fine -> Mint; hidden when already Mint
   - "Delete" button (`data-testid="btn-delete-{id}"`)
5. **Stats** (`data-testid="stats"`):
   - Total stamps in catalog (all, not filtered)
   - Count of Mint condition stamps (`data-testid="count-mint"`)

## Behaviors

- **Add Stamp**: filling form and clicking "Add Stamp" appends stamp; form clears; id auto-increments.
- **Validation**: name and country must be non-empty; year must be between 1840 and 2100; denomination must be non-empty. Show error (`data-testid="form-error"`) on violation.
- **Upgrade Condition**: cycles Poor -> Good -> Fine -> Mint; button hidden when condition is Mint.
- **Delete**: removes stamp permanently.
- **Filter by Country**: typing in filter-country shows only stamps whose country contains the typed string (case-insensitive). Empty string shows all.
- **Filter by Condition**: selecting a condition shows only stamps with that condition; "All" shows every stamp.
- **Filters combine**: both filters apply simultaneously.
- **Stats**: total count and mint count reflect ALL stamps regardless of filters.

## Edge Cases

- Empty name shows error "Name is required".
- Empty country shows error "Country is required".
- Year outside 1840–2100 shows error "Year must be between 1840 and 2100".
- Empty denomination shows error "Denomination is required".
- A Mint stamp has no "Upgrade Condition" button.
- Filtering by country "united" matches both "United Kingdom" and "United States".
