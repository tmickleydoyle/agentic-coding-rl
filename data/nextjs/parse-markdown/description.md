# parse-markdown

Implement a small Markdown-subset → HTML renderer in `lib/markdown.ts`. No
third-party packages.

## Exported signature

```ts
export function renderMarkdown(md: string): string;
```

## Block-level rules

Input is split into lines. Blocks are separated by blank lines.

- **ATX headings**: a line starting with 1–6 `#` followed by a space becomes
  `<h1>`..`<h6>`. The heading text has inline formatting applied.
  `# Hi` → `<h1>Hi</h1>`. Seven or more `#` is treated as a paragraph.
- **Unordered lists**: consecutive lines beginning with `- ` (dash space) form
  one `<ul>` with each line as `<li>...</li>` (inline formatting applied to the
  item text). A list ends at a blank line or a non-list line.
- **Paragraphs**: any other run of consecutive non-blank lines becomes a single
  `<p>...</p>`; lines within a paragraph are joined with a single space. Inline
  formatting is applied.
- Multiple blocks are concatenated with no separator between them (no newlines
  between top-level elements).
- Leading/trailing blank lines and runs of blank lines are ignored.
- Empty / whitespace-only input returns `''`.

## Inline rules (applied to text content)

Apply in a way that yields these results:

- **Escaping FIRST**: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`. Do this before
  inserting any generated tags so literal `<`/`>`/`&` in source are escaped but
  the tags you emit are not.
- `` `code` `` → `<code>code</code>`. Content inside code is NOT further
  formatted (but is still HTML-escaped by the escaping step).
- `**bold**` → `<strong>bold</strong>`.
- `*italic*` → `<em>italic</em>`.
- `[text](url)` → `<a href="url">text</a>`. The `text` may contain other inline
  formatting; the `url` is used verbatim (after escaping).

## Examples

- `renderMarkdown('# Title')` → `<h1>Title</h1>`
- `renderMarkdown('a **b** c')` → `<p>a <strong>b</strong> c</p>`
- `renderMarkdown('- one\n- two')` → `<ul><li>one</li><li>two</li></ul>`
- `renderMarkdown('1 < 2 & 3')` → `<p>1 &lt; 2 &amp; 3</p>`
- `renderMarkdown('[go](/x)')` → `<p><a href="/x">go</a></p>`
