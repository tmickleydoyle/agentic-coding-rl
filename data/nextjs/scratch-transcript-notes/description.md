# Transcript Notes

A single-page app for annotating podcast transcript excerpts with tags and commentary.

## Seed Data

Start with the following annotations pre-loaded:

| id | show | speaker | quote | tag | commentary |
|----|------|---------|-------|-----|------------|
| 1 | "Hidden Brain" | "Shankar Vedantam" | "We are often blind to our own biases" | "psychology" | "Key insight about self-awareness" |
| 2 | "Freakonomics" | "Stephen Dubner" | "Incentives are the cornerstone of modern life" | "economics" | "Classic Freakonomics thesis" |
| 3 | "On Being" | "Krista Tippett" | "Beauty is a teacher" | "philosophy" | "Poetic and memorable" |

## Fields

Each annotation has:
- **id**: unique number
- **show**: podcast show name (string)
- **speaker**: name of the speaker (string)
- **quote**: the transcript excerpt (string)
- **tag**: a single category tag (string, e.g. "psychology", "economics")
- **commentary**: user's own notes on the quote (string)

## UI Layout

- Heading: "Transcript Notes"
- A form with labeled inputs: "Show", "Speaker", "Quote", "Tag", "Commentary"
- An "Add Annotation" button
- A tag filter: a dropdown `<select>` labeled "Filter by Tag" with "All" plus each unique tag present; filters the visible cards
- A list of annotation cards, each showing all fields
- Each card has an "Edit" button that puts the card in edit mode (inline editing of commentary only), and a "Save" button to confirm, and a "Delete" button
- A summary `data-testid="annotation-count"` showing "X annotations"

## Behaviors

1. **Add annotation**: fill all fields, click "Add Annotation" — card appears, form clears. New tag is added to filter dropdown if not present.
2. **Validation**: if any field is empty (after trimming), show error "All fields are required" with `data-testid="error-message"`. Do not add.
3. **Filter by tag**: selecting a tag from the dropdown shows only cards with that tag; "All" shows all.
4. **Edit commentary**: click "Edit" on a card — commentary field becomes an `<input>` or `<textarea>`. Click "Save" to persist the change.
5. **Delete**: removes the annotation and updates count.
6. **Count**: `data-testid="annotation-count"` always shows total annotations (not filtered).

## data-testid Attributes

- `data-testid="annotation-card"` on each card
- `data-testid="annotation-show"` for the show name
- `data-testid="annotation-speaker"` for the speaker
- `data-testid="annotation-quote"` for the quote text
- `data-testid="annotation-tag"` for the tag
- `data-testid="annotation-commentary"` for the commentary display (when not editing)
- `data-testid="commentary-input"` for the input when editing
- `data-testid="annotation-count"` for total count
- `data-testid="tag-filter"` for the filter dropdown
- `data-testid="error-message"` for validation error

## Edge Cases

- Whitespace-only fields count as empty.
- Adding an annotation with a tag already in the dropdown does not duplicate the option.
- Saving an empty commentary is allowed (edge case: user may clear it).
- The count reflects total annotations regardless of current filter.
