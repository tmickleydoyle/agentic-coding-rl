'use client'
import { useState } from 'react'

interface Movie {
  id: number
  title: string
  genre: string
  year: number
  rating: number
}

const GENRES = ['Sci-Fi', 'Drama', 'Action', 'Comedy', 'Horror', 'Mystery', 'Other']

const SEED: Movie[] = [
  { id: 1, title: 'The Matrix', genre: 'Sci-Fi', year: 1999, rating: 5 },
  { id: 2, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 4 },
  { id: 3, title: 'The Godfather', genre: 'Drama', year: 1972, rating: 5 },
  { id: 4, title: 'Knives Out', genre: 'Mystery', year: 2019, rating: 4 },
]

let nextId = SEED.length + 1

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(SEED.map(x => ({ ...x })))
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('Sci-Fi')
  const [year, setYear] = useState('')
  const [rating, setRating] = useState('3')
  const [filterGenre, setFilterGenre] = useState('All')
  const [sortBy, setSortBy] = useState('Year (newest)')

  function add() {
    const y = parseInt(year, 10)
    if (!title.trim() || !isFinite(y) || y < 1888 || y > 2100) return
    setMovies(xs => [...xs, { id: nextId++, title: title.trim(), genre, year: y, rating: parseInt(rating, 10) }])
    setTitle('')
    setGenre('Sci-Fi')
    setYear('')
    setRating('3')
  }

  function remove(id: number) {
    setMovies(xs => xs.filter(x => x.id !== id))
  }

  const avgRating = movies.length === 0 ? 0 : movies.reduce((s, m) => s + m.rating, 0) / movies.length

  let visible = filterGenre === 'All' ? [...movies] : movies.filter(m => m.genre === filterGenre)

  if (sortBy === 'Year (newest)') visible.sort((a, b) => b.year - a.year)
  else if (sortBy === 'Year (oldest)') visible.sort((a, b) => a.year - b.year)
  else if (sortBy === 'Rating (highest)') visible.sort((a, b) => b.rating - a.rating)
  else if (sortBy === 'Rating (lowest)') visible.sort((a, b) => a.rating - b.rating)
  else if (sortBy === 'Title (A-Z)') visible.sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div>
      <h1>Movie Log</h1>

      <div>
        <input aria-label="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <select aria-label="Genre" value={genre} onChange={e => setGenre(e.target.value)}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <input aria-label="Year" type="number" value={year} onChange={e => setYear(e.target.value)} />
        <select aria-label="Rating" value={rating} onChange={e => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={add}>Add Movie</button>
      </div>

      <div>
        <select aria-label="Filter genre" value={filterGenre} onChange={e => setFilterGenre(e.target.value)}>
          <option value="All">All</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select aria-label="Sort by" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {['Year (newest)', 'Year (oldest)', 'Rating (highest)', 'Rating (lowest)', 'Title (A-Z)'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p data-testid="movie-count">{visible.length} movies</p>
      <p data-testid="avg-rating">Avg: {avgRating.toFixed(1)} ★</p>

      <ul>
        {visible.map(m => (
          <li key={m.id} data-testid="movie-row">
            {m.title} | {m.genre} | {m.year} | ★ {m.rating}
            <button onClick={() => remove(m.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
