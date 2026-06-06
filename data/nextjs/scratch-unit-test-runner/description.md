# Unit Test Runner

A simulated unit test runner UI where users can view a list of predefined tests, run them, and see pass/fail results.

## Seed Data

```
const TEST_CASES = [
  { id: 1, name: 'adds two positive numbers', fn: () => 1 + 2 === 3 },
  { id: 2, name: 'subtracts numbers correctly', fn: () => 10 - 4 === 6 },
  { id: 3, name: 'multiplies correctly', fn: () => 3 * 4 === 12 },
  { id: 4, name: 'divides correctly', fn: () => 8 / 2 === 4 },
  { id: 5, name: 'handles zero addition', fn: () => 0 + 0 === 0 },
  { id: 6, name: 'always fails (intentional)', fn: () => 1 === 2 },
]
```

Note: test 6 always fails by design.

## UI Elements

- Heading: "Unit Test Runner"
- A button "Run All Tests"
- A list of test rows, each with `data-testid="test-row"`, showing:
  - The test name
  - A status indicator `data-testid="test-status"` showing: "pending" initially, "pass" or "fail" after running
- `<p data-testid="summary">` showing summary after running, e.g. "5 passed, 1 failed" — empty initially
- A button "Reset" (shown after tests have been run, hidden initially)
- Each test row also has `data-testid="test-name"` showing the test name text

## Behavior

### Running Tests
- User clicks "Run All Tests"
- Each test's `fn()` is called; if it returns true → status = "pass", if false → status = "fail"
- All tests run synchronously (no async delay needed)
- After running, show the summary: "X passed, Y failed"
- Show the "Reset" button, hide "Run All Tests" (or disable it — choose hiding)

### Individual Test Status
- Before running: each `data-testid="test-status"` shows "pending"
- After running: shows "pass" or "fail"

### Reset
- Clicking "Reset": all statuses revert to "pending", summary clears, "Run All Tests" reappears, "Reset" is hidden

## Edge Cases
- Summary is empty string before first run
- After reset, everything is back to initial state
- Tests 1-5 always pass, test 6 always fails, so summary is always "5 passed, 1 failed"
