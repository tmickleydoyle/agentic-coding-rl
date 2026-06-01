# Build a URL Shortener

Build a single-page React application that lets users shorten URLs, view a list of shortened links, copy them, and track how many times each has been "visited" (clicked).

## Layout and controls

- A heading **URL Shortener** at the top.
- A text input labelled **Long URL** where the user types the original URL.
- A **Shorten** button that validates and creates the short link.
- A table (or list) below showing all shortened entries with the columns: **Short Link**, **Original URL**, **Clicks**, and **Actions**.

## Behaviour

### Validation
- If the input is blank or contains only whitespace, clicking **Shorten** must do nothing.
- If the input does not start with `http://` or `https://`, display the error message **Invalid URL: must start with http:// or https://** below the input. The entry must NOT be added to the list.
- A valid URL clears any existing error and adds a new row. The input clears after a successful submission.

### Short link generation
Generate sequential short codes: `short-1`, `short-2`, `short-3`, … (the first URL gets `short-1`, the second `short-2`, etc.). Display the short code as plain text in the **Short Link** column.

### Clicks counter
- Every row has a **Visit** button in the **Actions** column. Each click of **Visit** increments that row's **Clicks** count by 1.
- Clicks start at `0` and are shown as plain integers (e.g. `0`, `1`, `3`).

### Copy action
- Every row also has a **Copy** button in the **Actions** column.
- Clicking **Copy** changes the button text to **Copied!** for that row only. It does NOT affect other rows' Copy buttons.
- Clicking **Copy** again (when it already shows **Copied!**) or on a different row's **Copy** has no special interaction — each row's state is independent.

## Data integrity
- Each row is independent: visiting or copying one row must not affect other rows.
- State is in memory only; no backend or persistence needed.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
