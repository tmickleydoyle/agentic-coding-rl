'use client'
import { useState } from 'react'
import type { Option } from './types'
import Chip from './Chip'
import Dropdown from './Dropdown'

export default function MultiSelect({ options }: { options: Option[] }) {
  const [selected, setSelected] = useState<string[]>([])

  const add = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }
  const remove = (id: string) => {
    setSelected((prev) => prev.filter((s) => s !== id))
  }

  const byId = (id: string) => options.find((o) => o.id === id)!
  const available = options.filter((o) => !selected.includes(o.id))

  return (
    <div>
      <div data-testid="chips">
        {selected.map((id) => (
          <Chip key={id} option={byId(id)} onRemove={remove} />
        ))}
      </div>
      <Dropdown options={available} onSelect={add} />
    </div>
  )
}
