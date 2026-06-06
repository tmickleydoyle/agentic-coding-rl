import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { BooksPage } from '../reference/app/books/page'
import { MembersPage } from '../reference/app/members/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Books Page', () => {
  it('shows 3 seed books', async () => {
    render(<BooksPage />)
    await waitFor(() => expect(screen.getAllByTestId('book-item').length).toBe(3))
  })

  it('filters by status reading', async () => {
    render(<BooksPage />)
    await waitFor(() => screen.getAllByTestId('book-item'))
    fireEvent.change(screen.getByTestId('book-status-filter'), { target: { value: 'finished' } })
    expect(screen.getAllByTestId('book-item').length).toBe(1)
  })

  it('adds a new book', async () => {
    render(<BooksPage />)
    await waitFor(() => screen.getAllByTestId('book-item'))
    fireEvent.change(screen.getByTestId('book-title-input'), { target: { value: '1984' } })
    fireEvent.change(screen.getByTestId('book-author-input'), { target: { value: 'Orwell' } })
    fireEvent.change(screen.getByTestId('book-genre-input'), { target: { value: 'Dystopia' } })
    fireEvent.change(screen.getByTestId('book-year-input'), { target: { value: '1949' } })
    fireEvent.click(screen.getByTestId('submit-book'))
    await waitFor(() => expect(screen.getAllByTestId('book-item').length).toBe(4))
  })

  it('deletes a book', async () => {
    render(<BooksPage />)
    await waitFor(() => screen.getAllByTestId('book-item'))
    fireEvent.click(screen.getAllByTestId('delete-book')[0])
    await waitFor(() => expect(screen.getAllByTestId('book-item').length).toBe(2))
  })
})

describe('Members Page', () => {
  it('shows 2 seed members', async () => {
    render(<MembersPage />)
    await waitFor(() => expect(screen.getAllByTestId('member-item').length).toBe(2))
  })

  it('adds a new member', async () => {
    render(<MembersPage />)
    await waitFor(() => screen.getAllByTestId('member-item'))
    fireEvent.change(screen.getByTestId('member-name-input'), { target: { value: 'Neo' } })
    fireEvent.change(screen.getByTestId('member-join-date-input'), { target: { value: '2024-05-01' } })
    fireEvent.click(screen.getByTestId('submit-member'))
    await waitFor(() => expect(screen.getAllByTestId('member-item').length).toBe(3))
  })
})
