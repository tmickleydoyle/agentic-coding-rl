'use client'
import { useShop } from '../hooks/useShop'

export function Report() {
  const { products, sales } = useShop()

  const unitsOf = (pid: number) =>
    sales.filter((s) => s.productId === pid).reduce((sum, s) => sum + s.qty, 0)
  const revenueOf = (pid: number) =>
    sales.filter((s) => s.productId === pid).reduce((sum, s) => sum + s.price * s.qty, 0)

  const totalRevenue = sales.reduce((sum, s) => sum + s.price * s.qty, 0)

  let top = 'none'
  let best = 0
  products.forEach((p) => {
    const r = revenueOf(p.id)
    if (r > best) {
      best = r
      top = p.name
    }
  })

  return (
    <section aria-label="Report view">
      <h1>Report</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{`${p.name}: ${unitsOf(p.id)} units, $${revenueOf(p.id)}`}</li>
        ))}
      </ul>
      <p>{`Total revenue: $${totalRevenue}`}</p>
      <p>{`Top product: ${top}`}</p>
    </section>
  )
}
