'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Colors() {
  const { colors, addColor, deleteColor, filterShortHex } = useApp()
  const [name, setName] = useState('')
  const [hex, setHex] = useState('')

  const visible = filterShortHex ? colors.filter((c) => c.hex.length > 4) : colors

  return (
    <section aria-label="Colors view">
      <h1>Colors</h1>
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
      <p>{`Total colors: ${colors.length}`}</p>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <div
              aria-label={`Swatch for ${c.name}`}
              style={{ background: c.hex, width: 24, height: 24, display: 'inline-block' }}
            />
            <span>{c.name}</span>
            <span>{c.hex}</span>
            <button aria-label={`Delete ${c.name}`} onClick={() => deleteColor(c.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
