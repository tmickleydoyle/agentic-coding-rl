'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { renderMarkdown, wordCount } from '../../lib/markdown'

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

export default function EditorPage() {
  const { notes, editingNoteId, addNote, updateNote, navigate } = useApp()
  const editing = editingNoteId ? notes.find((n) => n.id === editingNoteId) : undefined

  const [title, setTitle] = useState(editing?.title ?? '')
  const [body, setBody] = useState(editing?.body ?? '')
  const [tags, setTags] = useState(editing ? editing.tags.join(', ') : '')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    const parsedTags = parseTags(tags)
    if (editing) {
      updateNote(editing.id, { title: title.trim(), body, tags: parsedTags })
    } else {
      addNote({ title: title.trim(), body, tags: parsedTags })
    }
    navigate('list')
  }

  return (
    <section data-testid="page-editor">
      <h1>{editing ? 'Edit note' : 'New note'}</h1>
      <form data-testid="note-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          data-testid="body-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          data-testid="tags-input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="save-note">
          Save
        </button>
      </form>

      <span data-testid="live-words">{wordCount(body)}</span>
      <div data-testid="preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
    </section>
  )
}
