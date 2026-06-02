'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AssetType } from '../lib/types'

const TYPES: AssetType[] = ['logo', 'icon', 'photo']

export function Library() {
  const { assets, filter, addAsset, deleteAsset, setFilter } = useApp()
  const [name, setName] = useState('')
  const [type, setType] = useState<AssetType>('logo')
  const [tags, setTags] = useState('')

  const filtered = filter === 'All' ? assets : assets.filter((a) => a.type === filter)
  const total = assets.length
  const shown = filtered.length

  return (
    <section aria-label="Library view">
      <h1>Library</h1>
      <div>
        <input
          aria-label="Asset name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          aria-label="Asset type"
          value={type}
          onChange={(e) => setType(e.target.value as AssetType)}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          aria-label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button
          onClick={() => {
            addAsset(name, type, tags)
            setName('')
            setTags('')
          }}
        >
          Add asset
        </button>
      </div>
      <div>
        <select
          aria-label="Filter by type"
          value={filter}
          onChange={(e) => setFilter(e.target.value as AssetType | 'All')}
        >
          <option value="All">All</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <p>{`Showing: ${shown} of ${total}`}</p>
      <ul>
        {filtered.map((a) => (
          <li key={a.id}>
            <span>{`${a.name} (${a.type})`}</span>
            {a.tags ? <span>{a.tags}</span> : null}
            <button aria-label={`Delete ${a.name}`} onClick={() => deleteAsset(a.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
