# algo-run-length-encode

Implement run-length encoding (RLE) and decoding for strings.

## Functions to export

### `encode(s: string): string`
Compress `s` using run-length encoding.
- Consecutive identical characters are replaced by `<count><char>`.
- If a run has length 1, omit the count (just the character).
- Example: `"aaabbc"` → `"3a2bc"`, `"abc"` → `"abc"`.
- Empty string returns `""`.

### `decode(s: string): string`
Expand a run-length encoded string back to the original.
- A digit sequence followed by a character means that character repeated that many times.
- A character not preceded by digits means 1 repetition.
- Example: `"3a2bc"` → `"aaabbc"`, `"abc"` → `"abc"`.
- Empty string returns `""`.

### `encodePairs(s: string): Array<[number, string]>`
Return the run-length encoding as an array of `[count, char]` tuples.
- Example: `"aaabbc"` → `[[3, "a"], [2, "b"], [1, "c"]]`.
- Empty string returns `[]`.

## Edge cases
- Single character string: `"a"` → `"a"` / `[[1, "a"]]`.
- All same characters: `"aaaa"` → `"4a"`.
- Already alternating: `"abab"` → `"abab"`.
- Multi-digit counts: `"aaaaaaaaaa"` (10 a's) → `"10a"`.
- `decode(encode(s)) === s` must hold for any input string.
