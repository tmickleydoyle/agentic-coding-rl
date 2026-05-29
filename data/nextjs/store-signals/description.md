# Fine-grained reactive signals

Implement a small fine-grained reactivity system in `lib/signals.ts`, similar to
the primitives used by modern reactive UI libraries.

```ts
export interface Signal<T> {
  get(): T;
  set(value: T): void;
}
export interface Computed<T> {
  get(): T;
}

export function signal<T>(initial: T): Signal<T>;
export function computed<T>(fn: () => T): Computed<T>;
export function effect(fn: () => void): () => void; // returns a dispose function
```

Behavior:

- `signal(initial)` holds a value. `get()` returns it AND, when called inside a
  computed or effect, records that consumer as a dependent. `set(value)` updates
  the value; if the value is unchanged (`Object.is`) it is a no-op (no
  recomputation/re-run). Otherwise all dependents are invalidated.
- `effect(fn)` runs `fn` immediately, tracking every signal/computed read during
  that run as a dependency. Whenever any dependency changes, the effect re-runs.
  Dependencies are recomputed on each run (so conditionally-read signals only keep
  the effect subscribed while actually read). `effect` returns a **dispose**
  function; after disposal the effect never runs again.
- `computed(fn)` is a derived, memoized value. `get()` returns the cached result,
  recomputing lazily only when one of its dependencies has changed since the last
  computation. Reading a computed inside an effect/another computed registers the
  computed as a dependency, and the computed propagates invalidation to its own
  dependents.
- **Glitch-free diamonds**: if `a` feeds `b` and `c`, and `d = b + c` reads both,
  then updating `a` must result in `d` re-evaluating with consistent, up-to-date
  values (no doubled or stale intermediate fires). An effect reading `d` should
  observe each `a` change, and `d.get()` must never return a stale value.

Track dependencies via a global "current consumer" read stack.
