'use client'
import { useApp } from '../../components/AppStateProvider'

export default function NotebooksPage() {
  const { notebooks, notes, selectNotebook } = useApp()
  const countFor = (id: string): number => notes.filter((n) => n.notebookId === id).length
  return (
    <section data-testid="page-notebooks">
      <h1>Notebooks</h1>
      <ul data-testid="notebook-list">
        {notebooks.map((nb) => (
          <li key={nb.id} data-testid={`notebook-${nb.id}`}>
            <span data-testid={`notebook-${nb.id}-name`}>{nb.name}</span>
            <span data-testid={`notebook-${nb.id}-count`}>{countFor(nb.id)}</span>
            <button data-testid={`open-${nb.id}`} onClick={() => selectNotebook(nb.id)}>
              Open
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
