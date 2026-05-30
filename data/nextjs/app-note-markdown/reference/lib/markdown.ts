// A tiny, deterministic line-based markdown renderer. Not spec-complete — just enough for
// headings, bullet lists, paragraphs, and inline bold/code.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  return out
}

export function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let paragraph: string[] = []
  let bullets: string[] = []

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push(`<p>${inline(paragraph.join(' '))}</p>`)
      paragraph = []
    }
  }
  const flushBullets = () => {
    if (bullets.length > 0) {
      const items = bullets.map((b) => `<li>${inline(b)}</li>`).join('')
      blocks.push(`<ul>${items}</ul>`)
      bullets = []
    }
  }

  lines.forEach((raw) => {
    const line = raw.trimEnd()
    if (line.trim().length === 0) {
      flushParagraph()
      flushBullets()
      return
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushBullets()
      const level = heading[1].length
      blocks.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      return
    }
    if (/^-\s+/.test(line)) {
      flushParagraph()
      bullets.push(line.replace(/^-\s+/, ''))
      return
    }
    flushBullets()
    paragraph.push(line.trim())
  })

  flushParagraph()
  flushBullets()
  return blocks.join('')
}

export function wordCount(src: string): number {
  const trimmed = src.trim()
  if (trimmed.length === 0) return 0
  return trimmed.split(/\s+/).length
}
