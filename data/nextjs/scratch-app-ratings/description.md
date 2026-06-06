# App Ratings

A single-page app to rate and review software applications.

## Seed Data (5 apps)

| Name | Category | Rating | Review | Date Added |
|------|----------|--------|--------|------------|
| VS Code | Editor | 5 | Best editor ever, extensions are great | 2024-01-05 |
| Slack | Communication | 3 | Good but gets noisy with large teams | 2024-01-08 |
| Figma | Design | 5 | Incredible for collaborative design | 2024-01-10 |
| Jira | Project Management | 2 | Overcomplicated for small teams | 2024-01-12 |
| Notion | Productivity | 4 | Flexible but has a learning curve | 2024-01-15 |

## Fields

Each app entry has:
- `id`: unique number
- `name`: string
- `category`: string
- `rating`: number (1-5)
- `review`: string
- `dateAdded`: string (YYYY-MM-DD)

## UI Layout

- Page heading: "App Ratings"
- Average rating summary in element with data-testid="average-rating" showing one decimal place (e.g., "3.8")
- Total apps count in element with data-testid="total-apps"
- Sort controls: buttons "Sort by Rating" and "Sort by Name" — data-testid="sort-rating" and data-testid="sort-name"
- Category filter: a select with data-testid="filter-category" populated with all unique categories plus "All" as default
- App list: each item in a div with data-testid="app-item"
  - Shows name, category, rating as "X/5" in data-testid="app-rating", review text, date added
- Add App form:
  - Text input, label "App Name", data-testid="input-name"
  - Text input, label "Category", data-testid="input-category"
  - Number input (1-5), label "Rating", data-testid="input-rating"
  - Textarea, label "Review", data-testid="input-review"
  - Submit button: "Add App"
- Each app item has a "Remove" button with data-testid="remove-app-btn"

## Behaviors

- "Sort by Rating" sorts descending (highest first); "Sort by Name" sorts alphabetically A-Z
- Category filter narrows displayed apps to matching category (or all if "All")
- Sorting and filtering can be combined (filter first, then sort applies to filtered result)
- Average rating is computed over ALL apps in the dataset, not just filtered view
- Adding an app appends it to the list and clears the form
- Removing deletes the app from the dataset
- If no apps match filter, show div with data-testid="empty-message"

## Edge Cases

- App name must be non-empty to submit; rating must be between 1 and 5
- Average rating always shows one decimal place even when a whole number (e.g., "4.0")
- Category filter options update when new apps are added (no duplicate categories)
- Default sort order is by dateAdded ascending (as entered)
