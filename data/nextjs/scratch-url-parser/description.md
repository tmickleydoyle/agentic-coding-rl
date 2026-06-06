# URL Parser

Build a single-page React app that parses a URL typed by the user and displays each component.

## Seed Data

Pre-fill the input with: `https://user:pass@example.com:8080/path/to/page?foo=bar&baz=qux#section2`

## Layout

- Heading: "URL Parser"
- A text input labelled "URL" for entering the URL
- A "Parse" button that triggers parsing
- A results section showing parsed components (see below)
- A "Clear" button that resets the input and hides results

## Parsed Components to Display

Use the browser `URL` constructor to parse. Display each field in a `<dl>` or table. Each row must have a `data-testid` for the value cell:

| Field        | data-testid        | Value from URL object |
|--------------|--------------------|-----------------------|
| Protocol     | `parsed-protocol`  | `url.protocol` (e.g. `https:`) |
| Username     | `parsed-username`  | `url.username` |
| Password     | `parsed-password`  | `url.password` |
| Hostname     | `parsed-hostname`  | `url.hostname` |
| Port         | `parsed-port`      | `url.port` |
| Pathname     | `parsed-pathname`  | `url.pathname` |
| Search       | `parsed-search`    | `url.search` |
| Hash         | `parsed-hash`      | `url.hash` |

## Query Parameters

Below the main fields, show a section "Query Parameters". For each key-value pair in `url.searchParams`, render a row with `data-testid="param-row"`. Each row shows the key and value separated by `=`.

## Error Handling

If the URL is invalid (URL constructor throws), show an error message with `data-testid="parse-error"` saying "Invalid URL". The results section should not be shown when there is an error.

## Clear Behavior

Clicking "Clear" resets the input to empty string and hides the results section entirely (including any error message). The results section has `data-testid="results"`.

## Interactions

1. User types a URL in the input.
2. User clicks "Parse" — results appear.
3. User edits input and clicks "Parse" again — results update.
4. User clicks "Clear" — input is cleared, results disappear.
5. If user types an invalid URL and clicks "Parse", show the error message instead of results.
