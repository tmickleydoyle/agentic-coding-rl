'use client'

export default function CategoryRow({
  category,
  count,
  onFilter,
}: {
  category: string
  count: number
  onFilter: (category: string) => void
}) {
  return (
    <li data-testid={`cat-${category}`}>
      <span data-testid={`cat-${category}-count`}>{count}</span>
      <button data-testid={`cat-${category}-filter`} onClick={() => onFilter(category)}>
        {category}
      </button>
    </li>
  )
}
