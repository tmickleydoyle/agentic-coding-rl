import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getBooks, addBook, getMembers, addMember, getLoans, addLoan, returnLoan } from '../lib/store'

beforeEach(() => {
  __reset()
})

describe('Store API', () => {
  it('getBooks returns 5 seed books', () => {
    expect(getBooks().length).toBe(5)
  })

  it('addBook adds a book with available: true', () => {
    addBook({ title: 'Test', author: 'Auth', isbn: '111', genre: 'Drama' })
    expect(getBooks().length).toBe(6)
    expect(getBooks()[5].available).toBe(true)
  })

  it('getMembers returns 3 seed members', () => {
    expect(getMembers().length).toBe(3)
  })

  it('addMember adds a member', () => {
    addMember({ name: 'Dave', email: 'dave@test.com', membershipId: 'LIB004', joinDate: '2024-01-01' })
    expect(getMembers().length).toBe(4)
  })

  it('getLoans returns 2 active loans', () => {
    expect(getLoans().length).toBe(2)
  })

  it('addLoan sets book unavailable', () => {
    addLoan({ bookId: 'b1', memberId: 'm3', dueDate: '2024-02-01' })
    const book = getBooks().find(b => b.id === 'b1')
    expect(book?.available).toBe(false)
  })

  it('returnLoan sets book available again', () => {
    returnLoan('l1')
    const book = getBooks().find(b => b.id === 'b2')
    expect(book?.available).toBe(true)
  })

  it('returnLoan removes loan from active list', () => {
    returnLoan('l1')
    expect(getLoans().length).toBe(1)
  })
})
