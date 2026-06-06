# Photo Album

Build a single-page photo album application in React.

## Seed Data

Start with these 3 photos pre-loaded:

```
id: 1, title: "Beach Sunset", url: "https://picsum.photos/seed/beach/400/300", description: "Golden hour at the coast", date: "2024-06-15"
id: 2, title: "Mountain Hike", url: "https://picsum.photos/seed/mountain/400/300", description: "Summit view after a long climb", date: "2024-08-22"
id: 3, title: "City Lights", url: "https://picsum.photos/seed/city/400/300", description: "Downtown at night", date: "2024-11-10"
```

## Fields

Each photo has:
- `id` (number, auto-increment)
- `title` (string, required)
- `url` (string, required — image URL)
- `description` (string, optional)
- `date` (string, YYYY-MM-DD format, required)

## UI Layout

- Page heading: "Photo Album"
- A photo grid displaying all photos
- Each photo card shows: the image (`<img>`), title, date, description
- An "Add Photo" form below the grid with inputs for title, url, description, date
- A "Delete" button on each photo card

## Behaviors

1. **Display**: All seed photos are shown on load in a grid. Each card has `data-testid="photo-card"`.
2. **Add Photo**: Form has labeled inputs (Title, URL, Description, Date). Clicking "Add Photo" button appends the new photo to the grid. The form clears after submission.
3. **Validation**: If title or url is empty when submitting, show an error message with `data-testid="form-error"` saying "Title and URL are required". Do not add the photo.
4. **Delete**: Each photo card has a "Delete" button (`data-testid="delete-btn"`). Clicking it removes that photo from the grid.
5. **Photo count**: Display `data-testid="photo-count"` showing "X photos" where X is the current count.
6. **Empty state**: When no photos remain, show `data-testid="empty-state"` with text "No photos yet".

## Edge Cases

- Deleting the last photo shows the empty state.
- Adding a photo with a blank description is fine (optional field).
- The date input must be type="date".
- After a failed submission (validation error), the form inputs retain their values.
- After a successful submission, the error message (if any) clears.
