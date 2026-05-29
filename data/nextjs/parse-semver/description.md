# parse-semver

Implement a small semantic-version library in `lib/semver.ts`.

## Exported signatures

```ts
export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[]; // dot-separated identifiers, e.g. ['alpha','1']; [] if none
}
export function parse(v: string): SemVer;
export function compare(a: string, b: string): -1 | 0 | 1;
export function satisfies(version: string, range: string): boolean;
```

## parse

- Accepts `MAJOR.MINOR.PATCH` with optional `-prerelease` (build metadata
  `+...` may be present and is ignored). A leading `v` is allowed (`v1.2.3`).
- Numeric parts must be non-negative integers with no leading zeros (except
  `0`). Throw an `Error` on malformed input (missing parts, non-numeric, etc.).
- `prerelease` is split on `.` into identifiers (`1.0.0-alpha.1` →
  `['alpha','1']`). No prerelease → `[]`.

## compare

Returns `-1`, `0`, or `1` per semver precedence:

- Compare major, then minor, then patch numerically.
- A version WITH a prerelease has LOWER precedence than the same version
  WITHOUT one: `1.0.0-alpha` < `1.0.0`.
- Compare prerelease identifiers left to right: numeric identifiers compare
  numerically; numeric < non-numeric; non-numeric compare lexically (ASCII).
  A longer set of identifiers (all prior equal) is greater. So
  `1.0.0-alpha` < `1.0.0-alpha.1` < `1.0.0-alpha.beta` < `1.0.0-beta` <
  `1.0.0-beta.2` < `1.0.0-beta.11`.

## satisfies

`range` is a single comparator or a space-separated AND of comparators. Each
comparator is one of:

- `=1.2.3` or bare `1.2.3` — exact.
- `>1.2.3`, `>=1.2.3`, `<1.2.3`, `<=1.2.3`.
- `^1.2.3` — compatible: `>=1.2.3 <2.0.0`. For `^0.2.3` it is
  `>=0.2.3 <0.3.0`; for `^0.0.3` it is `>=0.0.3 <0.0.4`.
- `~1.2.3` — `>=1.2.3 <1.3.0`. `~1.2` → `>=1.2.0 <1.3.0`.
- `x`/`X`/`*` wildcards in bare versions: `1.2.x` → `>=1.2.0 <1.3.0`,
  `1.x` → `>=1.0.0 <2.0.0`, `*` → any version.

A prerelease version only satisfies a comparator when that comparator's version
has the same `[major,minor,patch]` AND a prerelease (standard npm behavior).
For simplicity here: a version with a prerelease satisfies a range only if at
least one comparator in the range names the exact same `major.minor.patch`.
