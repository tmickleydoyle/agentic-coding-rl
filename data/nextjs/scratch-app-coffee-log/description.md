# Coffee Log

A single-page React app for coffee enthusiasts to log brews, manage bean inventory, and track tasting stats.

## Routes / Pages

- **Home** (`home`): Dashboard — total brews logged, total beans in inventory, average rating across all brews (1 decimal).
- **Log** (`log`): Brew log. Each brew: beanId, method (espresso|pour-over|french-press|aeropress|cold-brew), date (ISO date), rating (1-5), notes (string). Add brew. Delete brew.
- **Beans** (`beans`): Bean inventory. Each bean: name, origin (string), roast (light|medium|dark), price (number per 100g). Add bean. Delete bean.
- **Stats** (`stats`): Aggregated stats — brews per method (count), average rating per bean (show bean name + avg rating), total brews this week (date within last 7 days from today).

## Seed Data

- Bean: `{ id: "b1", name: "Ethiopian Yirgacheffe", origin: "Ethiopia", roast: "light", price: 3.5 }`
- Bean: `{ id: "b2", name: "Colombian Supremo", origin: "Colombia", roast: "medium", price: 2.8 }`
- Brew: `{ id: "br1", beanId: "b1", method: "pour-over", date: "2025-10-01", rating: 5, notes: "Floral and bright" }`
- Brew: `{ id: "br2", beanId: "b2", method: "espresso", date: "2025-10-03", rating: 4, notes: "Rich and bold" }`
- Brew: `{ id: "br3", beanId: "b1", method: "pour-over", date: "2025-10-05", rating: 4, notes: "Slightly under-extracted" }`

## Behaviors

- Average rating = sum of ratings / count of brews (rounded to 1 decimal place).
- Adding a brew requires beanId, method, date, rating (1-5).
- Adding a bean requires name, origin (non-empty), roast.
- Deleting a bean removes all brews that use that bean.
- Stats: brews per method = count for each method used. Average per bean = round to 1 decimal.
- NavBar: Home, Log, Beans, Stats. Active route `data-active="true"`.

## API Routes

`/api/brews` — GET all brews; POST create `{ beanId, method, date, rating, notes }`; DELETE `?id=`.

## Data-testids

- `nav-home`, `nav-log`, `nav-beans`, `nav-stats`
- `dashboard-brew-count`, `dashboard-bean-count`, `dashboard-avg-rating`
- `brew-list`, `brew-item`, `brew-add-form`, `brew-bean-select`, `brew-method-select`, `brew-date-input`, `brew-rating-input`, `brew-notes-input`, `brew-submit`, `brew-delete`
- `bean-list`, `bean-item`, `bean-add-form`, `bean-name-input`, `bean-origin-input`, `bean-roast-select`, `bean-price-input`, `bean-submit`, `bean-delete`
- `stats-methods-list`, `stats-method-item`, `stats-bean-ratings-list`, `stats-bean-rating-item`, `stats-week-count`
