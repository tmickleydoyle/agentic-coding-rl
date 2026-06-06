'use client'
import { useState } from 'react'

interface Swatch {
  id: number
  name: string
  hex: string
}

const SEED_SWATCHES: Swatch[] = [
  { id: 1, name: 'Ocean Blue', hex: '#1E90FF' },
  { id: 2, name: 'Forest Green', hex: '#228B22' },
  { id: 3, name: 'Sunset Orange', hex: '#FF6347' },
  { id: 4, name: 'Lavender', hex: '#967BB6' },
  { id: 5, name: 'Charcoal', hex: '#36454F' },
]

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function toCssVar(name: string) {
  return `--${toSlug(name)}`
}

function buildCssOutput(swatches: Swatch[]): string {
  if (swatches.length === 0) return ':root {\n}'
  const lines = swatches.map(s => `  ${toCssVar(s.name)}: ${s.hex};`)
  return `:root {\n${lines.join('\n')}\n}`
}

export default function App() {
  const [swatches, setSwatches] = useState<Swatch[]>(SEED_SWATCHES.map(s => ({ ...s })))
  const [nextId, setNextId] = useState(6)
  const [colorName, setColorName] = useState('')
  const [hexValue, setHexValue] = useState('')

  function removeSwatch(id: number) {
    setSwatches(ss => ss.filter(s => s.id !== id))
  }

  function addSwatch() {
    const name = colorName.trim()
    const hex = hexValue.trim()
    if (!name || !HEX_PATTERN.test(hex)) return
    const duplicate = swatches.some(s => s.name.toLowerCase() === name.toLowerCase())
    if (duplicate) return
    const id = nextId
    setNextId(id + 1)
    setSwatches(ss => [...ss, { id, name, hex }])
    setColorName('')
    setHexValue('')
  }

  const cssOutput = buildCssOutput(swatches)

  return (
    <div>
      <h1>Color Palette</h1>

      <p>Swatches: <span data-testid="swatch-count">{swatches.length}</span></p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {swatches.map(s => {
          const slug = toSlug(s.name)
          return (
            <div key={s.id} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              <div
                data-testid={`swatch-box-${slug}`}
                style={{ width: 80, height: 80, backgroundColor: s.hex }}
              />
              <p data-testid={`swatch-name-${slug}`}>{s.name}</p>
              <p data-testid={`swatch-hex-${slug}`}>{s.hex}</p>
              <button aria-label={`Remove ${s.name}`} onClick={() => removeSwatch(s.id)}>Remove</button>
            </div>
          )
        })}
      </div>

      <div>
        <h2>Add Swatch</h2>
        <label>
          Color Name
          <input value={colorName} onChange={e => setColorName(e.target.value)} />
        </label>
        <label>
          Hex Value
          <input value={hexValue} onChange={e => setHexValue(e.target.value)} />
        </label>
        <button onClick={addSwatch}>Add Swatch</button>
      </div>

      <div>
        <h2>Export</h2>
        <button>Copy CSS Variables</button>
        <textarea
          data-testid="css-output"
          readOnly
          value={cssOutput}
        />
      </div>
    </div>
  )
}
