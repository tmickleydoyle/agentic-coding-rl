'use client'
import { useState } from 'react'
import { usePortfolio } from '../../components/PortfolioProvider'

export default function AddPage() {
  const { addHolding, navigate } = usePortfolio()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [shares, setShares] = useState('')
  const [costBasis, setCostBasis] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedShares = Number(shares)
    const parsedCost = Number(costBasis)
    const parsedPrice = Number(price)
    if (symbol.trim().length === 0) {
      setError('Symbol is required')
      return
    }
    if (shares.trim().length === 0 || Number.isNaN(parsedShares) || parsedShares <= 0) {
      setError('Enter positive shares')
      return
    }
    if (costBasis.trim().length === 0 || Number.isNaN(parsedCost) || parsedCost <= 0) {
      setError('Enter a positive cost basis')
      return
    }
    const priceValue =
      price.trim().length === 0 || Number.isNaN(parsedPrice) || parsedPrice <= 0
        ? parsedCost
        : parsedPrice
    setError('')
    addHolding({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim().length === 0 ? symbol.trim().toUpperCase() : name.trim(),
      shares: parsedShares,
      costBasis: parsedCost,
      price: priceValue,
    })
    setSymbol('')
    setName('')
    setShares('')
    setCostBasis('')
    setPrice('')
    navigate('portfolio')
  }

  return (
    <section data-testid="page-add">
      <h1>Add holding</h1>
      <form data-testid="holding-form" onSubmit={onSubmit}>
        <input data-testid="symbol-input" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <input data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="shares-input" value={shares} onChange={(e) => setShares(e.target.value)} />
        <input
          data-testid="cost-input"
          value={costBasis}
          onChange={(e) => setCostBasis(e.target.value)}
        />
        <input data-testid="price-input" value={price} onChange={(e) => setPrice(e.target.value)} />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-holding">
          Add holding
        </button>
      </form>
    </section>
  )
}
