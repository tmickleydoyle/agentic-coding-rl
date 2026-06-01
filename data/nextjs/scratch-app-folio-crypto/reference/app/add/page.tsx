'use client'
import { useState } from 'react'
import { usePortfolio } from '../../components/PortfolioProvider'

export default function AddPage() {
  const { addCoin, navigate } = usePortfolio()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [change, setChange] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = Number(amount)
    const parsedPrice = Number(price)
    const parsedChange = Number(change)
    if (symbol.trim().length === 0) {
      setError('Symbol is required')
      return
    }
    if (amount.trim().length === 0 || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a positive amount')
      return
    }
    if (price.trim().length === 0 || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Enter a positive price')
      return
    }
    const changeValue = change.trim().length === 0 || Number.isNaN(parsedChange) ? 0 : parsedChange
    setError('')
    addCoin({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim().length === 0 ? symbol.trim().toUpperCase() : name.trim(),
      amount: parsedAmount,
      price: parsedPrice,
      change24h: changeValue,
    })
    setSymbol('')
    setName('')
    setAmount('')
    setPrice('')
    setChange('')
    navigate('portfolio')
  }

  return (
    <section data-testid="page-add">
      <h1>Add coin</h1>
      <form data-testid="coin-form" onSubmit={onSubmit}>
        <input data-testid="symbol-input" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <input data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="amount-input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input data-testid="price-input" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input data-testid="change-input" value={change} onChange={(e) => setChange(e.target.value)} />
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-coin">
          Add coin
        </button>
      </form>
    </section>
  )
}
