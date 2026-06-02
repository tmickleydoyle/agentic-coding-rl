'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Palette() {
  const { colors, addColor, removeColor } = useApp()
  const [name, setName] = useState('')
  const [hex, setHex] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = filter.trim()
    ? colors.filter((c) => c.name.toLowerCase().includes(filter.trim().toLowerCase()))
    : colors

  return (
    <section aria-label="Palette view">
      <h1>Palette</h1>
      <div>
        <input
          aria-label="Color name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Hex code"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
        />
        <button
          onClick={() => {
            addColor(name, hex)
            setName('')
            setHex('')
          }}
        >
          Add color
        </button>
      </div>
      <div>
        <input
          aria-label="Filter colors"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul>
        {filtered.map((c) => (
          <li key={c.id}>
            <span
              aria-label={`Swatch for ${c.name}`}
              style={{ display: 'inline-block', width: 24, height: 24, backgroundColor: c.hex, border: '1px solid #ccc' }}
            />
            <span>{c.name}</span>
            <span>{c.hex}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeColor(c.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>{`Total colors: ${colors.length}`}</p>
    </section>
  )
}
