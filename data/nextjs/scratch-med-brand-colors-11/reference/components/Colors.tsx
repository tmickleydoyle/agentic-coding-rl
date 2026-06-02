'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Colors() {
  const { colors, addColor, removeColor } = useApp()
  const [name, setName] = useState('')
  const [hex, setHex] = useState('')

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
        {colors.map((c) => (
          <li key={c.id}>
            <span
              aria-label={`Swatch for ${c.name}`}
              style={{
                display: 'inline-block',
                width: '1rem',
                height: '1rem',
                backgroundColor: c.hex,
              }}
            />
            <span>{c.name}</span>
            <span>{c.hex}</span>
            <button aria-label={`Remove ${c.name}`} onClick={() => removeColor(c.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
