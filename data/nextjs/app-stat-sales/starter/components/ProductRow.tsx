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
  // TODO: render <li data-testid="product-<name>"> with name, revenue, units, and a
  // select-<name> button that calls onSelect(product).
  void revenue
  void units
  void onSelect
  return <li data-testid={`product-${product}`} />
}
