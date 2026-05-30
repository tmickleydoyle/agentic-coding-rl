'use client'
import type { Note } from '../lib/types'

export default function NoteItem({
  note,
  onEdit,
  onPin,
  onRemove,
}: {
  note: Note
  onEdit: (id: string) => void
  onPin: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`note-${note.id}`} data-pinned={note.pinned ? 'true' : 'false'}>
      <span data-testid={`note-${note.id}-title`}>{note.title}</span>
      <button data-testid={`edit-${note.id}`} onClick={() => onEdit(note.id)}>
        Edit
      </button>
      <button data-testid={`pin-${note.id}`} onClick={() => onPin(note.id)}>
        {note.pinned ? 'Unpin' : 'Pin'}
      </button>
      <button data-testid={`delete-${note.id}`} onClick={() => onRemove(note.id)}>
        Delete
      </button>
    </li>
  )
}
