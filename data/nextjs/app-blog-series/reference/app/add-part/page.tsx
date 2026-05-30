'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddPartPage() {
  const { series, currentSeriesId, addPart, selectSeries, navigate } = useApp()
  const [seriesId, setSeriesId] = useState(currentSeriesId ?? series[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addPart({ seriesId, title: title.trim() })
    selectSeries(seriesId)
    setTitle('')
    navigate('series-detail')
  }

  return (
    <section data-testid="page-add-part">
      <h1>Add part</h1>
      <form data-testid="add-part-form" onSubmit={onSubmit}>
        <label htmlFor="series">Series</label>
        <select
          id="series"
          data-testid="series-select"
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value)}
        >
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-part">
          Add part
        </button>
      </form>
    </section>
  )
}
