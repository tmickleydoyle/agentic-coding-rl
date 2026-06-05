'use client'
import type { Activity } from '../lib/types'

export default function ActivityItem({
  activity,
  isFirst,
  isLast,
  onUp,
  onDown,
  onRemove,
}: {
  activity: Activity
  isFirst: boolean
  isLast: boolean
  onUp: (id: string) => void
  onDown: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`activity-${activity.id}`}>
      <span data-testid={`activity-${activity.id}-title`}>{activity.title}</span>
      <span data-testid={`activity-${activity.id}-cost`}>{activity.cost}</span>
      <button
        data-testid={`up-${activity.id}`}
        disabled={isFirst}
        onClick={() => onUp(activity.id)}
      >
        Up
      </button>
      <button
        data-testid={`down-${activity.id}`}
        disabled={isLast}
        onClick={() => onDown(activity.id)}
      >
        Down
      </button>
      <button data-testid={`remove-${activity.id}`} onClick={() => onRemove(activity.id)}>
        Remove
      </button>
    </li>
  )
}
