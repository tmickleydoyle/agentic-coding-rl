'use client'
import { useTotals } from '../hooks/useTotals'
import { money } from '../lib/money'

export function Summary() {
  const { subtotal, discountAmt, taxable, tax, total } = useTotals()
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Subtotal: ${money(subtotal)}`}</p>
      <p>{`Discount: -${money(discountAmt)}`}</p>
      <p>{`Taxable: ${money(taxable)}`}</p>
      <p>{`Tax: ${money(tax)}`}</p>
      <p>{`Total: ${money(total)}`}</p>
    </section>
  )
}
