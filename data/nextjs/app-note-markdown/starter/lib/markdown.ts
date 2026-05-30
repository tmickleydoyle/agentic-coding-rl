// A tiny, deterministic line-based markdown renderer.
// TODO: support # / ## / ### headings, "- " bullet lists wrapped in <ul>, blank-line
// separated paragraphs (consecutive lines joined by a space), and inline **bold** and
// `code`.

export function renderMarkdown(_src: string): string {
  // TODO: render the supported markdown subset to an HTML string
  return ''
}

export function wordCount(_src: string): number {
  // TODO: count whitespace-separated word tokens (0 for empty/whitespace)
  return 0
}
