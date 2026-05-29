# parse-glob

Implement a glob-to-RegExp compiler and matcher in `lib/glob.ts`.

## Exported signatures

```ts
export function globToRegExp(pattern: string): RegExp;
export function matchGlob(pattern: string, path: string): boolean;
```

`globToRegExp` returns a `RegExp` that is anchored (matches the WHOLE string).
`matchGlob` returns whether `path` matches `pattern`.

## Supported syntax

- `*` — matches any run of characters **except** the path separator `/`
  (zero or more).
- `**` — matches anything including `/` (zero or more characters). So
  `a/**/b` matches `a/b`, `a/x/b`, `a/x/y/b`.
- `?` — matches exactly one character that is not `/`.
- `[abc]` — a character class: matches one of the listed characters.
  `[a-z]` ranges are supported. A leading `!` or `^` negates the class
  (`[!0-9]` = one char that is not a digit). The separator `/` is never matched
  by a class. (Treat the class like a regex class but never matching `/`.)
- `{a,b,c}` — alternation: matches any one of the comma-separated alternatives.
  Alternatives are themselves glob fragments (may contain `*`, `?`, etc.). No
  nested braces required.
- All other characters are literal, including regex metacharacters like `.`,
  `(`, `+`, `$`, which must be escaped so they match literally.

## Examples

- `matchGlob('*.ts', 'index.ts')` → `true`
- `matchGlob('*.ts', 'a/b.ts')` → `false`  (`*` does not cross `/`)
- `matchGlob('src/**/*.ts', 'src/a/b/c.ts')` → `true`
- `matchGlob('file?.js', 'file1.js')` → `true`
- `matchGlob('img.[jp]ng', 'img.png')` → `true`
- `matchGlob('*.{js,ts}', 'a.ts')` → `true`
- `matchGlob('v1.0', 'v1x0')` → `false`  (`.` is literal)
