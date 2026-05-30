'use client'
import { changeAmount, coinValue, isUp } from '../hooks/usePortfolio'
import type { Coin } from '../lib/types'

export default function CoinCard({
  coin,
  onSelect,
}: {
  coin: Coin
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`coin-${coin.id}`} data-up={isUp(coin) ? 'true' : 'false'}>
      <span data-testid={`coin-${coin.id}-symbol`}>{coin.symbol}</span>
      <span data-testid={`coin-${coin.id}-amount`}>{coin.amount}</span>
      <span data-testid={`coin-${coin.id}-price`}>{coin.price}</span>
      <span data-testid={`coin-${coin.id}-value`}>{coinValue(coin)}</span>
      <span data-testid={`coin-${coin.id}-change`}>{coin.change24h}</span>
      <span data-testid={`coin-${coin.id}-change-amount`}>{changeAmount(coin)}</span>
      <button data-testid={`select-${coin.id}`} onClick={() => onSelect(coin.id)}>
        View
      </button>
    </li>
  )
}
