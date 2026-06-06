# Wine Cellar Tracker

A single-page React app for tracking your personal wine cellar inventory.

## Seed Data

The app starts with the following wines pre-loaded:

| Name | Winery | Year | Type | Region | Quantity |
|------|--------|------|------|--------|----------|
| Cabernet Sauvignon | Jordan | 2018 | Red | Napa Valley | 6 |
| Chardonnay | Rombauer | 2020 | White | Carneros | 3 |
| Pinot Noir | Meiomi | 2019 | Red | California | 12 |
| Sauvignon Blanc | Cloudy Bay | 2021 | White | Marlborough | 4 |
| Rosé | Whispering Angel | 2022 | Rosé | Provence | 2 |

## Fields

Each wine entry has:
- **name** (string): wine varietal or label name
- **winery** (string): producer name
- **year** (number): vintage year
- **type** (string): "Red", "White", or "Rosé"
- **region** (string): geographic origin
- **quantity** (number): bottles on hand

## UI Layout

- Page heading: "Wine Cellar"
- Filter controls: three buttons labeled "All", "Red", "White", "Rosé" to filter by type
- Sort toggle: a button "Sort by Year" that toggles ascending/descending sort by vintage year
- Add wine form with inputs: Name, Winery, Year (number), Type (select: Red/White/Rosé), Region, Quantity (number)
- Submit button labeled "Add Wine"
- Wine list: each entry rendered as a card

## Behaviors

1. **Filter**: Clicking a type button shows only wines of that type. "All" shows all. Active filter button appears visually distinct (aria-pressed="true").
2. **Sort**: Clicking "Sort by Year" sorts the visible list by year ascending; clicking again sorts descending. Button label shows current direction: "Sort by Year ↑" or "Sort by Year ↓".
3. **Add Wine**: Filling the form and clicking "Add Wine" appends the entry to the list. The new wine appears immediately. Form resets after submission.
4. **Quantity display**: Each card shows all 6 fields. Quantity is displayed as "{n} bottles".
5. **Empty form guard**: Clicking "Add Wine" with empty Name or Winery field does nothing (no new entry added).

## Data-testids

- `wine-list` — the container for all wine cards
- `wine-card` — each individual wine card (multiple)
- `wine-name` — the name within a card
- `wine-winery` — the winery within a card
- `wine-year` — the year within a card
- `wine-type` — the type within a card
- `wine-region` — the region within a card
- `wine-quantity` — the quantity within a card
- `filter-all` — "All" filter button
- `filter-red` — "Red" filter button
- `filter-white` — "White" filter button
- `filter-rose` — "Rosé" filter button
- `sort-year` — sort by year button
- `input-name` — Name input
- `input-winery` — Winery input
- `input-year` — Year input
- `input-type` — Type select
- `input-region` — Region input
- `input-quantity` — Quantity input
- `submit-wine` — Add Wine button

## Edge Cases

- If quantity is 0, still display "0 bottles".
- Sorting applies to the currently filtered set.
- Filter persists after adding a new wine (if "Red" is active and a Red wine is added, it appears; if "White" is active and a Red wine is added, it does not appear in the filtered view).
