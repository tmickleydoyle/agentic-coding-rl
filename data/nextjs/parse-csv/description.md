# parse-csv

Implement an RFC-4180-ish CSV parser in `lib/csv.ts`.

## Exported signatures

```ts
export interface CSVOptions {
  delimiter?: string; // single character, default ','
}
export function parseCSV(text: string, opts?: CSVOptions): string[][];
```

## Behavior

- Splits `text` into rows; each row is an array of string fields.
- Fields are separated by the delimiter (default `,`).
- Rows are separated by `LF` (`\n`) or `CRLF` (`\r\n`). A lone `\r` does not
  separate rows when it is not followed by `\n`... but in practice input uses
  `\n` or `\r\n`; treat `\r\n` as one row terminator.
- **Quoted fields**: a field may be wrapped in double quotes `"..."`. Inside a
  quoted field, the delimiter, `\n`, and `\r\n` are literal content. A literal
  double-quote inside a quoted field is written as two double-quotes `""`.
- Unquoted fields are taken verbatim (no trimming).
- A **trailing newline** at the end of the input does NOT produce an extra
  empty row. (`"a,b\n"` → `[["a","b"]]`.)
- An empty input string `""` returns `[]`.
- A line with no content but present (e.g. the blank line in `"a\n\nb"`)
  produces a row with a single empty field: `[["a"],[""],["b"]]`.
- The `delimiter` option lets you parse e.g. TSV (`"\t"`) or semicolon files.

## Examples

- `parseCSV('a,b,c')` → `[["a","b","c"]]`
- `parseCSV('"a,b",c')` → `[["a,b","c"]]`
- `parseCSV('"she said ""hi"""')` → `[['she said "hi"']]`
- `parseCSV('"line1\nline2",x')` → `[["line1\nline2","x"]]`
- `parseCSV('a;b', { delimiter: ';' })` → `[["a","b"]]`
