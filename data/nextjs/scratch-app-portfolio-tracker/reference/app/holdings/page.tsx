'use client'
import React, { useEffect, useState } from 'react'
import { Holding } from '../../lib/types'
export function HoldingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  function load() { fetch('/api/holdings').then(r=>r.json()).then(setHoldings) }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/holdings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({symbol,name,quantity:Number(quantity),purchasePrice:Number(purchasePrice),currentPrice:Number(currentPrice)})})
      .then(()=>{setSymbol('');setName('');setQuantity('');setPurchasePrice('');setCurrentPrice('');load()})
  }
  function handleDelete(id: string) {
    fetch('/api/holdings',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load())
  }
  return <div style={{padding:'2rem'}}><h1>Holdings</h1>
    <ul data-testid="holding-list" style={{listStyle:'none',padding:0}}>
      {holdings.map(h=><li key={h.id} data-testid="holding-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{h.symbol}</strong> {h.name} — qty: {h.quantity} | buy: ${h.purchasePrice} | now: ${h.currentPrice} | G/L: ${((h.currentPrice-h.purchasePrice)*h.quantity).toFixed(2)}
        <button data-testid="delete-holding" onClick={()=>handleDelete(h.id)} style={{marginLeft:'1rem'}}>Delete</button>
      </li>)}
    </ul>
    <h2>Add Holding</h2>
    <form data-testid="add-holding-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="holding-symbol-input" placeholder="Symbol" value={symbol} onChange={e=>setSymbol(e.target.value)} required/>
      <input data-testid="holding-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="holding-quantity-input" type="number" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)} required/>
      <input data-testid="holding-purchase-price-input" type="number" placeholder="Purchase Price" value={purchasePrice} onChange={e=>setPurchasePrice(e.target.value)} required/>
      <input data-testid="holding-current-price-input" type="number" placeholder="Current Price" value={currentPrice} onChange={e=>setCurrentPrice(e.target.value)} required/>
      <button data-testid="submit-holding" type="submit">Add</button>
    </form>
  </div>
}
