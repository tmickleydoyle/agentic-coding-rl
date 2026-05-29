'use client'
import { useEffect, useRef, useState } from 'react'

const IDS = [1, 2, 3]

export default function SelectAll() {
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const headerRef = useRef<HTMLInputElement>(null)

  const selectedCount = IDS.filter((id) => selected[id]).length
  const allChecked = selectedCount === IDS.length
  const someChecked = selectedCount > 0 && selectedCount < IDS.length

  useEffect(() => {
    if (headerRef.current) headerRef.current.indeterminate = someChecked
  }, [someChecked])

  const toggleRow = (id: number) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAll = () => {
    const next = !allChecked
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
