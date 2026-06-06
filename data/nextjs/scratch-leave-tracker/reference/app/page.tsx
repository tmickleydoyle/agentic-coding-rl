'use client'
import { useState } from 'react'

type Status = 'Pending' | 'Approved' | 'Rejected'

interface LeaveRequest {
  id: number
  employee: string
  type: string
  startDate: string
  endDate: string
  status: Status
}

const SEED: LeaveRequest[] = [
  { id: 1, employee: 'Alice Johnson', type: 'Vacation',   startDate: '2024-07-01', endDate: '2024-07-05', status: 'Approved' },
  { id: 2, employee: 'Bob Martinez',  type: 'Sick Leave', startDate: '2024-06-10', endDate: '2024-06-11', status: 'Approved' },
  { id: 3, employee: 'Carol White',   type: 'Vacation',   startDate: '2024-08-12', endDate: '2024-08-16', status: 'Pending'  },
  { id: 4, employee: 'David Lee',     type: 'Personal',   startDate: '2024-07-20', endDate: '2024-07-20', status: 'Rejected' },
]

const LEAVE_TYPES = ['Vacation', 'Sick Leave', 'Personal']
const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected'] as const

export default function App() {
  const [requests, setRequests] = useState<LeaveRequest[]>(SEED.map(r => ({ ...r })))
  const [filter, setFilter] = useState<string>('All')
  const [showForm, setShowForm] = useState(false)
  const [employee, setEmployee] = useState('')
  const [leaveType, setLeaveType] = useState('Vacation')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [nextId, setNextId] = useState(5)

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter)

  const totalCount = requests.length
  const pendingCount = requests.filter(r => r.status === 'Pending').length
  const approvedCount = requests.filter(r => r.status === 'Approved').length

  function handleSubmit() {
    if (!employee.trim() || !startDate || !endDate) return
    if (endDate < startDate) return
    setRequests(prev => [...prev, {
      id: nextId,
      employee: employee.trim(),
      type: leaveType,
      startDate,
      endDate,
      status: 'Pending',
    }])
    setNextId(n => n + 1)
    setEmployee(''); setStartDate(''); setEndDate(''); setLeaveType('Vacation')
    setShowForm(false)
  }

  function handleCancel() {
    setEmployee(''); setStartDate(''); setEndDate(''); setLeaveType('Vacation')
    setShowForm(false)
  }

  function handleApprove(id: number) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r))
  }

  function handleReject(id: number) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r))
  }

  function handleDelete(id: number) {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <h1>Leave Tracker</h1>

      <div>
        <span data-testid="stat-total">Total: {totalCount}</span>
        <span data-testid="stat-pending">Pending: {pendingCount}</span>
        <span data-testid="stat-approved">Approved: {approvedCount}</span>
      </div>

      <div>
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}>{s}</button>
        ))}
      </div>

      <button onClick={() => setShowForm(f => !f)}>Add Leave Request</button>

      {showForm && (
        <div data-testid="add-form">
          <input aria-label="Employee Name" value={employee} onChange={e => setEmployee(e.target.value)} placeholder="Employee name" />
          <select aria-label="Leave Type" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
            {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input aria-label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input aria-label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button onClick={handleSubmit}>Submit Request</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      <ul>
        {filtered.map(r => (
          <li key={r.id} data-testid="leave-row">
            <span data-testid="leave-employee">{r.employee}</span>
            <span data-testid="leave-type">{r.type}</span>
            <span data-testid="leave-start">{r.startDate}</span>
            <span data-testid="leave-end">{r.endDate}</span>
            <span data-testid="leave-status">{r.status}</span>
            {r.status === 'Pending' && (
              <>
                <button onClick={() => handleApprove(r.id)}>Approve</button>
                <button onClick={() => handleReject(r.id)}>Reject</button>
              </>
            )}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
