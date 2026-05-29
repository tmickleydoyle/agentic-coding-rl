'use client'
import { useState } from 'react'

type Tab = { label: string; content: string }

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  // TODO: track the active tab index, render one button per tab with role="tab" and
  // data-testid="tab-<label>", and show the active tab's content in a panel with
  // data-testid="panel". The active button must have aria-selected="true".
  return (
    <div>
      <div role="tablist">
        {tabs.map((t) => (
          <button key={t.label} role="tab" data-testid={`tab-${t.label}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div data-testid="panel"></div>
    </div>
  )
}
