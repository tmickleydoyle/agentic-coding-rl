'use client'
import { useState } from 'react'
import { useWatchlist } from '../../components/WatchlistProvider'
import type { Direction } from '../../lib/types'

export default function AddPage() {
  const { addTicker, navigate } = useWatchlist()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [target, setTarget] = useState('')
  const [direction, setDirection] = useState<Direction>('above')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPrice = Number(price)
    const parsedTarget = Number(target)
    if (symbol.trim().length === 0) {
      setError('Symbol is required')
      return
    }
    if (price.trim().length === 0 || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Enter a positive price')
      return
    }
    if (target.trim().length === 0 || Number.isNaN(parsedTarget) || parsedTarget <= 0) {
      setError('Enter a positive target')
      return
    }
    setError('')
    addTicker({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim().length === 0 ? symbol.trim().toUpperCase() : name.trim(),
      price: parsedPrice,
      targetPrice: parsedTarget,
      direction,
    })
    setSymbol('')
    setName('')
    setPrice('')
    setTarget('')
    setDirection('above')
    navigate('watchlist')
  }

  return (
    <section data-testid="page-add">
      <h1>Add ticker</h1>
      <form data-testid="ticker-form" onSubmit={onSubmit}>
        <input data-testid="symbol-input" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <input data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="price-input" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input data-testid="target-input" value={target} onChange={(e) => setTarget(e.target.value)} />
        <select
          data-testid="direction-input"
          value={direction}
          onChange={(e) => setDirection(e.target.value as Direction)}
        >
          <option value="above">above</option>
          <option value="below">below</option>
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-ticker">
          Add ticker
        </button>
      </form>
    </section>
  )
}
