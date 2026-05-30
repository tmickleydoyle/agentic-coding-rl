'use client'
import type { VocabList } from '../lib/types'

export default function ListCard({
  list,
  masteredCount,
  onPractice,
}: {
  list: VocabList
  masteredCount: number
  onPractice: (id: string) => void
}) {
  return (
    <li data-testid={`list-${list.id}`}>
      <span data-testid={`list-${list.id}-name`}>{list.name}</span>
      <span data-testid={`list-${list.id}-count`}>{list.words.length}</span>
      <span data-testid={`list-${list.id}-mastered`}>{masteredCount}</span>
      <button data-testid={`practice-${list.id}`} onClick={() => onPractice(list.id)}>
        Practice
      </button>
    </li>
  )
}
