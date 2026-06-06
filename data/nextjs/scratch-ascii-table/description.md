# ASCII Table Browser

Build an interactive ASCII character reference table covering decimal values 32–126 (printable ASCII).

## Data

Codes 32–126. For each code:
- **Dec**: the decimal integer (32, 33, … 126)
- **Hex**: two-digit uppercase hex (e.g. 20, 21, … 7E)
- **Char**: the character (String.fromCharCode(dec))
  - For code 32 (space), display as "(space)" instead of a blank
- **Description**: use a hardcoded lookup for the special characters:
  - 32: "Space", 33: "Exclamation mark", 34: "Double quote", 35: "Hash", 36: "Dollar sign",
    37: "Percent", 38: "Ampersand", 39: "Single quote", 40: "Left parenthesis",
    41: "Right parenthesis", 42: "Asterisk", 43: "Plus", 44: "Comma", 45: "Hyphen",
    46: "Period", 47: "Slash", 48-57: "Digit 0"–"Digit 9",
    58: "Colon", 59: "Semicolon", 60: "Less than", 61: "Equals", 62: "Greater than",
    63: "Question mark", 64: "At sign",
    65-90: "Letter A"–"Letter Z",
    91: "Left bracket", 92: "Backslash", 93: "Right bracket", 94: "Caret",
    95: "Underscore", 96: "Backtick",
    97-122: "Letter a"–"Letter z",
    123: "Left brace", 124: "Pipe", 125: "Right brace", 126: "Tilde"

## Layout

- Page heading: "ASCII Table"
- Search input (label "Search") — filters rows by dec, hex, char, or description (case-insensitive substring)
- A table with columns: Dec | Hex | Char | Description
  - Each row has data-testid="ascii-row" 
  - Dec cell: data-testid="dec-[code]" (e.g. data-testid="dec-65")
  - Char cell: data-testid="char-[code]"
  - Hex cell: data-testid="hex-[code]"
- Result count: "Showing N characters" with data-testid="result-count"
- A "selected detail" panel (shown when a row is clicked):
  - Click any row to select it
  - Show: data-testid="detail-dec", data-testid="detail-hex", data-testid="detail-char", data-testid="detail-desc"
  - Show nothing (or empty panel) when no row is selected

## Behaviors

- On load: all 95 characters shown (32-126 inclusive)
- Typing in the search box filters the table in real time
- Clicking a row highlights it as selected and populates the detail panel
- Clicking the same row again does not deselect (selection stays)
- The result count updates with filtering

## Edge Cases

- Search "65" matches dec 65 (A), and any desc/hex containing "65"
- Search is case-insensitive: "letter a" matches all 26 lowercase letter descriptions
- Space character (32) shows "(space)" in the Char column
