# Show Tracker

A single-page app for tracking podcast shows you follow, including subscription status and episode counts.

## Seed Data

Start with the following shows pre-loaded:

| id | name | host | category | episodes | subscribed |
|----|------|------|----------|----------|------------|
| 1 | "Conan O'Brien Needs a Friend" | "Conan O'Brien" | "Comedy" | 210 | true |
| 2 | "Serial" | "Sarah Koenig" | "True Crime" | 42 | true |
| 3 | "Planet Money" | "Various" | "Economics" | 900 | false |

## Fields

Each show has:
- **id**: unique number
- **name**: show name (string)
- **host**: host name (string)
- **category**: category label (string)
- **episodes**: total episode count (number)
- **subscribed**: whether the user subscribes (boolean)

## UI Layout

- Heading: "Show Tracker"
- A form with labeled inputs: "Name", "Host", "Category", "Episodes"
- An "Add Show" button (new shows start unsubscribed)
- A list of show cards, each displaying all fields plus subscription status
- Each card has a "Subscribe" button when not subscribed, or "Unsubscribe" when subscribed
- Each card has a "Delete" button
- A summary showing total shows with `data-testid="show-count"` and subscribed count with `data-testid="subscribed-count"`

## Behaviors

1. **Add show**: fill all four fields, click "Add Show" — card appears, form clears.
2. **Validation**: if any field is empty or episodes is not a positive integer, show error "Invalid input" with `data-testid="error-message"`. Do not add.
3. **Subscribe/Unsubscribe**: toggle the subscribed state of a show.
4. **Delete**: remove the show from the list; update counts.
5. **Counts**: `data-testid="show-count"` shows "X shows"; `data-testid="subscribed-count"` shows "X subscribed".

## data-testid Attributes

- `data-testid="show-card"` on each card
- `data-testid="show-name"` for the show name
- `data-testid="show-host"` for the host
- `data-testid="show-category"` for the category
- `data-testid="show-episodes"` for the episode count
- `data-testid="show-subscribed"` for subscription status text ("subscribed" or "not subscribed")
- `data-testid="show-count"` for total count
- `data-testid="subscribed-count"` for subscribed count
- `data-testid="error-message"` for validation error

## Edge Cases

- Whitespace-only fields count as empty.
- Episodes must be a positive integer (greater than 0).
- Toggling subscription updates `subscribed-count` immediately.
