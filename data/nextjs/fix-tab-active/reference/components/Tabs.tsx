'use client'
import { useState } from 'react'

const INITIAL = ['Home', 'Profile', 'Settings']

export default function Tabs() {
  const [tabs, setTabs] = useState<string[]>(INITIAL)
  const [active, setActive] = useState(0)

  const close = (index: number) => {
    setTabs((prev) => prev.filter((_, i) => i !== index))
    setActive((prevActive) => {
      if (index < prevActive) return prevActive - 1
      if (index === prevActive) return Math.max(0, prevActive - 1)
      return prevActive
    })
  }

  return (
    <div>
      <div role="tablist">
        {tabs.map((name, i) => (
          <span key={name}>
            <button
              data-testid={`tab-${name}`}
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}
            >
              {name}
            </button>
            <button data-testid={`close-${name}`} onClick={() => close(i)}>
              x
            </button>
          </span>
        ))}
      </div>
      <div data-testid="panel">{tabs[active] ? `Content: ${tabs[active]}` : ''}</div>
    </div>
  )
}
