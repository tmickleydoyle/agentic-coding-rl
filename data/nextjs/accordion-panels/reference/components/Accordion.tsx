'use client'
import { useState } from 'react'

export default function Accordion({ panels }: { panels: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      {panels.map((p, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i}>
            <button
              data-testid={`header-${i}`}
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              {p.title}
            </button>
            {isOpen && <p data-testid={`body-${i}`}>{p.body}</p>}
          </div>
        )
      })}
    </div>
  )
}
