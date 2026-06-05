'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Colors() {
  const { colors, addColor, deleteColor } = useApp()
  const [name, setName] = useState('')
  const [hex, setHex] = useState('')

  function handleAdd() {
    addColor(name, hex)
    setName('')
    setHex('')
  }

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
        <button onClick={handleAdd}>Add color</button>
      </div>
      <p>{`Total colors: ${colors.length}`}</p>
      {colors.length === 0 ? (
        <p>No colors yet</p>
      ) : (
        <ul>
          {colors.map((c) => (
            <li key={c.id}>
              <span
                aria-label={`Swatch for ${c.name}`}
                style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  backgroundColor: c.hex,
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
      )}
    </section>
  )
}
