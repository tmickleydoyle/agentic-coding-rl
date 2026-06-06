import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getBooks } from '../lib/store'

beforeEach(() => {
  __reset()
})

describe('Books feature', () => {
  it('displays seed books', async () => {
    const { BooksPage } = await import('../app/books/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getBooks() }) as unknown as typeof fetch
    render(<BooksPage />)
    await waitFor(() => {
      const items = screen.getAllByTestId('book-item')
      expect(items.length).toBe(5)
    })
  })

  it('shows book title and author', async () => {
    const { BooksPage } = await import('../app/books/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getBooks() }) as unknown as typeof fetch
    render(<BooksPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('book-title')[0].textContent).toBe('The Great Gatsby')
    })
  })

  it('shows available status for available book', async () => {
    const { BooksPage } = await import('../app/books/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getBooks() }) as unknown as typeof fetch
    render(<BooksPage />)
    await waitFor(() => {
      const statuses = screen.getAllByTestId('book-status')
      expect(statuses[0].textContent).toBe('Available')
    })
  })

  it('shows On Loan status for unavailable book', async () => {
    const { BooksPage } = await import('../app/books/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getBooks() }) as unknown as typeof fetch
    render(<BooksPage />)
    await waitFor(() => {
      const statuses = screen.getAllByTestId('book-status')
      expect(statuses[1].textContent).toBe('On Loan')
    })
  })

  it('add book form has required fields', async () => {
    const { BooksPage } = await import('../app/books/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getBooks() }) as unknown as typeof fetch
    render(<BooksPage />)
    expect(screen.getByTestId('input-title')).toBeTruthy()
    expect(screen.getByTestId('input-author')).toBeTruthy()
    expect(screen.getByTestId('input-isbn')).toBeTruthy()
    expect(screen.getByTestId('input-genre')).toBeTruthy()
    expect(screen.getByTestId('btn-add-book')).toBeTruthy()
  })

  it('submits new book and updates list', async () => {
    const { BooksPage } = await import('../app/books/page')
    let callCount = 0
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo, opts?: RequestInit) => {
      if (opts?.method === 'POST') {
        return { json: async () => ({ id: 'bNew', title: 'New Book', author: 'New Author', isbn: '123', genre: 'Test', available: true }) }
      }
      callCount++
      return { json: async () => callCount === 1 ? getBooks() : [...getBooks(), { id: 'bNew', title: 'New Book', author: 'New Author', isbn: '123', genre: 'Test', available: true }] }
    }) as unknown as typeof fetch
    render(<BooksPage />)
    fireEvent.change(screen.getByTestId('input-title'), { target: { value: 'New Book' } })
    fireEvent.change(screen.getByTestId('input-author'), { target: { value: 'New Author' } })
    fireEvent.change(screen.getByTestId('input-isbn'), { target: { value: '123' } })
    fireEvent.change(screen.getByTestId('input-genre'), { target: { value: 'Test' } })
    fireEvent.click(screen.getByTestId('btn-add-book'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/books', expect.objectContaining({ method: 'POST' }))
    })
  })
})
