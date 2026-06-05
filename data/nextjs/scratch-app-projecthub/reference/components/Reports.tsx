'use client'
import { useApp } from '../hooks/useApp'
import type { Status } from '../lib/types'

export function Reports() {
  const { board } = useApp()
  const total = board.length
  const count = (s: Status) => board.filter((t) => t.status === s).length
  const pct = total === 0 ? 0 : Math.round((count('done') / total) * 100)
  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total tasks: ${total}`}</p>
      <p>{`To Do: ${count('todo')}`}</p>
      <p>{`Doing: ${count('doing')}`}</p>
      <p>{`Done: ${count('done')}`}</p>
      <p>{`Completion: ${pct}%`}</p>
    </section>
  )
}
