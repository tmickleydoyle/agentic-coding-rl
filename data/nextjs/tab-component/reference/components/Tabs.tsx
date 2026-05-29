'use client'
import { useState } from 'react'

type Tab = { label: string; content: string }

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0)
  const safeActive = Math.min(active, Math.max(tabs.length - 1, 0))
  const activePanel = tabs[safeActive]?.content ?? ''

  return (
    <div>
      <div role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            data-testid={`tab-${t.label}`}
            aria-selected={i === safeActive}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div data-testid="panel">{activePanel}</div>
    </div>
  )
}
