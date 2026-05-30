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
  // TODO: render <li data-testid="note-<id>" data-pinned> with title, an edit-<id>,
  // pin-<id>, and delete-<id> button.
  void onEdit
  void onPin
  void onRemove
  return <li data-testid={`note-${note.id}`} />
}
