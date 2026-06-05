'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'

type Note = { id: number; title: string; body: string; tags: string[] }

function renderInline(text: string, base: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let idx = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<strong key={`${base}-b${idx++}`}>{m[1]}</strong>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderMarkdown(body: string): ReactNode[] {
  const blocks: ReactNode[] = []
  let list: string[] = []
  let key = 0
  function flush() {
    if (list.length) {
      const items = list
      const k = key++
      blocks.push(
        <ul key={`ul${k}`}>
          {items.map((it, i) => (
            <li key={i}>{renderInline(it, `ul${k}-${i}`)}</li>
          ))}
        </ul>,
      )
      list = []
    }
  }
  body.split('\n').forEach((raw) => {
    const line = raw.replace(/\s+$/, '')
    if (line.startsWith('## ')) {
      flush()
      blocks.push(<h2 key={key++}>{renderInline(line.slice(3), `h2${key}`)}</h2>)
    } else if (line.startsWith('# ')) {
      flush()
      blocks.push(<h1 key={key++}>{renderInline(line.slice(2), `h1${key}`)}</h1>)
    } else if (line.startsWith('- ')) {
      list.push(line.slice(2))
    } else if (line.trim() === '') {
      flush()
    } else {
      flush()
      blocks.push(<p key={key++}>{renderInline(line, `p${key}`)}</p>)
    }
  })
  flush()
  return blocks
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tagText, setTagText] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [nextId, setNextId] = useState(1)

  function add() {
    const t = title.trim()
    if (!t) return
    const tags = tagText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    const note: Note = { id: nextId, title: t, body, tags }
    setNotes((n) => [...n, note])
    setSelectedId(nextId)
    setNextId((i) => i + 1)
    setTitle('')
    setBody('')
    setTagText('')
  }

  function remove() {
    if (selectedId === null) return
    setNotes((n) => n.filter((x) => x.id !== selectedId))
    setSelectedId(null)
  }

  const allTags: string[] = []
  notes.forEach((n) =>
    n.tags.forEach((t) => {
      if (!allTags.includes(t)) allTags.push(t)
    }),
  )

  const q = query.trim().toLowerCase()
  const visible = notes.filter((n) => {
    const matchesText =
      q === '' ||
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q)
    const matchesTag = activeTag === null || n.tags.includes(activeTag)
    return matchesText && matchesTag
  })

  const selected = notes.find((n) => n.id === selectedId) ?? null

  return (
    <div>
      <h1>Notes</h1>

      <section aria-label="Editor">
        <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea aria-label="Body" value={body} onChange={(e) => setBody(e.target.value)} />
        <input aria-label="Tags" value={tagText} onChange={(e) => setTagText(e.target.value)} />
        <button onClick={add}>Add note</button>
        {selected && <button onClick={remove}>Delete note</button>}
      </section>

      <section aria-label="Search bar">
        <input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </section>

      <section aria-label="Tag filter">
        <button onClick={() => setActiveTag(null)}>All</button>
        {allTags.map((t) => (
          <button key={t} onClick={() => setActiveTag(t)}>
            {t}
          </button>
        ))}
      </section>

      <section aria-label="Notes">
        <ul>
          {visible.map((n) => (
            <li key={n.id}>
              <button onClick={() => setSelectedId(n.id)}>{n.title}</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Preview">
        {selected ? renderMarkdown(selected.body) : <p>No note selected</p>}
      </section>
    </div>
  )
}
