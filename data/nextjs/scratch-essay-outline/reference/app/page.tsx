'use client'
import { useState } from 'react'

interface Section {
  id: number
  title: string
  bullets: string[]
  bulletInput: string
}

const SEED_SECTIONS: Array<{ id: number; title: string; bullets: string[] }> = [
  { id: 1, title: 'Introduction', bullets: ['Hook the reader', 'State the thesis'] },
  { id: 2, title: 'Body Paragraph 1', bullets: ['Topic sentence', 'Supporting evidence', 'Analysis'] },
]

export default function App() {
  const [essayTitle, setEssayTitle] = useState('')
  const [sections, setSections] = useState<Section[]>(
    SEED_SECTIONS.map(s => ({ ...s, bullets: [...s.bullets], bulletInput: '' }))
  )
  const [sectionInput, setSectionInput] = useState('')
  const [nextId, setNextId] = useState(3)

  function addSection() {
    if (!sectionInput.trim()) return
    setSections(ss => [...ss, { id: nextId, title: sectionInput.trim(), bullets: [], bulletInput: '' }])
    setNextId(n => n + 1)
    setSectionInput('')
  }

  function deleteSection(id: number) {
    setSections(ss => ss.filter(s => s.id !== id))
  }

  function updateBulletInput(id: number, value: string) {
    setSections(ss => ss.map(s => s.id === id ? { ...s, bulletInput: value } : s))
  }

  function addBullet(id: number) {
    setSections(ss => ss.map(s => {
      if (s.id !== id) return s
      if (!s.bulletInput.trim()) return s
      return { ...s, bullets: [...s.bullets, s.bulletInput.trim()], bulletInput: '' }
    }))
  }

  function removeBullet(sectionId: number, bulletIndex: number) {
    setSections(ss => ss.map(s => {
      if (s.id !== sectionId) return s
      const bullets = s.bullets.filter((_, i) => i !== bulletIndex)
      return { ...s, bullets }
    }))
  }

  const totalBullets = sections.reduce((sum, s) => sum + s.bullets.length, 0)

  return (
    <div>
      <h1>Essay Outline</h1>

      <div>
        <input
          aria-label="Essay Title"
          data-testid="essay-title-input"
          value={essayTitle}
          onChange={e => setEssayTitle(e.target.value)}
        />
        <p data-testid="essay-title-display">{essayTitle.trim() || 'Untitled Essay'}</p>
      </div>

      <div>
        <input
          aria-label="Section Title"
          value={sectionInput}
          onChange={e => setSectionInput(e.target.value)}
        />
        <button onClick={addSection}>Add Section</button>
      </div>

      <div>
        {sections.map(s => (
          <div key={s.id} data-testid="section-item">
            <span data-testid="section-title">{s.title}</span>
            <button onClick={() => deleteSection(s.id)}>Delete Section</button>
            <div>
              <input
                aria-label={`Bullet for ${s.title}`}
                value={s.bulletInput}
                onChange={e => updateBulletInput(s.id, e.target.value)}
              />
              <button onClick={() => addBullet(s.id)}>Add Bullet</button>
            </div>
            <ul>
              {s.bullets.map((b, i) => (
                <li key={i} data-testid="bullet-item">
                  <span data-testid="bullet-text">{b}</span>
                  <button onClick={() => removeBullet(s.id, i)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p data-testid="section-count">Sections: {sections.length}</p>
      <p data-testid="bullet-count">Bullets: {totalBullets}</p>
    </div>
  )
}
