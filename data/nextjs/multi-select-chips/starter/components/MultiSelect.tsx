'use client'
import { useState } from 'react'
import type { Option } from './types'
import Chip from './Chip'
import Dropdown from './Dropdown'

// TODO: track selected option ids (selection order). Render <div data-testid="chips"> with a
// Chip per selected option, and a Dropdown given only the not-yet-selected options. Selecting
// adds a chip; removing a chip deselects (so it reappears in the dropdown).
export default function MultiSelect({ options }: { options: Option[] }) {
  const [selected, setSelected] = useState<string[]>([])
  return (
    <div>
      <div data-testid="chips" />
      <Dropdown options={options} onSelect={() => {}} />
    </div>
  )
}
