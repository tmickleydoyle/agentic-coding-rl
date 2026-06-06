# Prime Sieve

Build a Sieve of Eratosthenes visualizer that shows primes up to a user-defined limit.

## Algorithm
Implement the Sieve of Eratosthenes:
1. Start with all integers from 2 to N marked as potential primes.
2. For each prime P starting at 2: mark all multiples of P (starting at P*P or 2*P) as composite.
3. Remaining unmarked numbers are prime.

## Seed Data
Default limit: 50. On initial render, compute and display primes up to 50.

## UI Layout

### Controls
- A labeled number input (label: "Upper Limit") with min=2, max=1000. Default: 50.
- A "Run Sieve" button. On click: run the sieve for the current limit.

### Grid Display
- Display a grid of number cells from 2 up to the current limit (inclusive).
- Each cell shows the number and has data-testid="number-cell".
- Prime cells additionally have data-testid="prime-cell".
- Composite (non-prime) cells additionally have data-testid="composite-cell".
- Cell 1 is not shown (sieve starts at 2).

### Statistics
- Show total count of primes found in data-testid="prime-count".
- Show the largest prime found (or "—" if none) in data-testid="largest-prime".
- Show the sum of all primes in data-testid="prime-sum".

### History
- Each "Run Sieve" invocation appends an entry to a history list with data-testid="history-entry".
- Each entry shows the limit used and the prime count found.
- A "Clear History" button removes all history entries.

## Behavior Details
- On initial render, run the sieve for default limit 50 automatically (no button press required).
- Changing the limit input and clicking Run Sieve updates the grid and stats.
- Statistics update immediately on each sieve run.
- Primes up to 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 (15 primes, sum=328, largest=47).

## Edge Cases
- Limit of 2: one prime (2 itself).
- The number 2 is always prime.
- The number 4 is always composite.
