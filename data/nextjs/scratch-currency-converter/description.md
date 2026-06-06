# Currency Converter

Build a single-page currency converter with fixed exchange rates and a conversion history log.

## Fixed Exchange Rates (relative to USD)

| Currency | Code | Rate (1 USD =) |
|----------|------|----------------|
| US Dollar | USD | 1.00 |
| Euro | EUR | 0.92 |
| British Pound | GBP | 0.79 |
| Japanese Yen | JPY | 149.50 |
| Canadian Dollar | CAD | 1.36 |
| Australian Dollar | AUD | 1.53 |

## UI Layout

- Page heading: "Currency Converter"
- Converter form with:
  - Amount input (number, labeled "Amount")
  - "From" currency select (all 6 currencies)
  - "To" currency select (all 6 currencies)
  - "Convert" button
  - Result display showing: "X.XX CCC = Y.YY DDD" where CCC/DDD are currency codes
- Conversion History section:
  - Heading "Conversion History"
  - List of past conversions (most recent first)
  - Each entry: "{amount} {fromCode} = {result} {toCode}" with a timestamp "HH:MM"
  - "Clear History" button

## Seed Data

Pre-load 2 history entries (use static timestamps, e.g. "09:30" and "10:15"):

```
100.00 USD = 92.00 EUR  [09:30]
50.00 GBP = 7475.00 JPY  [10:15]
```

## Behaviors

### Conversion
- Convert: result = amount * (toRate / fromRate) where rate is the USD-relative rate.
- Round result to 2 decimal places.
- If amount <= 0 or NaN, do nothing.
- Update the result display immediately on "Convert" click.
- Append to history (newest first) with current time formatted as "HH:MM" (use `new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })`).

### Same Currency
- Converting USD to USD (same code): result = same amount, still log to history.

### Clear History
- Empties the history list.

### Default selections
- "From" defaults to USD, "To" defaults to EUR.

## data-testid attributes
- Amount input: `data-testid="amount-input"`
- From select: `data-testid="from-select"`
- To select: `data-testid="to-select"`
- Convert button: `data-testid="convert-btn"`
- Result display: `data-testid="result-display"`
- History list container: `data-testid="history-list"`
- Each history entry: `data-testid="history-entry-{index}"` (0-based, 0 = most recent)
- Clear history button: `data-testid="clear-history-btn"`

## Edge Cases
- Amount of 0 or negative: do nothing (no conversion, no history entry).
- Same from/to currency: still compute and log.
- After clear, history-list should be empty.
