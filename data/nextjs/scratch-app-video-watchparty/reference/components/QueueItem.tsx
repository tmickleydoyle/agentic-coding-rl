'use client'

export default function QueueItem({
  index,
  title,
  onRemove,
}: {
  index: number
  title: string
  onRemove: (index: number) => void
}) {
  return (
    <li data-testid={`queue-item-${index}`}>
      <span data-testid={`queue-item-${index}-title`}>{title}</span>
      <button data-testid={`queue-remove-${index}`} onClick={() => onRemove(index)}>
        Remove
      </button>
    </li>
  )
}
