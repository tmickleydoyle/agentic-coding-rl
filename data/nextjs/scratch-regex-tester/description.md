# Regex Tester

Build a single-page regex tester app where users can write a regular expression and test it against a block of text, seeing matches highlighted.

## Layout

- A heading "Regex Tester"
- A text input labeled "Pattern" (aria-label="Pattern") for the regex pattern string (without delimiters)
- A row of flag checkboxes:
  - "Global (g)" (aria-label="Global (g)"), default checked
  - "Case Insensitive (i)" (aria-label="Case Insensitive (i)"), default unchecked
  - "Multiline (m)" (aria-label="Multiline (m)"), default unchecked
- A textarea labeled "Test String" (aria-label="Test String") for the input text
- A "Test" button that runs the regex against the test string
- A match count display (data-testid="match-count") showing "X match(es)" or "No matches" or "Invalid regex" if the pattern is malformed
- A result area (data-testid="result-area") showing the test string with matches wrapped in `<mark>` tags (data-testid="match-highlight" on each mark). If no pattern or no matches, show the plain text.
- A matches list below (data-testid="match-item" on each entry) showing each matched string value, one per line. If global flag is off, only the first match is shown.

## Seed Data

- Pattern: `\d+`
- Flags: global=true, caseInsensitive=false, multiline=false
- Test String: `"Order 123 was placed on 2024-01-15 for $456.78"`
- Run the test automatically on initial render so matches are visible.

## Behavior

- Clicking "Test" parses the pattern with the selected flags into a RegExp, runs it on the test string, and updates match-count, result-area, and match-item list.
- If the pattern field is empty, show "No matches" and plain text.
- If the regex is invalid (throws on `new RegExp(...)`), show "Invalid regex" in match-count and plain text in result-area.
- The result-area renders HTML (use dangerouslySetInnerHTML) where each match is wrapped in `<mark data-testid="match-highlight">matched text</mark>`.
- With global flag, all non-overlapping matches are highlighted. Without global flag, only the first match is highlighted.
- Changing the pattern or flags does NOT automatically re-run; user must click "Test".

## Match Highlighting Logic

1. Build the RegExp from pattern + flags string.
2. Find all matches (respecting global flag).
3. Reconstruct the string by replacing match spans with `<mark data-testid="match-highlight">...</mark>` — escape HTML special characters in non-match segments (`&`, `<`, `>`, `"`) before inserting.
4. Set dangerouslySetInnerHTML to this constructed HTML string.
