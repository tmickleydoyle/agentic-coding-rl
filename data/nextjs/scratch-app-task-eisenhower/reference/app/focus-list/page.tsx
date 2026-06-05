'use client'
import { useQuadrants } from '../../hooks/useQuadrants'

export default function FocusListPage() {
  const { byQuadrant } = useQuadrants()
  const focus = byQuadrant.do
  return (
    <section data-testid="page-focus-list">
      <h1>Focus list</h1>
      <span data-testid="focus-count">{focus.length}</span>
      {focus.length === 0 ? (
        <p data-testid="empty-focus">Nothing to do first.</p>
      ) : (
        <ul data-testid="focus-list">
          {focus.map((t) => (
            <li key={t.id} data-testid={`focus-${t.id}`}>
              <span data-testid={`focus-${t.id}-title`}>{t.title}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
