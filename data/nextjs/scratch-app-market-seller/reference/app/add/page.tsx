'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddPage() {
  const { addProduct, navigate } = useApp()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    addProduct({
      name: name.trim(),
      price: price.length > 0 ? Number(price) : 0,
      stock: stock.length > 0 ? Number(stock) : 0,
    })
    setName('')
    setPrice('')
    setStock('')
    navigate('products')
  }

  return (
    <section data-testid="page-add">
      <h1>Add a product</h1>
      <form data-testid="add-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          data-testid="price-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          type="number"
          data-testid="stock-input"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-product">
          Add product
        </button>
      </form>
    </section>
  )
}
