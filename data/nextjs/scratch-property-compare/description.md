# Property Compare

A single-page app to select up to 3 properties and compare them side by side.

## Seed Data

Five properties pre-loaded:

| id | address | price | bedrooms | bathrooms | sqft | yearBuilt | parking | hoa |
|----|---------|-------|----------|-----------|------|-----------|---------|-----|
| 1 | 123 Maple St | 450000 | 3 | 2 | 1800 | 1998 | 2 | 0 |
| 2 | 456 Oak Ave | 320000 | 2 | 1 | 1100 | 2005 | 1 | 250 |
| 3 | 789 Pine Rd | 675000 | 4 | 3 | 2600 | 1985 | 2 | 0 |
| 4 | 101 Elm Blvd | 540000 | 3 | 2 | 1950 | 2012 | 2 | 150 |
| 5 | 202 Cedar Ln | 280000 | 1 | 1 | 750 | 2019 | 1 | 300 |

## Selection Panel

- List all 5 properties with checkboxes.
- Each property row has data-testid="property-option-{id}".
- Checking a property adds it to the comparison table.
- When 3 properties are already selected, additional checkboxes are disabled (cannot select a 4th).
- A "Clear All" button (data-testid="clear-all") deselects all properties.

## Comparison Table

- Shows when at least 1 property is selected.
- data-testid="compare-table".
- Columns: one per selected property.
- Rows: Address, Price ($XXX,XXX), Bedrooms, Bathrooms, Sqft, Year Built, Parking Spaces, HOA/month ($X or "None").
- HOA of 0 is displayed as "None".

## Behaviors

- Selecting fewer than 1 property hides the comparison table entirely.
- Up to 3 properties can be compared simultaneously.
- Selecting a 4th property is blocked (checkbox disabled).
- "Clear All" resets selection and hides table.

## Edge Cases

- HOA=0 must show "None", not "$0".
- Exactly 3 selected: all unselected checkboxes become disabled.
- After clearing, table disappears and all checkboxes re-enabled.
