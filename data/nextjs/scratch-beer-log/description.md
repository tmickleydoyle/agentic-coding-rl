# Beer Tasting Log

A single-page React app for logging and rating beers you've tried.

## Seed Data

The app starts with the following beer entries pre-loaded:

| Name | Brewery | Style | ABV | Rating | Notes |
|------|---------|-------|-----|--------|-------|
| Heady Topper | The Alchemist | IPA | 8.0 | 5 | Legendary Vermont double IPA |
| Pliny the Elder | Russian River | IPA | 8.0 | 5 | West coast hop bomb |
| Founders KBS | Founders | Stout | 11.2 | 4 | Bourbon barrel aged stout |
| Bell's Two Hearted | Bell's | IPA | 7.0 | 4 | Classic American IPA |
| Dogfish 90 Minute | Dogfish Head | IPA | 9.0 | 3 | Imperial IPA with continuous hopping |

## Fields

Each beer entry has:
- **name** (string): beer name
- **brewery** (string): brewery name
- **style** (string): beer style (e.g., IPA, Stout, Lager)
- **abv** (number): alcohol by volume percentage
- **rating** (number): 1–5 star rating
- **notes** (string): tasting notes

## UI Layout

- Page heading: "Beer Tasting Log"
- Filter controls: "All Styles" option plus one button per unique style present in the data
- Add beer form with inputs: Name, Brewery, Style, ABV (number), Rating (select 1–5), Notes (textarea)
- Submit button labeled "Add Beer"
- Beer list: each entry as a card showing all fields
- Rating displayed as star characters (e.g., rating 3 = "★★★☆☆")

## Behaviors

1. **Filter by Style**: Clicking a style button shows only beers of that style. "All Styles" shows all.
2. **Add Beer**: Submitting the form appends a new entry. Form resets after submission.
3. **Empty guard**: Clicking "Add Beer" with empty Name or Brewery does nothing.
4. **Star rating display**: Each card renders rating as filled stars (★) and empty stars (☆) totaling 5.
5. **ABV display**: Show as "{abv}%" in the card.

## Data-testids

- `beer-list` — container for all beer cards
- `beer-card` — each individual beer card
- `beer-name` — beer name in card
- `beer-brewery` — brewery in card
- `beer-style` — style in card
- `beer-abv` — ABV in card
- `beer-rating` — star rating display in card
- `beer-notes` — notes in card
- `filter-all` — "All Styles" button
- `style-filter` — each style filter button (multiple)
- `input-name` — Name input
- `input-brewery` — Brewery input
- `input-style` — Style input
- `input-abv` — ABV input
- `input-rating` — Rating select
- `input-notes` — Notes textarea
- `submit-beer` — Add Beer button

## Edge Cases

- If a beer with a new style is added, a new style filter button appears.
- ABV of 0 should display "0%".
- Rating 1 displays "★☆☆☆☆".
- Rating 5 displays "★★★★★".
