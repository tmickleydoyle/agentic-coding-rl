'use client'
import { useState } from 'react'
import { usePlatform } from '../hooks/usePlatform'

export function Releases() {
  const { releases, addRelease } = usePlatform()
  const [name, setName] = useState('')
  return (
    <section aria-label="Releases view">
      <h1>Releases</h1>
      <input aria-label="Release name" value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          addRelease(name)
          setName('')
        }}
      >
        Add release
      </button>
      <ul>
        {releases.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </section>
  )
}
