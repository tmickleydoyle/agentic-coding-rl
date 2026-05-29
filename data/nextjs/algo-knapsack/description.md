# 0/1 knapsack + coin change

Implement two classic DP routines in `lib/knapsack.ts`.

```ts
export type Item = { weight: number; value: number };

export function knapsack(
  items: Item[],
  capacity: number,
): { value: number; chosen: number[] };

export function coinChange(coins: number[], amount: number): number;
```

`knapsack(items, capacity)` solves the **0/1 knapsack**: choose a subset of items whose
total weight is `<= capacity`, maximizing total value (each item used at most once).

- Returns `{ value, chosen }` where `value` is the maximum total value and `chosen` is
  the list of **selected item indices** (into the original `items` array), in
  ascending order.
- All weights and values are non-negative integers; `capacity` is a non-negative
  integer.
- `capacity === 0` (or no item fitting) yields `{ value: 0, chosen: [] }`.
- The reconstructed `chosen` indices must have total weight `<= capacity` and total
  value exactly equal to `value`.
- When ties exist, any valid optimal subset is acceptable as long as `value` is maximal
  and `chosen` is consistent with it (ascending, valid weight, summing to `value`).

`coinChange(coins, amount)` returns the **minimum number of coins** (unlimited supply
of each denomination) that sum to exactly `amount`, or `-1` if it cannot be made.

- `amount === 0` returns `0`.
- Denominations are positive integers; an empty `coins` array makes any
  `amount > 0` impossible (`-1`).

Export `knapsack`, `coinChange`, and the `Item` type as named exports.
