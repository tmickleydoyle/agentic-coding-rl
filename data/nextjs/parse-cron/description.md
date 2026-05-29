# parse-cron

Implement a 5-field cron matcher in `lib/cron.ts`.

## Exported signatures

```ts
export function matches(cronExpr: string, date: Date): boolean;
export function describe(cronExpr: string): string;
```

## Cron fields

The expression has exactly 5 whitespace-separated fields, in order:

1. minute — `0-59`
2. hour — `0-23`
3. day of month — `1-31`
4. month — `1-12`
5. day of week — `0-6` (0 = Sunday)

`matches` uses the **local** date/time components of the `Date`:
`getMinutes()`, `getHours()`, `getDate()`, `getMonth()+1`, `getDay()`.

Each field supports:

- `*` — every value in the field's range.
- `n` — a single value.
- `a-b` — an inclusive range.
- `a,b,c` — a list (each element may itself be `n` or `a-b` or step form).
- `*/step` — every `step`-th value across the whole range starting at the min.
- `a-b/step` — every `step`-th value within `a..b` starting at `a`.

A `Date` matches when **every** field matches its corresponding component.

### Day-of-month vs day-of-week

If BOTH dom and dow are restricted (neither is `*`), the date matches when
EITHER the dom OR the dow matches (standard Vixie cron behavior). If one is `*`,
only the other constrains. (When both are `*`, both match trivially.)

## Errors

Throw an `Error` when the expression does not have exactly 5 fields, or when a
field has a value outside its range, or is otherwise malformed.

## describe

Return any human-readable, deterministic string describing the expression
(e.g. `"At minute 0 past hour 12"` for `0 12 * * *`). It only needs to be
stable for the tested inputs; the exact wording for the test below is:

- `describe('* * * * *')` → `"Every minute"`.
