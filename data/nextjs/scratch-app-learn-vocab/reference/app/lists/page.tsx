'use client'
import { useApp } from '../../components/AppStateProvider'
import { listProgress } from '../../hooks/useVocab'
import ListCard from '../../components/ListCard'

export default function ListsPage() {
  const { lists, openList } = useApp()
  return (
    <section data-testid="page-lists">
      <h1>Lists</h1>
      <ul data-testid="list-list">
        {lists.map((l) => (
          <ListCard
            key={l.id}
            list={l}
            masteredCount={listProgress(l).mastered}
            onPractice={openList}
          />
        ))}
      </ul>
    </section>
  )
}
