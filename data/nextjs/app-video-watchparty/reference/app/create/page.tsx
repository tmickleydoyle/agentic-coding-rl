'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function CreatePage() {
  const { createParty } = useApp()
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('120')

  return (
    <section data-testid="page-create">
      <h1>Create Party</h1>
      <input
        data-testid="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        data-testid="time-input"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button data-testid="create-submit" onClick={() => createParty(title, Number(time))}>
        Create
      </button>
    </section>
  )
}
