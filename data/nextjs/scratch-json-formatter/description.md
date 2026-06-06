# JSON Formatter

Build a single-page JSON formatter and validator app.

## Layout

- A heading "JSON Formatter"
- A textarea labeled "Input JSON" (aria-label="Input JSON") where users paste raw JSON
- A row of action buttons:
  - "Format" button — pretty-prints the JSON with 2-space indentation
  - "Minify" button — compresses JSON to a single line
  - "Clear" button — clears both input and output
- A status indicator (data-testid="status") showing one of:
  - "Valid JSON" (when the input is valid)
  - "Invalid JSON" (when the input is not valid JSON)
  - "" (empty, initial state when input is empty)
- An output textarea (aria-label="Output JSON", readOnly) showing the formatted or minified result
- A "Copy Output" button that copies the output textarea content to the clipboard (navigator.clipboard.writeText). Show a "Copied!" indicator (data-testid="copy-indicator") briefly after copying. The indicator disappears when the input changes.
- An indentation selector labeled "Indent" (aria-label="Indent") — a select with options: "2 spaces", "4 spaces", "Tab". Default: "2 spaces". This affects the Format button only.

## Seed State

- Input: `{"name":"Alice","age":30,"hobbies":["reading","coding"]}`
- Output: "" (empty, user must click Format/Minify)
- Status: "Valid JSON" (validate on input change)
- Indent: "2 spaces"

## Behaviors

- The status indicator updates live as the user types in the input textarea.
- If the input textarea is empty, status is empty string.
- Clicking "Format" parses the JSON and re-renders it with JSON.stringify(parsed, null, indent) where indent is 2, 4, or "\t" based on the selector. On invalid JSON, set status to "Invalid JSON" and do not change output.
- Clicking "Minify" parses the JSON and renders JSON.stringify(parsed) with no extra spacing. On invalid JSON, set status to "Invalid JSON" and do not change output.
- Clicking "Clear" sets input to "" and output to "" and status to "".
- "Copy Output" only works if output is non-empty.
- Changing the input clears the copy-indicator.

## Key Data-testids

- data-testid="status"
- data-testid="copy-indicator"
