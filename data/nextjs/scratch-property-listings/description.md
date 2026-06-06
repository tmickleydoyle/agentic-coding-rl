# Property Listings

A single-page React app for browsing and filtering rental property listings.

## Seed Data

Five properties pre-loaded:

| id | address | bedrooms | bathrooms | rent | type |
|----|---------|----------|-----------|------|------|
| 1 | 101 Maple St | 2 | 1 | 1500 | Apartment |
| 2 | 205 Oak Ave | 3 | 2 | 2200 | House |
| 3 | 312 Pine Rd | 1 | 1 | 950 | Studio |
| 4 | 400 Elm Blvd | 4 | 3 | 3100 | House |
| 5 | 88 Cedar Ln | 2 | 2 | 1800 | Apartment |

## UI Layout

- `<h1>` with text "Property Listings"
- Filter controls (all inline):
  - A text input labeled "Search by address" — filters listings by address substring (case-insensitive)
  - A select labeled "Type" with options: All, Apartment, House, Studio
  - A number input labeled "Max Rent" — hides listings with rent > entered value; empty means no limit
- A summary paragraph showing "X properties found" where X is the count of visible listings (`data-testid="count"`)
- A list of property cards; each card has:
  - `data-testid="property-card"`
  - Address in a heading element
  - Text showing bedrooms: "Bedrooms: N"
  - Text showing bathrooms: "Bathrooms: N"
  - Text showing rent: "$N/mo" (no decimals)
  - Property type badge
  - A "View Details" button that toggles an expanded section; when expanded shows a details panel with `data-testid="property-details"` containing text "Contact us about [address]"
- A "Clear Filters" button that resets all three filters to their default values

## Behaviors

- Filters are applied simultaneously (AND logic).
- When no listings match, show a paragraph with `data-testid="no-results"` and text "No properties found."
- "View Details" toggles per-card; clicking it again collapses the details.
- Only one details panel can be open at a time — opening a new card closes the previously open one.
- "Clear Filters" resets search to "", type to "All", and maxRent to "".
