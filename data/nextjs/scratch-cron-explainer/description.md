# Cron Explainer

Build a single-page React app that takes a 5-field cron expression and explains it in plain English, showing the breakdown of each field.

## Seed Data

Pre-fill the input with: `0 9 * * 1-5`

## Layout

- Heading: "Cron Explainer"
- A text input labelled "Cron Expression"
- An "Explain" button
- A "Reset" button that resets to the seed value and clears output
- A results section (shown only after clicking Explain) with:
  - A human-readable summary
  - A breakdown table of each field

## Cron Fields (5-field standard cron)

| Position | Field       | data-testid           |
|----------|-------------|-----------------------|
| 1        | Minute      | `field-minute`        |
| 2        | Hour        | `field-hour`          |
| 3        | Day of Month| `field-dom`           |
| 4        | Month       | `field-month`         |
| 5        | Day of Week | `field-dow`           |

Each field cell shows the raw token from the expression (e.g. `*`, `0`, `1-5`).

## Human-readable summary

Build a summary string using these rules (display in `data-testid="cron-summary"`):

- Minute `*` → "every minute" ; a number → "at minute <N>" ; `a-b` → "minutes <a> to <b>" ; `*/n` → "every <n> minutes"
- Hour `*` → "every hour" ; a number → "at hour <N>" ; `a-b` → "hours <a> to <b>" ; `*/n` → "every <n> hours"
- Day-of-month `*` → "every day" ; a number → "on day <N>" ; else → the raw token
- Month `*` → "every month" ; a number → "in month <N>" ; else → the raw token
- Day-of-week `*` → "every day of the week" ; a number → "on weekday <N>" ; `a-b` → "weekdays <a> to <b>" ; else → the raw token

Combine: "<minute-part>, <hour-part>, <dom-part>, <month-part>, <dow-part>"

Example: `0 9 * * 1-5` → "at minute 0, at hour 9, every day, every month, weekdays 1 to 5"

## Error Handling

A valid expression has exactly 5 whitespace-separated fields. If the input does not have exactly 5 fields, show an error with `data-testid="cron-error"` reading "Invalid cron expression (need 5 fields)". Do not show the breakdown table.

## Results visibility

The results section (`data-testid="results"`) is only rendered after the user clicks Explain. Reset hides it.
