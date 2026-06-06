'use client'
import { useState } from 'react'

const PROPERTIES = [
  { id: 1, address: '101 Maple St', bedrooms: 2, bathrooms: 1, rent: 1500, type: 'Apartment' },
  { id: 2, address: '205 Oak Ave', bedrooms: 3, bathrooms: 2, rent: 2200, type: 'House' },
  { id: 3, address: '312 Pine Rd', bedrooms: 1, bathrooms: 1, rent: 950, type: 'Studio' },
  { id: 4, address: '400 Elm Blvd', bedrooms: 4, bathrooms: 3, rent: 3100, type: 'House' },
  { id: 5, address: '88 Cedar Ln', bedrooms: 2, bathrooms: 2, rent: 1800, type: 'Apartment' },
]

export default function App() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [maxRent, setMaxRent] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)

  const filtered = PROPERTIES.filter(p => {
    if (search && !p.address.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'All' && p.type !== typeFilter) return false
    if (maxRent !== '' && p.rent > Number(maxRent)) return false
    return true
  })

  function toggleDetails(id: number) {
    setOpenId(prev => (prev === id ? null : id))
  }

  function clearFilters() {
    setSearch('')
    setTypeFilter('All')
    setMaxRent('')
    setOpenId(null)
  }

  return (
    <div>
      <h1>Property Listings</h1>

      <div>
        <label>
          Search by address
          <input
            aria-label="Search by address"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>

        <label>
          Type
          <select
            aria-label="Type"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
          </select>
        </label>

        <label>
          Max Rent
          <input
            aria-label="Max Rent"
            type="number"
            value={maxRent}
            onChange={e => setMaxRent(e.target.value)}
          />
        </label>

        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      <p data-testid="count">{filtered.length} properties found</p>

      {filtered.length === 0 && (
        <p data-testid="no-results">No properties found.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(p => (
          <li key={p.id} data-testid="property-card">
            <h2>{p.address}</h2>
            <p>Bedrooms: {p.bedrooms}</p>
            <p>Bathrooms: {p.bathrooms}</p>
            <p>${p.rent}/mo</p>
            <span>{p.type}</span>
            <button onClick={() => toggleDetails(p.id)}>View Details</button>
            {openId === p.id && (
              <div data-testid="property-details">
                Contact us about {p.address}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
