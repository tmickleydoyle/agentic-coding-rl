'use client'
import { useMortgage } from '../../components/AppStateProvider'
import { useSaved } from '../../hooks/useSaved'

export default function ComparePage() {
  const { rate, termYears, downPayment } = useMortgage()
  const { quotes } = useSaved()

  let cheapestId: string | null = null
  let cheapestMonthly = Infinity
  quotes.forEach((q) => {
    if (q.monthly < cheapestMonthly) {
      cheapestMonthly = q.monthly
      cheapestId = q.property.id
    }
  })

  return (
    <section data-testid="page-compare">
      <h1>Compare</h1>
      <p data-testid="compare-rate">{rate}</p>
      <p data-testid="compare-term">{termYears}</p>
      <p data-testid="compare-down">{downPayment}</p>
      {quotes.length === 0 ? (
        <p data-testid="compare-empty">Save properties to compare them.</p>
      ) : (
        <ul data-testid="compare-list">
          {quotes.map((q) => (
            <li
              key={q.property.id}
              data-testid={`compare-${q.property.id}`}
              data-cheapest={q.property.id === cheapestId ? 'true' : 'false'}
            >
              <span data-testid={`compare-${q.property.id}-address`}>{q.property.address}</span>
              <span data-testid={`compare-${q.property.id}-monthly`}>{q.monthly}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
