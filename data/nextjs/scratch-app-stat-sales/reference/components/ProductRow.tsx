'use client'

export default function ProductRow({
  product,
  revenue,
  units,
  onSelect,
}: {
  product: string
  revenue: number
  units: number
  onSelect: (product: string) => void
}) {
  return (
    <li data-testid={`product-${product}`}>
      <span data-testid={`product-${product}-name`}>{product}</span>
      <span data-testid={`product-${product}-revenue`}>{revenue}</span>
      <span data-testid={`product-${product}-units`}>{units}</span>
      <button data-testid={`select-${product}`} onClick={() => onSelect(product)}>
        Select
      </button>
    </li>
  )
}
