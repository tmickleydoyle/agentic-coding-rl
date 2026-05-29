'use client'
import { useState } from 'react'

export default function FieldArray() {
  // BUG: row count is tracked, but values are keyed by display INDEX. When a middle
  // row is removed the rows below shift up an index and read the wrong value, so the
  // removed row's value "sticks" to its old position.
  const [count, setCount] = useState(1)
  const [values, setValues] = useState<Record<number, string>>({ 0: '' })

  const add = () => {
    setValues((prev) => ({ ...prev, [count]: '' }))
    setCount((c) => c + 1)
  }

  const remove = (index: number) => {
    setValues((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })
    setCount((c) => c - 1)
  }

  const update = (index: number, value: string) => {
    setValues((prev) => ({ ...prev, [index]: value }))
  }

  const indices = Array.from({ length: count }, (_, i) => i)

  return (
    <div>
      <button data-testid="add" onClick={add}>
        Add
      </button>
      {indices.map((i) => (
        <div key={i}>
          <input
            data-testid={`field-${i}`}
            value={values[i] ?? ''}
            onChange={(e) => update(i, e.target.value)}
          />
          <button data-testid={`remove-${i}`} onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}
      <span data-testid="values">{indices.map((i) => values[i] ?? '').join(',')}</span>
    </div>
  )
}
