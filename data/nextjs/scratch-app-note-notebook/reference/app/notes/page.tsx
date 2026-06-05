'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNotes } from '../../hooks/useNotes'
import NoteItem from '../../components/NoteItem'

export default function NotesPage() {
  const {
    selectedNotebookId,
    tagFilter,
    setTagFilter,
    startNewNote,
    startEditNote,
    togglePin,
    removeNote,
  } = useApp()
  const { notesInNotebook, tagsInNotebook } = useNotes()

  if (!selectedNotebookId) {
    return (
      <section data-testid="page-notes">
        <h1>Notes</h1>
        <p data-testid="no-notebook">Pick a notebook first.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-notes">
      <h1>Notes</h1>
      <select
        data-testid="tag-filter"
        value={tagFilter ?? 'all'}
        onChange={(e) => setTagFilter(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All tags</option>
        {tagsInNotebook.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button data-testid="new-note" onClick={() => startNewNote(selectedNotebookId)}>
        New note
      </button>
      {notesInNotebook.length === 0 ? (
        <p data-testid="notes-empty">No notes here.</p>
      ) : (
        <ul data-testid="note-list">
          {notesInNotebook.map((n) => (
            <NoteItem
              key={n.id}
              note={n}
              onEdit={startEditNote}
              onPin={togglePin}
              onRemove={removeNote}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
