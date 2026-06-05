'use client'
import type { Feedback } from '../lib/types'

export default function FeedbackItem({
  item,
  onOpen,
}: {
  item: Feedback
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`fb-${item.id}`} data-status={item.status} data-sentiment={item.sentiment}>
      <span data-testid={`fb-${item.id}-author`}>{item.author}</span>
      <span data-testid={`fb-${item.id}-category`}>{item.category}</span>
      <span data-testid={`fb-${item.id}-sentiment`}>{item.sentiment}</span>
      <span data-testid={`fb-${item.id}-status`}>{item.status}</span>
      <button data-testid={`open-${item.id}`} onClick={() => onOpen(item.id)}>
        View
      </button>
    </li>
  )
}
