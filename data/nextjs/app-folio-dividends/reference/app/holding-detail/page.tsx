'use client'
import { useDividends } from '../../components/DividendsProvider'
import { annualIncome, monthName } from '../../hooks/useDividends'

export default function HoldingDetailPage() {
  const { holdings, selectedHoldingId, removeHolding, navigate } = useDividends()

  const holding = holdings.find((h) => h.id === selectedHoldingId)

  if (!holding) {
    return (
      <section data-testid="page-holding-detail">
        <p data-testid="no-holding-selected">No holding selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-holding-detail">
      <h1 data-testid="detail-symbol">{holding.symbol}</h1>
      <p data-testid="detail-name">{holding.name}</p>
      <p data-testid="detail-shares">{holding.shares}</p>
      <p data-testid="detail-per-share">{holding.dividendPerShare}</p>
      <p data-testid="detail-income">{annualIncome(holding)}</p>
      <p data-testid="detail-month">{monthName(holding.payMonth)}</p>
      <button
        data-testid="remove-holding"
        onClick={() => {
          removeHolding(holding.id)
          navigate('dashboard')
        }}
      >
        Remove
      </button>
    </section>
  )
}
