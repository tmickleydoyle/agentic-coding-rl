'use client'
import { usePortfolio } from '../../components/PortfolioProvider'
import { allocationPercent, changeAmount, coinValue, isUp } from '../../hooks/usePortfolio'

export default function CoinDetailPage() {
  const { coins, selectedCoinId, removeCoin, navigate } = usePortfolio()

  const coin = coins.find((c) => c.id === selectedCoinId)

  if (!coin) {
    return (
      <section data-testid="page-coin-detail">
        <p data-testid="no-coin-selected">No coin selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-coin-detail">
      <h1 data-testid="detail-symbol">{coin.symbol}</h1>
      <p data-testid="detail-name">{coin.name}</p>
      <p data-testid="detail-amount">{coin.amount}</p>
      <p data-testid="detail-price">{coin.price}</p>
      <p data-testid="detail-value">{coinValue(coin)}</p>
      <p data-testid="detail-change">{coin.change24h}</p>
      <p data-testid="detail-change-amount">{changeAmount(coin)}</p>
      <p data-testid="detail-allocation">{allocationPercent(coin, coins)}</p>
      {isUp(coin) ? (
        <p data-testid="detail-up-marker">Up over 24h</p>
      ) : (
        <p data-testid="detail-down-marker">Down over 24h</p>
      )}
      <button
        data-testid="remove-coin"
        onClick={() => {
          removeCoin(coin.id)
          navigate('portfolio')
        }}
      >
        Remove
      </button>
    </section>
  )
}
