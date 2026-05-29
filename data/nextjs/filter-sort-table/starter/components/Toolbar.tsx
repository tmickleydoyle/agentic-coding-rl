'use client'

// TODO: render <input data-testid="filter"> bound to `filter`, calling onFilter on change.
export default function Toolbar({
  filter,
  onFilter,
}: {
  filter: string
  onFilter: (value: string) => void
}) {
  return <input data-testid="filter" value={filter} onChange={() => {}} />
}
