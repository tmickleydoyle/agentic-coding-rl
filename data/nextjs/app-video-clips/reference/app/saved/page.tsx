'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSaved } from '../../hooks/useClips'

export default function SavedPage() {
  const { toggleSave } = useApp()
  const items = useSaved()

  if (items.length === 0) {
    return (
      <section data-testid="page-saved">
        <p data-testid="no-saved">No saved clips.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-saved">
      <h1>Saved</h1>
      <span data-testid="saved-count-value">{items.length}</span>
      <ul data-testid="saved-list">
        {items.map((c) => (
          <li key={c.id} data-testid={`sv-${c.id}`}>
            <span data-testid={`sv-${c.id}-title`}>{c.title}</span>
            <button data-testid={`sv-remove-${c.id}`} onClick={() => toggleSave(c.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
