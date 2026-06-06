'use client'
import { useState } from 'react'

interface Artwork {
  id: number
  title: string
  medium: string
  year: number
  forSale: boolean
  price: number
}

const SEED: Artwork[] = [
  { id: 1, title: 'Sunset Over Hills', medium: 'Oil on Canvas', year: 2021, forSale: true, price: 450 },
  { id: 2, title: 'Urban Fragments', medium: 'Watercolor', year: 2022, forSale: false, price: 0 },
  { id: 3, title: 'Silent Forest', medium: 'Acrylic', year: 2023, forSale: true, price: 320 },
  { id: 4, title: 'Abstract Mind', medium: 'Mixed Media', year: 2020, forSale: false, price: 0 },
]

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>(SEED.map(x => ({ ...x })))
  const [filterText, setFilterText] = useState('')
  const [filterForSale, setFilterForSale] = useState(false)

  const [inputTitle, setInputTitle] = useState('')
  const [inputMedium, setInputMedium] = useState('')
  const [inputYear, setInputYear] = useState('')
  const [inputPrice, setInputPrice] = useState('')
  const [inputForSale, setInputForSale] = useState(false)
  const [formError, setFormError] = useState(false)

  const nextId = () => Math.max(0, ...artworks.map(a => a.id)) + 1

  const filtered = artworks.filter(a => {
    const matchText = a.title.toLowerCase().includes(filterText.toLowerCase())
    const matchSale = filterForSale ? a.forSale : true
    return matchText && matchSale
  })

  const handleToggleSale = (id: number) => {
    setArtworks(prev => prev.map(a =>
      a.id === id ? { ...a, forSale: !a.forSale, price: a.forSale ? 0 : a.price } : a
    ))
  }

  const handleDelete = (id: number) => {
    setArtworks(prev => prev.filter(a => a.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const year = parseInt(inputYear, 10)
    if (!inputTitle.trim() || !inputMedium.trim() || isNaN(year) || year < 1900 || year > 2099) {
      setFormError(true)
      return
    }
    setFormError(false)
    const newArtwork: Artwork = {
      id: nextId(),
      title: inputTitle.trim(),
      medium: inputMedium.trim(),
      year,
      forSale: inputForSale,
      price: inputForSale ? parseFloat(inputPrice) || 0 : 0,
    }
    setArtworks(prev => [...prev, newArtwork])
    setInputTitle('')
    setInputMedium('')
    setInputYear('')
    setInputPrice('')
    setInputForSale(false)
  }

  return (
    <div>
      <h1>Art Portfolio</h1>
      <span data-testid="artwork-count">{artworks.length} works</span>

      <div>
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Search by title"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <label>
          <input
            data-testid="filter-for-sale"
            type="checkbox"
            checked={filterForSale}
            onChange={e => setFilterForSale(e.target.checked)}
          />
          For Sale Only
        </label>
      </div>

      <div>
        {filtered.map(a => (
          <div key={a.id} data-testid="artwork-card">
            <span data-testid="artwork-title">{a.title}</span>
            <span data-testid="artwork-medium">{a.medium}</span>
            <span data-testid="artwork-year">{a.year}</span>
            <span data-testid="artwork-price">{a.forSale ? `$${a.price}` : 'Not for Sale'}</span>
            <button
              data-testid="toggle-sale"
              onClick={() => handleToggleSale(a.id)}
            >
              {a.forSale ? 'Remove from Sale' : 'Mark For Sale'}
            </button>
            <button
              data-testid="delete-artwork"
              onClick={() => handleDelete(a.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form data-testid="add-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-title"
          type="text"
          placeholder="Title"
          value={inputTitle}
          onChange={e => setInputTitle(e.target.value)}
        />
        <input
          data-testid="input-medium"
          type="text"
          placeholder="Medium"
          value={inputMedium}
          onChange={e => setInputMedium(e.target.value)}
        />
        <input
          data-testid="input-year"
          type="number"
          placeholder="Year"
          value={inputYear}
          onChange={e => setInputYear(e.target.value)}
        />
        <input
          data-testid="input-price"
          type="number"
          placeholder="Price"
          value={inputPrice}
          onChange={e => setInputPrice(e.target.value)}
        />
        <label>
          <input
            data-testid="input-for-sale"
            type="checkbox"
            checked={inputForSale}
            onChange={e => setInputForSale(e.target.checked)}
          />
          For Sale
        </label>
        <button data-testid="submit-artwork" type="submit">Add Artwork</button>
        {formError && (
          <span data-testid="form-error">Please fill in all required fields correctly.</span>
        )}
      </form>
    </div>
  )
}
