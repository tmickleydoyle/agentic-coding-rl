'use client'

export default function Toolbar({
  filter,
  onFilter,
}: {
  filter: string
  onFilter: (value: string) => void
}) {
  return (
    <input
      data-testid="filter"
      value={filter}
      onChange={(e) => onFilter(e.target.value)}
    />
  )
}
