'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Product, Category } from '../../lib/types'

export function ProductsPage() {
  const { triggerRefresh } = useApp()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [stock, setStock] = useState('')

  function load() {
    fetch('/api/products').then(r => r.json()).then(setProducts)
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, sku, price: Number(price), categoryId, stock: Number(stock) }),
    })
    setName(''); setSku(''); setPrice(''); setCategoryId(''); setStock('')
    load(); triggerRefresh()
  }

  async function handleToggle(id: string) {
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toggle: true }),
    })
    load(); triggerRefresh()
  }

  function catName(id: string) { return categories.find(c => c.id === id)?.name ?? id }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Products</h1>
      <form data-testid="add-product-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-product-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-product-sku" value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU" required />
        <input data-testid="input-product-price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" required />
        <select data-testid="select-product-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input data-testid="input-product-stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" required />
        <button data-testid="btn-add-product" type="submit">Add Product</button>
      </form>
      <ul data-testid="product-list" style={{ listStyle: 'none', padding: 0 }}>
        {products.map(p => (
          <li key={p.id} data-testid="product-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <span data-testid="product-name" style={{ fontWeight: 'bold' }}>{p.name}</span>
              {' | '}
              <span data-testid="product-sku">{p.sku}</span>
              {' | $'}
              <span data-testid="product-price">{p.price.toFixed(2)}</span>
              {' | Stock: '}
              <span data-testid="product-stock">{p.stock}</span>
            </span>
            <button data-testid="btn-toggle-active" onClick={() => handleToggle(p.id)}>{p.active ? 'Deactivate' : 'Activate'}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
