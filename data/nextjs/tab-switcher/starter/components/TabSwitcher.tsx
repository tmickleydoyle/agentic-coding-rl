'use client'
import { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: string
}

interface TabSwitcherProps {
  tabs: Tab[]
}

export default function TabSwitcher({ tabs }: TabSwitcherProps) {
  const [_activeId] = useState(tabs[0]?.id ?? '')

  return (
    <div>
      <div role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            role="tab"
            aria-selected={false}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
