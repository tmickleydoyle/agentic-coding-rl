'use client'

export default function EntryRow({
  id,
  name,
  score,
}: {
  id: string
  name: string
  score: number
}) {
  return (
    <li data-testid={`entry-${id}`}>
      <span data-testid={`entry-${id}-name`}>{name}</span>
      <span data-testid={`entry-${id}-score`}>{score}</span>
    </li>
  )
}
