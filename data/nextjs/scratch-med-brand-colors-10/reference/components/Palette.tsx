'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Palette() {
  const { colors, addColor, deleteColor } = useApp()
  const [name, setName] = useState('')
  const [hex, setHex] = useState('')

  return (
    <section aria-label="Palette view">
      <h1>Palette</h1>
      <p>{`Total colors: ${colors.length}`}</p>
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
      <ul>
        {colors.map((c) => (
          <li key={c.id}>
            <span
              aria-label={`Swatch for ${c.name}`}
              style={{
                display: 'inline-block',
                width: '1.5rem',
                height: '1.5rem',
                background: c.hex,
                border: '1px solid #ccc',
              }}
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
