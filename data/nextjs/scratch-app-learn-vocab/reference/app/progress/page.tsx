'use client'
import { useApp } from '../../components/AppStateProvider'
import { listProgress } from '../../hooks/useVocab'

export default function ProgressPage() {
  const { lists } = useApp()

  let totalWords = 0
  let masteredWords = 0
  lists.forEach((l) => {
    const p = listProgress(l)
    totalWords += p.total
    masteredWords += p.mastered
  })

  return (
    <section data-testid="page-progress">
      <h1>Progress</h1>
      <span data-testid="total-words-value">{totalWords}</span>
      <span data-testid="mastered-words-value">{masteredWords}</span>
      <ul data-testid="prog-list-list">
        {lists.map((l) => (
          <li key={l.id} data-testid={`prog-list-${l.id}`}>
            <span data-testid={`prog-list-${l.id}-name`}>{l.name}</span>
            <span data-testid={`prog-list-${l.id}-percent`}>{listProgress(l).percent}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
