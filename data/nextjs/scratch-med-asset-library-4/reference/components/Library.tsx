'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { AssetType } from '../lib/types'

export function Library() {
  const { assets, filterType, addAsset, deleteAsset, setFilterType } = useApp()
  const [name, setName] = useState('')
  const [type, setType] = useState<AssetType>('logo')
  const [tags, setTags] = useState('')

  const visible = filterType === 'all' ? assets : assets.filter((a) => a.type === filterType)

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
          aria-label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as AssetType)}
        >
          <option value="logo">logo</option>
          <option value="icon">icon</option>
          <option value="photo">photo</option>
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as AssetType | 'all')}
        >
          <option value="all">All</option>
          <option value="logo">logo</option>
          <option value="icon">icon</option>
          <option value="photo">photo</option>
        </select>
      </div>
      <p>{`Showing: ${visible.length} assets`}</p>
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
