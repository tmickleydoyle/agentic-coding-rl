# Fix: Celsius-to-Fahrenheit conversion is wrong

`components/TempConverter.tsx` converts a Celsius value to Fahrenheit. It has a number
input (`data-testid="celsius"`) and shows the result in `data-testid="fahrenheit"`,
rounded to one decimal place (e.g. `32.0`). The output should hold the empty string when
the input is empty or not a valid number.

**Bug:** The conversion formula is wrong. For 0 it shows `0.0` and for 100 it shows
`180.0`, but the correct Fahrenheit values are `32.0` and `212.0`. The formula must be
`F = C * 9/5 + 32`.

Find and fix the bug. Keep the same `data-testid` attributes and the one-decimal
rounding. Default export.
