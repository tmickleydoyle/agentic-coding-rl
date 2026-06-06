# Anniversary Log

Build a single-page anniversary log application in React.

## Seed Data

Start with these 4 anniversaries pre-loaded:

```
id: 1, title: "Wedding Anniversary", originalDate: "2018-09-14", category: "relationship", notes: "Married in the botanical garden"
id: 2, title: "Work Start Date", originalDate: "2020-03-01", category: "career", notes: "First day at current company"
id: 3, title: "Moved to City", originalDate: "2019-06-20", category: "personal", notes: "Big move from the suburbs"
id: 4, title: "Dog's Birthday", originalDate: "2021-11-05", category: "personal", notes: "Biscuit's first birthday was epic"
```

## Fields

Each anniversary has:
- `id` (number, auto-increment)
- `title` (string, required)
- `originalDate` (string, YYYY-MM-DD format, required — the original event date)
- `category` (string, one of: "relationship", "career", "personal", "health", "other")
- `notes` (string, optional)

## Computed Display (use fixed "today" = 2024-12-01 for deterministic tests)

- **Years elapsed**: How many full years since originalDate as of today (2024-12-01).
- **Next anniversary date**: The next upcoming occurrence of the month/day in the future relative to today.
- **Days until next**: Number of days from today (2024-12-01) to the next anniversary date.

## UI Layout

- Page heading: "Anniversary Log"
- List of anniversary cards
- Each card shows: title, originalDate, category badge, notes, years elapsed, days until next anniversary
- An "Add Anniversary" form
- Category filter dropdown

## Behaviors

1. **Display**: All seed anniversaries shown on load. Each card has `data-testid="anniversary-card"`.
2. **Years elapsed**: `data-testid="years-elapsed"` shows "X years" where X is full years since originalDate as of 2024-12-01.
3. **Days until**: `data-testid="days-until"` shows "X days" until next anniversary. If today IS the anniversary, show "Today!".
4. **Add Anniversary**: Form with labeled inputs. "Add Anniversary" adds and clears form.
5. **Validation**: If title or originalDate is empty, show `data-testid="form-error"` with "Title and date are required". Do not add.
6. **Category badge**: `data-testid="category-badge"` on each card.
7. **Filter**: `<select>` with `data-testid="category-filter"`. Default "All Categories" shows all.
8. **Count**: `data-testid="anniversary-count"` shows "X anniversaries".
9. **Delete**: Each card has "Delete" button with `data-testid="delete-btn"`.
10. **Empty state**: `data-testid="empty-state"` with "No anniversaries found".

## Edge Cases

- Use TODAY constant = "2024-12-01" (hardcoded) for all date calculations so tests are deterministic.
- If the anniversary already passed this year, next occurrence is next year.
- If it hasn't occurred yet this year, next occurrence is this year.
- Filtering updates count accordingly.
