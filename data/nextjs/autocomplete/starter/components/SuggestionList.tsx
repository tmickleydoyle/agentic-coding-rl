'use client'

// TODO: render <ul data-testid="suggestions"> with one
// <li><button data-testid="suggestion-<index>">{item}</button></li> per item.
// Clicking a button calls onPick(item).
export default function SuggestionList({
  items,
  onPick,
}: {
  items: string[]
  onPick: (value: string) => void
}) {
  return <ul data-testid="suggestions" />
}
