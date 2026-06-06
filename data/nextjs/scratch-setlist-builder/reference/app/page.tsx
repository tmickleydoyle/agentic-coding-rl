'use client'
import { useState } from 'react'

interface Song {
  id: number
  title: string
  artist: string
  duration: number
  key: string
}

const SEED: Song[] = [
  { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354, key: 'Bb' },
  { id: 2, title: 'Hotel California', artist: 'Eagles', duration: 391, key: 'Bm' },
  { id: 3, title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482, key: 'Am' },
  { id: 4, title: "Sweet Child O' Mine", artist: "Guns N' Roses", duration: 356, key: 'D' },
  { id: 5, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: 301, key: 'Fm' },
]

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatTotal(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export default function App() {
  const [songs, setSongs] = useState<Song[]>(SEED.map(s => ({ ...s })))
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [duration, setDuration] = useState('')
  const [key, setKey] = useState('')

  const handleAdd = () => {
    const dur = parseInt(duration, 10)
    if (!title.trim() || !dur) return
    const newId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1
    setSongs([...songs, { id: newId, title: title.trim(), artist, duration: dur, key }])
    setTitle('')
    setArtist('')
    setDuration('')
    setKey('')
  }

  const handleRemove = (id: number) => {
    setSongs(songs.filter(s => s.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...songs]
    const tmp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = tmp
    setSongs(updated)
  }

  const moveDown = (index: number) => {
    if (index === songs.length - 1) return
    const updated = [...songs]
    const tmp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = tmp
    setSongs(updated)
  }

  const totalSeconds = songs.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div>
      <h1>Setlist Builder</h1>

      <div>
        <span data-testid="song-count">{songs.length}</span>
        <span data-testid="total-duration">{formatTotal(totalSeconds)}</span>
      </div>

      <div>
        <h2>Add Song</h2>
        <input
          aria-label="Title"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-testid="input-title"
        />
        <input
          aria-label="Artist"
          placeholder="Artist"
          value={artist}
          onChange={e => setArtist(e.target.value)}
          data-testid="input-artist"
        />
        <input
          type="number"
          aria-label="Duration (seconds)"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          data-testid="input-duration"
        />
        <input
          aria-label="Key"
          placeholder="Key"
          value={key}
          onChange={e => setKey(e.target.value)}
          data-testid="input-key"
        />
        <button onClick={handleAdd} data-testid="btn-add">Add Song</button>
      </div>

      <ol data-testid="setlist">
        {songs.map((s, index) => (
          <li key={s.id} data-testid={`song-item-${s.id}`}>
            <span data-testid={`song-position-${s.id}`}>{index + 1}</span>
            <span data-testid={`song-title-${s.id}`}>{s.title}</span>
            <span data-testid={`song-artist-${s.id}`}>{s.artist}</span>
            <span data-testid={`song-key-${s.id}`}>{s.key}</span>
            <span data-testid={`song-duration-${s.id}`}>{formatDuration(s.duration)}</span>
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              data-testid={`move-up-${s.id}`}
            >Move Up</button>
            <button
              onClick={() => moveDown(index)}
              disabled={index === songs.length - 1}
              data-testid={`move-down-${s.id}`}
            >Move Down</button>
            <button onClick={() => handleRemove(s.id)} data-testid={`remove-btn-${s.id}`}>Remove</button>
          </li>
        ))}
      </ol>
    </div>
  )
}
