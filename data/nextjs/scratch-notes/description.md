# Build a markdown notes app

Build a single-page React application for keeping notes written in a small subset of Markdown.

What the app should do:

- **Create notes.** A form has a **Title** field, a **Body** field (a textarea), and a **Tags**
  field (comma-separated, e.g. `work, urgent`). Clicking **Add note** creates the note, clears
  the form, and makes the new note the selected one. Ignore a note whose title is blank.
- **Select & list.** The current notes are listed by title in a **Notes** region; each title is
  a button that selects that note. Deleting is done with a **Delete note** button, which removes
  the selected note.
- **Markdown preview.** A **Preview** region renders the selected note's body as HTML using these
  rules, applied per line:
  - A line starting with `# ` is a level-1 heading; `## ` is a level-2 heading.
  - Consecutive lines starting with `- ` form a bulleted list (one list item per line).
  - Anywhere in a line, text wrapped in double asterisks like `**important**` renders as bold.
  - Any other non-blank line is a paragraph. Blank lines separate blocks.
- **Search.** A **Search** field filters the notes list to those whose title or body contains the
  typed text (case-insensitive).
- **Tag filter.** A **Tags** region lists each distinct tag as a button plus an **All** button.
  Clicking a tag filters the list to notes carrying that tag; **All** clears the filter. Search
  and the tag filter apply together (a note must match both).

All state is in memory. Implement the root component as the default export of `app/page.tsx`.
Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
