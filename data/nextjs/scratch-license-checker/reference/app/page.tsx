'use client'
import { useState } from 'react'

interface Pkg {
  id: number
  name: string
  version: string
  license: string
  approved: boolean
}

const SEED: Pkg[] = [
  { id: 1, name: 'react', version: '18.2.0', license: 'MIT', approved: true },
  { id: 2, name: 'redux', version: '4.2.1', license: 'MIT', approved: true },
  { id: 3, name: 'gpl-lib', version: '1.0.0', license: 'GPL-3.0', approved: false },
  { id: 4, name: 'apache-utils', version: '2.1.0', license: 'Apache-2.0', approved: true },
  { id: 5, name: 'commons-io', version: '3.0.0', license: 'LGPL-2.1', approved: false },
  { id: 6, name: 'uuid', version: '9.0.0', license: 'MIT', approved: true },
  { id: 7, name: 'bcrypt', version: '5.1.0', license: 'Apache-2.0', approved: true },
  { id: 8, name: 'mystery-pkg', version: '0.0.1', license: 'Unknown', approved: false },
]

const LICENSE_OPTIONS = ['MIT', 'GPL-3.0', 'Apache-2.0', 'LGPL-2.1', 'Unknown']

export default function App() {
  const [packages, setPackages] = useState<Pkg[]>(SEED.map(p => ({ ...p })))
  const [approvalFilter, setApprovalFilter] = useState<'All' | 'Approved' | 'Rejected'>('All')
  const [licenseFilter, setLicenseFilter] = useState('All')
  const [addName, setAddName] = useState('')
  const [addLicense, setAddLicense] = useState('')

  const filtered = packages.filter(p => {
    const approvalOk =
      approvalFilter === 'All' ||
      (approvalFilter === 'Approved' && p.approved) ||
      (approvalFilter === 'Rejected' && !p.approved)
    const licenseOk = licenseFilter === 'All' || p.license === licenseFilter
    return approvalOk && licenseOk
  })

  const approvedCount = filtered.filter(p => p.approved).length
  const rejectedCount = filtered.filter(p => !p.approved).length

  function handleToggle(id: number) {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, approved: !p.approved } : p))
  }

  function handleRemove(id: number) {
    setPackages(prev => prev.filter(p => p.id !== id))
  }

  function handleAdd() {
    if (!addName.trim()) return
    const nextId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1
    setPackages(prev => [...prev, {
      id: nextId,
      name: addName.trim(),
      version: '0.0.0',
      license: addLicense.trim() || 'Unknown',
      approved: false,
    }])
    setAddName('')
    setAddLicense('')
  }

  return (
    <div>
      <h1 data-testid="heading">License Checker</h1>

      <div>
        <span data-testid="count-approved">{approvedCount}</span>
        <span> approved </span>
        <span data-testid="count-rejected">{rejectedCount}</span>
        <span> rejected</span>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setApprovalFilter('All')}>All</button>
        <button data-testid="filter-approved" onClick={() => setApprovalFilter('Approved')}>Approved</button>
        <button data-testid="filter-rejected" onClick={() => setApprovalFilter('Rejected')}>Rejected</button>
      </div>

      <div>
        <select
          data-testid="license-select"
          value={licenseFilter}
          onChange={e => setLicenseFilter(e.target.value)}
        >
          <option value="All">All</option>
          {LICENSE_OPTIONS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div data-testid="pkg-count">{filtered.length} packages</div>

      <ul>
        {filtered.map(p => (
          <li key={p.id} data-testid={`pkg-item-${p.id}`}>
            <span data-testid={`pkg-name-${p.id}`}>{p.name}</span>
            <span data-testid={`pkg-license-${p.id}`}>{p.license}</span>
            <span data-testid={`pkg-approved-${p.id}`}>{p.approved ? 'Approved' : 'Rejected'}</span>
            <button data-testid={`toggle-${p.id}`} onClick={() => handleToggle(p.id)}>Toggle</button>
            <button data-testid={`remove-${p.id}`} onClick={() => handleRemove(p.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div>
        <input
          data-testid="add-name"
          value={addName}
          onChange={e => setAddName(e.target.value)}
          placeholder="Package name"
        />
        <input
          data-testid="add-license"
          value={addLicense}
          onChange={e => setAddLicense(e.target.value)}
          placeholder="License"
        />
        <button data-testid="add-button" onClick={handleAdd}>Add</button>
      </div>
    </div>
  )
}
