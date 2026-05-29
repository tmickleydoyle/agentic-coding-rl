# Fix: Counter increments by the wrong amount

`components/Counter.tsx` is a small counter widget with a "+" button
(`data-testid="inc"`), a "-" button (`data-testid="dec"`), and a value display
(`data-testid="value"`). The count starts at 0 and should never go below 0.

**Bug:** Clicking "+" once jumps the value by 2 instead of 1. It should increase by
exactly 1 per click. The "-" button should decrease by 1 but never drop below 0.

Find and fix the bug so the counter steps by 1 in each direction and clamps at 0.
Keep the same `data-testid` attributes. Default export.
