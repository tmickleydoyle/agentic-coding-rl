'use client'
import { useRef, useState } from 'react'

const IDS = [1, 2, 3]

export default function SelectAll() {
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [allChecked, setAllChecked] = useState(false)
  const headerRef = useRef<HTMLInputElement>(null)

  const toggleRow = (id: number) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAll = () => {
    const next = !allChecked
    setAllChecked(next)
    const map: Record<number, boolean> = {}
    for (const id of IDS) map[id] = next
    setSelected(map)
  }

  return (
    <div>
      <label>
        <input
          ref={headerRef}
          type="checkbox"
          data-testid="select-all"
          checked={allChecked}
          onChange={toggleAll}
        />
        Select all
      </label>
      <ul>
        {IDS.map((id) => (
          <li key={id}>
            <input
              type="checkbox"
              data-testid={`row-${id}`}
              checked={!!selected[id]}
              onChange={() => toggleRow(id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
