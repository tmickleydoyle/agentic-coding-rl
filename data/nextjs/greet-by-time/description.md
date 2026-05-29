# Greet by hour

Implement a component `GreetByTime` in `components/GreetByTime.tsx`:

- Accepts a prop `hour: number` (0-23).
- Renders `<span data-testid="greeting">` with one of:
  - `"Good morning"` when `hour` is in `[5, 11]` inclusive
  - `"Good afternoon"` when `hour` is in `[12, 16]` inclusive
  - `"Good evening"` when `hour` is in `[17, 21]` inclusive
  - `"Good night"` otherwise (0-4 or 22-23)

Default export. No state needed.
