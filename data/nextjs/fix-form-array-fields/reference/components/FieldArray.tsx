'use client'
import { useRef, useState } from 'react'

interface Row {
  id: number
  value: string
}

export default function FieldArray() {
  const nextId = useRef(1)
  const [rows, setRows] = useState<Row[]>([{ id: 0, value: '' }])

  const add = () => {
    setRows((prev) => [...prev, { id: nextId.current++, value: '' }])
  }

  const remove = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const update = (id: number, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)))
  }

  return (
    <div>
      <button data-testid="add" onClick={add}>
        Add
      </button>
      {rows.map((row, i) => (
        <div key={row.id}>
          <input
            data-testid={`field-${i}`}
            value={row.value}
            onChange={(e) => update(row.id, e.target.value)}
          />
          <button data-testid={`remove-${i}`} onClick={() => remove(row.id)}>
            Remove
          </button>
        </div>
      ))}
      <span data-testid="values">{rows.map((r) => r.value).join(',')}</span>
    </div>
  )
}
