'use client'
import { useRebalance } from '../../components/RebalanceProvider'
import { isBalanced, suggestionsOf } from '../../hooks/useRebalance'

export default function RebalancePage() {
  const { holdings, history, logRebalance, navigate } = useRebalance()
  const suggestions = suggestionsOf(holdings)
  const trades = suggestions.filter((s) => s.action !== 'HOLD')
  const balanced = isBalanced(holdings)

  const onApply = () => {
    logRebalance(
      trades.map((s) => ({
        symbol: s.holding.symbol,
        action: s.action as 'BUY' | 'SELL',
        amount: s.amount,
      })),
    )
    navigate('history')
  }

  return (
    <section data-testid="page-rebalance">
      <h1>Rebalance</h1>
      <p data-testid="trade-count">{trades.length}</p>
      {balanced ? <p data-testid="already-balanced">Already balanced.</p> : null}
      <ul data-testid="suggestion-list">
        {suggestions.map((s) => (
          <li key={s.holding.id} data-testid={`suggestion-${s.holding.id}`} data-action={s.action}>
            <span data-testid={`suggestion-${s.holding.id}-symbol`}>{s.holding.symbol}</span>
            <span data-testid={`suggestion-${s.holding.id}-action`}>{s.action}</span>
            <span data-testid={`suggestion-${s.holding.id}-amount`}>{s.amount}</span>
          </li>
        ))}
      </ul>
      <button data-testid="apply-rebalance" disabled={trades.length === 0} onClick={onApply}>
        Apply ({history.length} logged)
      </button>
    </section>
  )
}
