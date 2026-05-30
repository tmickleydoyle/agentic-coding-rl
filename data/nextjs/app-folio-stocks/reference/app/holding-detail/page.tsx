'use client'
import { usePortfolio } from '../../components/PortfolioProvider'
import {
  allocationPercent,
  costValue,
  gainLoss,
  gainLossPercent,
  isGain,
  marketValue,
} from '../../hooks/usePortfolio'

export default function HoldingDetailPage() {
  const { holdings, selectedHoldingId, removeHolding, navigate } = usePortfolio()

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
      <p data-testid="detail-price">{holding.price}</p>
      <p data-testid="detail-cost-basis">{holding.costBasis}</p>
      <p data-testid="detail-value">{marketValue(holding)}</p>
      <p data-testid="detail-cost">{costValue(holding)}</p>
      <p data-testid="detail-gainloss">{gainLoss(holding)}</p>
      <p data-testid="detail-gainloss-percent">{gainLossPercent(holding)}</p>
      <p data-testid="detail-allocation">{allocationPercent(holding, holdings)}</p>
      {isGain(holding) ? (
        <p data-testid="detail-gain-marker">In profit</p>
      ) : (
        <p data-testid="detail-loss-marker">At a loss</p>
      )}
      <button
        data-testid="remove-holding"
        onClick={() => {
          removeHolding(holding.id)
          navigate('portfolio')
        }}
      >
        Remove
      </button>
    </section>
  )
}
