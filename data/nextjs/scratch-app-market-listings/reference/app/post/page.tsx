'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import type { Category } from '../../lib/types'
import { CATEGORIES } from '../../lib/types'

export default function PostPage() {
  const { addListing, navigate } = useApp()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>(CATEGORIES[0])
  const [price, setPrice] = useState('')
  const [seller, setSeller] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addListing({
      title: title.trim(),
      category,
      price: price.length > 0 ? Number(price) : 0,
      seller: seller.trim().length > 0 ? seller.trim() : 'unknown',
      description: description.trim(),
    })
    setTitle('')
    setPrice('')
    setSeller('')
    setDescription('')
    navigate('browse')
  }

  return (
    <section data-testid="page-post">
      <h1>Post a listing</h1>
      <form data-testid="post-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          data-testid="price-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label htmlFor="seller">Seller</label>
        <input
          id="seller"
          data-testid="seller-input"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          data-testid="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-listing">
          Post listing
        </button>
      </form>
    </section>
  )
}
