'use client'
import React, { useEffect, useState } from 'react'
import { Transaction } from '../../lib/types'
export function TransactionsPage() {
  const [txs, setTxs] = useState<Transaction[]>([])
  const [symbol, setSymbol] = useState('')
  const [type, setType] = useState<'buy'|'sell'>('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState('')
  function load() { fetch('/api/transactions').then(r=>r.json()).then(setTxs) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/transactions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({symbol,type,quantity:Number(quantity),price:Number(price),date})})
      .then(()=>{setSymbol('');setQuantity('');setPrice('');setDate('');load()})
  }
  return <div style={{padding:'2rem'}}><h1>Transactions</h1>
    <ul data-testid="transaction-list" style={{listStyle:'none',padding:0}}>
      {txs.map(t=><li key={t.id} data-testid="transaction-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{t.symbol}</strong> {t.type} {t.quantity} @ ${t.price} on {t.date}
      </li>)}
    </ul>
    <h2>Add Transaction</h2>
    <form data-testid="add-transaction-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="transaction-symbol-input" placeholder="Symbol" value={symbol} onChange={e=>setSymbol(e.target.value)} required/>
      <select data-testid="transaction-type-select" value={type} onChange={e=>setType(e.target.value as 'buy'|'sell')}><option value="buy">buy</option><option value="sell">sell</option></select>
      <input data-testid="transaction-quantity-input" type="number" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)} required/>
      <input data-testid="transaction-price-input" type="number" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} required/>
      <input data-testid="transaction-date-input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
      <button data-testid="submit-transaction" type="submit">Add</button>
    </form>
  </div>
}
