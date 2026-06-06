# Markdown Preview

Build a single-page split-pane markdown editor and live preview app that converts markdown to HTML using a built-in mini-renderer.

## Layout

- A heading "Markdown Preview"
- Two side-by-side panes:
  - Left pane: a textarea labeled "Markdown Input" (aria-label="Markdown Input") where the user types markdown
  - Right pane: a div (data-testid="preview-area") that renders the markdown as HTML using dangerouslySetInnerHTML
- The preview updates live as the user types (no separate button needed)
- A character count display (data-testid="char-count") showing "X characters"
- A word count display (data-testid="word-count") showing "Y words" (split by whitespace, filter empty)
- A "Clear" button that empties the textarea
- A "Copy Markdown" button that copies the textarea content to clipboard (navigator.clipboard.writeText). Show a "Copied!" indicator (data-testid="copy-indicator") that disappears when the textarea changes.

## Seed Data

Pre-populate the textarea with this markdown and show its preview on initial render:

```
# Welcome

This is a **markdown** preview app.

## Features

- Live preview
- Word count
- Copy support

> Try editing the text on the left!
```

## Markdown Rendering Rules (implement a mini-renderer — NO external libraries)

Process lines sequentially:

1. Lines starting with `# ` (one hash + space) → `<h1>` (apply inline rules to content)
2. Lines starting with `## ` → `<h2>`
3. Lines starting with `### ` → `<h3>`
4. Lines starting with `- ` → collect consecutive `- ` lines into a single `<ul>` with `<li>` items (apply inline rules to each item)
5. Lines starting with `> ` → `<blockquote>` (apply inline rules to content)
6. Empty lines → ignored (no output element)
7. All other lines → `<p>` (apply inline rules)

Inline rules (applied within block content):
- `**text**` → `<strong>text</strong>`
- `*text*` → `<em>text</em>` (only single asterisks, not double)
- `` `code` `` → `<code>code</code>`
- `[label](url)` → `<a href="url">label</a>`

## Behaviors

- Live preview: every keystroke updates data-testid="preview-area".
- Character count counts every character in the textarea value (including newlines).
- Word count: textarea value split by `/\s+/`, filter out empty strings.
- "Clear" sets textarea to "".
- The preview for the seed data must include an `<h1>`, an `<h2>`, a `<ul>`, a `<blockquote>`, `<strong>` text, and a `<p>`.

## Key Data-testids

- data-testid="preview-area"
- data-testid="char-count"
- data-testid="word-count"
- data-testid="copy-indicator"
