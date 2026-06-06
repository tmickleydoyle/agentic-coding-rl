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
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')

  const activeTab = tabs.find(t => t.id === activeId)

  return (
    <div>
      <div role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div data-testid="tab-panel" role="tabpanel">
          {activeTab.content}
        </div>
      )}
    </div>
  )
}
