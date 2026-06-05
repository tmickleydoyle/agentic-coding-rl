'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNotesView } from '../../hooks/useNotesView'
import { wordCount } from '../../lib/markdown'

export default function ListPage() {
  const { tagFilter, startNewNote, startEditNote, removeNote } = useApp()
  const { visibleNotes } = useNotesView()

  return (
    <section data-testid="page-list">
      <h1>Notes</h1>
      <button data-testid="new-note" onClick={() => startNewNote()}>
        New note
      </button>
      <p data-testid="active-filter">{tagFilter ?? 'none'}</p>
      {visibleNotes.length === 0 ? (
        <p data-testid="list-empty">No notes match.</p>
      ) : (
        <ul data-testid="note-list">
          {visibleNotes.map((n) => (
            <li key={n.id} data-testid={`note-${n.id}`}>
              <span data-testid={`note-${n.id}-title`}>{n.title}</span>
              <span data-testid={`note-${n.id}-words`}>{wordCount(n.body)}</span>
              <button data-testid={`edit-${n.id}`} onClick={() => startEditNote(n.id)}>
                Edit
              </button>
              <button data-testid={`delete-${n.id}`} onClick={() => removeNote(n.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
