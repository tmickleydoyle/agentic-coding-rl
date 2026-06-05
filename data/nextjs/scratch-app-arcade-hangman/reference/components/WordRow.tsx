'use client'

export default function WordRow({
  index,
  word,
  current,
  onPick,
}: {
  index: number
  word: string
  current: boolean
  onPick: (index: number) => void
}) {
  return (
    <li data-testid={`word-${index}`}>
      <span data-testid={`word-${index}-len`}>{word.length}</span>
      <span data-testid={`word-${index}-current`}>{current ? 'current' : ''}</span>
      <button data-testid={`pick-${index}`} onClick={() => onPick(index)}>
        Play
      </button>
    </li>
  )
}
