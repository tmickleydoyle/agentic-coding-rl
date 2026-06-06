'use client'
import { useState } from 'react'

interface Employee {
  id: number
  name: string
  department: string
  role: string
  email: string
  phone: string
}

const SEED: Employee[] = [
  { id: 1, name: 'Alice Johnson',  department: 'Engineering', role: 'Senior Engineer',   email: 'alice@company.com', phone: '555-0101' },
  { id: 2, name: 'Bob Martinez',   department: 'Marketing',   role: 'Marketing Manager', email: 'bob@company.com',   phone: '555-0102' },
  { id: 3, name: 'Carol White',    department: 'Engineering', role: 'Junior Engineer',   email: 'carol@company.com', phone: '555-0103' },
  { id: 4, name: 'David Lee',      department: 'HR',          role: 'HR Specialist',     email: 'david@company.com', phone: '555-0104' },
  { id: 5, name: 'Eva Chen',       department: 'Marketing',   role: 'Content Writer',    email: 'eva@company.com',   phone: '555-0105' },
]

const DEPARTMENTS = ['Engineering', 'Marketing', 'HR']

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(SEED.map(e => ({ ...e })))
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('Engineering')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const filtered = employees.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
    const matchDept = deptFilter === 'All' || e.department === deptFilter
    return matchSearch && matchDept
  })

  function handleSave() {
    if (!name.trim() || !role.trim() || !email.trim() || !phone.trim()) return
    setEmployees(prev => [...prev, { id: prev.length + 1, name: name.trim(), department, role: role.trim(), email: email.trim(), phone: phone.trim() }])
    setName(''); setRole(''); setEmail(''); setPhone(''); setDepartment('Engineering')
    setShowForm(false)
  }

  function handleCancel() {
    setName(''); setRole(''); setEmail(''); setPhone(''); setDepartment('Engineering')
    setShowForm(false)
  }

  return (
    <div>
      <h1>Employee Directory</h1>

      <input
        aria-label="Search employees"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, role, or email"
      />

      <select
        aria-label="Filter by department"
        value={deptFilter}
        onChange={e => setDeptFilter(e.target.value)}
      >
        <option value="All">All</option>
        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <button onClick={() => setShowForm(s => !s)}>Add Employee</button>

      <p data-testid="employee-count">Showing {filtered.length} of {employees.length} employees</p>

      {showForm && (
        <div data-testid="add-form">
          <input aria-label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <select aria-label="Department" value={department} onChange={e => setDepartment(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input aria-label="Role" value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
          <input aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input aria-label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <button onClick={handleSave}>Save Employee</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      <ul>
        {filtered.map(e => (
          <li key={e.id} data-testid="employee-card">
            <span data-testid="employee-name">{e.name}</span>
            <span data-testid="employee-department">{e.department}</span>
            <span data-testid="employee-role">{e.role}</span>
            <span data-testid="employee-email">{e.email}</span>
            <span data-testid="employee-phone">{e.phone}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
