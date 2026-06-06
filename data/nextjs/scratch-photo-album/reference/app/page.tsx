'use client'
import { useState } from 'react'

interface Photo {
  id: number
  title: string
  url: string
  description: string
  date: string
}

const SEED: Photo[] = [
  { id: 1, title: 'Beach Sunset', url: 'https://picsum.photos/seed/beach/400/300', description: 'Golden hour at the coast', date: '2024-06-15' },
  { id: 2, title: 'Mountain Hike', url: 'https://picsum.photos/seed/mountain/400/300', description: 'Summit view after a long climb', date: '2024-08-22' },
  { id: 3, title: 'City Lights', url: 'https://picsum.photos/seed/city/400/300', description: 'Downtown at night', date: '2024-11-10' },
]

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(SEED.map(p => ({ ...p })))
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')
  const [nextId, setNextId] = useState(4)

  function handleAdd() {
    if (!title.trim() || !url.trim()) {
      setError('Title and URL are required')
      return
    }
    setError('')
    setPhotos(prev => [...prev, { id: nextId, title: title.trim(), url: url.trim(), description: description.trim(), date }])
    setNextId(n => n + 1)
    setTitle('')
    setUrl('')
    setDescription('')
    setDate('')
  }

  function handleDelete(id: number) {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <h1>Photo Album</h1>
      <p data-testid="photo-count">{photos.length} photos</p>

      {photos.length === 0 ? (
        <p data-testid="empty-state">No photos yet</p>
      ) : (
        <div data-testid="photo-grid">
          {photos.map(photo => (
            <div key={photo.id} data-testid="photo-card">
              <img src={photo.url} alt={photo.title} />
              <h2 data-testid="photo-title">{photo.title}</h2>
              <p data-testid="photo-date">{photo.date}</p>
              <p data-testid="photo-description">{photo.description}</p>
              <button data-testid="delete-btn" onClick={() => handleDelete(photo.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div data-testid="add-form">
        <h2>Add Photo</h2>
        {error && <p data-testid="form-error">{error}</p>}
        <label>
          Title
          <input
            data-testid="input-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label>
          URL
          <input
            data-testid="input-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </label>
        <label>
          Description
          <input
            data-testid="input-description"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <label>
          Date
          <input
            data-testid="input-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
        <button data-testid="add-btn" onClick={handleAdd}>Add Photo</button>
      </div>
    </div>
  )
}
