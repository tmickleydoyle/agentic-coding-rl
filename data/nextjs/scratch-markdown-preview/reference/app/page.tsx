'use client'
import { useState } from 'react'

const SEED = `# Welcome

This is a **markdown** preview app.

## Features

- Live preview
- Word count
- Copy support

> Try editing the text on the left!`

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  let html = ''
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^### /.test(line)) {
      html += `<h3>${applyInline(line.slice(4))}</h3>`
      i++
    } else if (/^## /.test(line)) {
      html += `<h2>${applyInline(line.slice(3))}</h2>`
      i++
    } else if (/^# /.test(line)) {
      html += `<h1>${applyInline(line.slice(2))}</h1>`
      i++
    } else if (/^- /.test(line)) {
      let items = ''
      while (i < lines.length && /^- /.test(lines[i])) {
        items += `<li>${applyInline(lines[i].slice(2))}</li>`
        i++
      }
      html += `<ul>${items}</ul>`
    } else if (/^> /.test(line)) {
      html += `<blockquote>${applyInline(line.slice(2))}</blockquote>`
      i++
    } else if (line.trim() === '') {
      i++
    } else {
      html += `<p>${applyInline(line)}</p>`
      i++
    }
  }
  return html
}

export default function App() {
  const [markdown, setMarkdown] = useState(SEED)
  const [copied, setCopied] = useState(false)

  const preview = renderMarkdown(markdown)
  const charCount = markdown.length
  const wordCount = markdown.split(/\s+/).filter(Boolean).length

  function handleChange(val: string) {
    setMarkdown(val)
    setCopied(false)
  }

  function handleClear() {
    setMarkdown('')
    setCopied(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
  }

  return (
    <div>
      <h1>Markdown Preview</h1>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label>
            Markdown Input
            <textarea
              aria-label="Markdown Input"
              value={markdown}
              onChange={e => handleChange(e.target.value)}
              rows={20}
            />
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <div
            data-testid="preview-area"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>

      <p data-testid="char-count">{charCount} characters</p>
      <p data-testid="word-count">{wordCount} words</p>

      <button onClick={handleClear}>Clear</button>
      <button onClick={handleCopy}>Copy Markdown</button>
      {copied && <span data-testid="copy-indicator">Copied!</span>}
    </div>
  )
}
