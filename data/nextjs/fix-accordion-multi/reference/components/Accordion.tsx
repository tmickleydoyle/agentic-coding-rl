'use client'
import { useState } from 'react'

const PANELS = ['Alpha', 'Beta', 'Gamma']

export default function Accordion() {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const toggle = (name: string) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div>
      {PANELS.map((name) => (
        <section key={name}>
          <button data-testid={`header-${name}`} onClick={() => toggle(name)}>
            {name}
          </button>
          {open[name] && <div data-testid={`body-${name}`}>Body of {name}</div>}
        </section>
      ))}
    </div>
  )
}
