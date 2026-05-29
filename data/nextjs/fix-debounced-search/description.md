# Fix: useDebounce fires on every keystroke instead of debouncing

`hooks/useDebounce.ts` exports `useDebounce<T>(value: T, delay: number): T`. It is meant
to return a value that only updates `delay` ms after `value` STOPS changing — if the
value keeps changing faster than `delay`, the debounced value should not update until
there is a quiet gap.

`components/DebouncedSearch.tsx` uses it: an input (`data-testid="query"`) drives the
live value, the debounced value is shown in `data-testid="debounced"`, and a counter
`data-testid="commits"` counts how many times the debounced value has actually changed
from its initial empty string.

**Bug:** `useDebounce` schedules a timeout on every change but never clears the previous
pending timeout. So after typing several characters quickly and waiting, the debounced
value updates multiple times (once per keystroke, each firing late) instead of settling
exactly once. The previous timer must be cleared whenever `value` changes (and on
unmount).

Fix `hooks/useDebounce.ts` so rapid changes collapse into a single debounced update.
Keep the same `data-testid` attributes and the hook signature. Default export for the
component; named export `useDebounce` for the hook.
