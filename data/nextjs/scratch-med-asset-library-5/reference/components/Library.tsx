'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AssetType } from '../lib/types'

const TYPES: AssetType[] = ['logo', 'icon', 'photo']

export function Library() {
  const { assets, addAsset, deleteAsset, activeFilter, setFilter } = useApp()
  const [name, setName] = useState('')
  const [type, setType] = useState<AssetType>('logo')
  const [tags, setTags] = useState('')

  const countOf = (t: AssetType) => assets.filter((a) => a.type === t).length
  const allCount = assets.length

  const visible = activeFilter === 'all' ? assets : assets.filter((a) => a.type === activeFilter)

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
        <button onClick={() => setFilter('all')} aria-pressed={activeFilter === 'all'}>
          {`All (${allCount})`}
        </button>
        {TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(t)} aria-pressed={activeFilter === t}>
            {`${t} (${countOf(t)})`}
          </button>
        ))}
      </div>
      <ul>
        {visible.map((a) => (
          <li key={a.id}>
            <span>{a.name}</span>
            <span>{a.type}</span>
            <span>{a.tags}</span>
            <button aria-label={`Delete ${a.name}`} onClick={() => deleteAsset(a.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
