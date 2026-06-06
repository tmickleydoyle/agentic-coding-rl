# Photo Edit Queue

A single-page app to manage a queue of photos awaiting post-processing.

## Seed Data

Start with these four queue items pre-loaded:

| id | filename          | editor  | status      | notes               |
|----|-------------------|---------|-------------|---------------------|
| 1  | DSC_0421.jpg      | Alice   | Pending     | Needs color grade   |
| 2  | DSC_0587.jpg      | Bob     | In Progress | Retouching face     |
| 3  | DSC_0612.jpg      | Alice   | Done        | Approved            |
| 4  | DSC_0789.jpg      | Carol   | Pending     | Crop and straighten |

## Fields

- **Filename** (text input, required)
- **Editor** (text input, required)
- **Status** (select: "Pending" | "In Progress" | "Done")
- **Notes** (textarea, optional)

## Behaviors

1. The page renders a heading "Edit Queue".
2. All seed items are shown in a list on load.
3. Each item shows filename, editor, status, and notes.
4. A form allows adding new items (status defaults to "Pending").
5. Submitting a valid form appends the item and clears filename, editor, and notes inputs.
6. Filename and editor are required and must not be empty/whitespace.
7. Each item has a Delete button to remove it from the queue.
8. Each item has a status select inline in the list row to change its status in place.
9. A counter shows "X items" where X is the total count.
10. Status counts are shown: "Pending: X | In Progress: X | Done: X".

## Edge Cases

- Changing an item's status inline immediately updates the status counts.
- Deleting the last item shows "0 items" and "Pending: 0 | In Progress: 0 | Done: 0".
- Notes may be left blank.
