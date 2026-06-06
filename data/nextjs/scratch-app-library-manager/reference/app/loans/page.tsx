'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Book, Member, Loan } from '../../lib/types'

export function LoansPage() {
  const { triggerRefresh } = useApp()
  const [loans, setLoans] = useState<Loan[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [bookId, setBookId] = useState('')
  const [memberId, setMemberId] = useState('')
  const [dueDate, setDueDate] = useState('')

  function load() {
    fetch('/api/loans').then(r => r.json()).then(setLoans)
    fetch('/api/books').then(r => r.json()).then(setBooks)
    fetch('/api/members').then(r => r.json()).then(setMembers)
  }

  useEffect(() => { load() }, [])

  const availableBooks = books.filter(b => b.available)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, memberId, dueDate }),
    })
    setBookId(''); setMemberId(''); setDueDate('')
    load()
    triggerRefresh()
  }

  async function handleReturn(id: string) {
    await fetch(`/api/loans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returned: true }),
    })
    load()
    triggerRefresh()
  }

  function bookTitle(id: string) {
    return books.find(b => b.id === id)?.title ?? id
  }
  function memberName(id: string) {
    return members.find(m => m.id === id)?.name ?? id
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Loans</h1>
      <form data-testid="add-loan-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <select data-testid="select-book" value={bookId} onChange={e => setBookId(e.target.value)} required>
          <option value="">Select a book</option>
          {availableBooks.map(b => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
        <select data-testid="select-member" value={memberId} onChange={e => setMemberId(e.target.value)} required>
          <option value="">Select a member</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input data-testid="input-due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
        <button data-testid="btn-add-loan" type="submit">Create Loan</button>
      </form>
      <ul data-testid="loan-list" style={{ listStyle: 'none', padding: 0 }}>
        {loans.map(loan => (
          <li key={loan.id} data-testid="loan-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <span data-testid="loan-book" style={{ fontWeight: 'bold' }}>{bookTitle(loan.bookId)}</span>
              {' — '}
              <span data-testid="loan-member">{memberName(loan.memberId)}</span>
              {' | Due: '}
              <span data-testid="loan-due">{loan.dueDate}</span>
            </span>
            <button data-testid="btn-return" onClick={() => handleReturn(loan.id)}>Return</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
