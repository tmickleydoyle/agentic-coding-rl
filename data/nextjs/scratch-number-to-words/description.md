# Number to Words

A single-page app that converts integers to their English word representation.

## Supported Range
- Integers from 0 to 999,999 (inclusive)
- Negative numbers: prepend "negative " before the word form of the absolute value
- Non-integers and values outside range show an error

## Conversion Rules

### Ones (0–19)
```
0→"zero", 1→"one", 2→"two", 3→"three", 4→"four", 5→"five",
6→"six", 7→"seven", 8→"eight", 9→"nine", 10→"ten",
11→"eleven", 12→"twelve", 13→"thirteen", 14→"fourteen",
15→"fifteen", 16→"sixteen", 17→"seventeen", 18→"eighteen", 19→"nineteen"
```

### Tens (20–90)
```
20→"twenty", 30→"thirty", 40→"forty", 50→"fifty",
60→"sixty", 70→"seventy", 80→"eighty", 90→"ninety"
```

### Compound tens (e.g. 21–99, excluding multiples of 10)
- Format: "twenty-one", "thirty-five", etc. (hyphenated)

### Hundreds (100–999)
- Format: "one hundred", "one hundred one", "one hundred twenty-three"
- No "and" between hundreds and the rest

### Thousands (1000–999999)
- Format: "one thousand", "one thousand one", "two hundred thousand", "one hundred twenty-three thousand four hundred fifty-six"
- Thousands part uses the same hundreds/tens/ones logic

## UI Elements

- Heading: "Number to Words"
- An `<input>` with `aria-label="Enter a number"` (type="number")
- A button "Convert"
- `<p data-testid="result">` showing the word form, initially empty
- `<p data-testid="error">` showing error messages, initially empty

## Behavior

- User types a number and clicks "Convert"
- If input is empty: show error "Please enter a number"
- If input is not an integer (has decimal point): show error "Please enter a whole number"
- If input is out of range (< -999999 or > 999999): show error "Number out of range (−999,999 to 999,999)"
- Otherwise: show the word form in result, clear error

## Examples
- 0 → "zero"
- 15 → "fifteen"
- 42 → "forty-two"
- 100 → "one hundred"
- 215 → "two hundred fifteen"
- 1000 → "one thousand"
- 12345 → "twelve thousand three hundred forty-five"
- 999999 → "nine hundred ninety-nine thousand nine hundred ninety-nine"
- -5 → "negative five"
- -100 → "negative one hundred"
