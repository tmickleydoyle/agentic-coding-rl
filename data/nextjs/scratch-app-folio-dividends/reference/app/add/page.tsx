'use client'
import { useState } from 'react'
import { useDividends } from '../../components/DividendsProvider'
import { MONTH_NAMES } from '../../lib/types'

export default function AddPage() {
  const { addHolding, navigate } = useDividends()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [shares, setShares] = useState('')
  const [perShare, setPerShare] = useState('')
  const [month, setMonth] = useState('1')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedShares = Number(shares)
    const parsedPerShare = Number(perShare)
    if (symbol.trim().length === 0) {
      setError('Symbol is required')
      return
    }
    if (shares.trim().length === 0 || Number.isNaN(parsedShares) || parsedShares <= 0) {
      setError('Enter positive shares')
      return
    }
    if (perShare.trim().length === 0 || Number.isNaN(parsedPerShare) || parsedPerShare <= 0) {
      setError('Enter a positive dividend per share')
      return
    }
    setError('')
    addHolding({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim().length === 0 ? symbol.trim().toUpperCase() : name.trim(),
      shares: parsedShares,
      dividendPerShare: parsedPerShare,
      payMonth: Number(month),
    })
    setSymbol('')
    setName('')
    setShares('')
    setPerShare('')
    setMonth('1')
    navigate('dashboard')
  }

  return (
    <section data-testid="page-add">
      <h1>Add holding</h1>
      <form data-testid="holding-form" onSubmit={onSubmit}>
        <input data-testid="symbol-input" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <input data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />
        <input data-testid="shares-input" value={shares} onChange={(e) => setShares(e.target.value)} />
        <input
          data-testid="per-share-input"
          value={perShare}
          onChange={(e) => setPerShare(e.target.value)}
        />
        <select data-testid="month-input" value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={String(i + 1)}>
              {m}
            </option>
          ))}
        </select>
        {error ? <p data-testid="form-error">{error}</p> : null}
        <button type="submit" data-testid="submit-holding">
          Add holding
        </button>
      </form>
    </section>
  )
}
