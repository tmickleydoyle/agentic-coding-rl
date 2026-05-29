# Fix: Stopwatch ticks double-speed after Start is clicked twice

`components/Stopwatch.tsx` is a stopwatch. It shows the elapsed tick count in
`data-testid="elapsed"` and has Start (`data-testid="start"`), Stop
(`data-testid="stop"`), and Reset (`data-testid="reset"`) buttons. While running, a
`setInterval` fires every 1000ms and increments the elapsed count by 1.

**Bug:** Clicking Start while the stopwatch is already running creates a SECOND interval,
so the count then increases by 2 every second (and the extra interval is never cleared,
leaking). Start should be a no-op when already running — there must be at most one active
interval. Stop pauses ticking, and Reset sets the count back to 0.

Find and fix the bug so that no matter how many times Start is clicked, elapsed
increments by exactly 1 per second. Make sure the interval is cleared on Stop and on
unmount. Keep the same `data-testid` attributes. Default export.
