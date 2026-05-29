'use client'

export default function SuggestionList({
  items,
  onPick,
}: {
  items: string[]
  onPick: (value: string) => void
}) {
  return (
    <ul data-testid="suggestions">
      {items.map((item, i) => (
        <li key={item}>
          <button data-testid={`suggestion-${i}`} onClick={() => onPick(item)}>
            {item}
          </button>
        </li>
      ))}
    </ul>
  )
}
