'use client'
import { useState } from 'react'
import type { Item } from './types'
import Toolbar from './Toolbar'

// TODO: track items and a set of selected ids. Render <Toolbar /> and a <ul data-testid="list">
// with a <li data-testid="row-<id>"> per remaining item, each with the label and an
// <input type="checkbox" data-testid="check-<id>"> reflecting selection (toggling adds/removes
// the id). Select all selects all listed items; Clear deselects all; Delete selected removes the
// checked rows and resets the selection to empty.
export default function BulkList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  return (
    <div>
      <Toolbar selectedCount={0} onSelectAll={() => {}} onClear={() => {}} onDelete={() => {}} />
      <ul data-testid="list" />
    </div>
  )
}
