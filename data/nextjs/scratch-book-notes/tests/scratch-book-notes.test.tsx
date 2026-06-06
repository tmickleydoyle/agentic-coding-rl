import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Book Notes App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /book notes/i })).toBeInTheDocument()
  })

  it('shows 3 seed books', () => {
    render(<App />)
    expect(screen.getAllByTestId('book-item')).toHaveLength(3)
  })

  it('displays seed book titles', () => {
    render(<App />)
    const items = screen.getAllByTestId('book-title')
    const titles = items.map(el => el.textContent)
    expect(titles).toContain('The Great Gatsby')
    expect(titles).toContain('1984')
  })

  it('shows correct initial book count', () => {
    render(<App />)
    expect(screen.getByTestId('book-count').textContent).toBe('Books: 3')
  })

  it('shows correct initial avg rating', () => {
    render(<App />)
    // ratings: 4, 5, 5 → avg 4.7
    expect(screen.getByTestId('avg-rating').textContent).toBe('Avg Rating: 4.7')
  })

  it('adds a new book', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/title/i), 'Brave New World')
    await user.type(screen.getByLabelText(/author/i), 'Aldous Huxley')
    await user.clear(screen.getByLabelText(/rating/i))
    await user.type(screen.getByLabelText(/rating/i), '4')
    await user.type(screen.getByLabelText(/notes/i), 'Dystopian classic.')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getAllByTestId('book-item')).toHaveLength(4)
    const titles = screen.getAllByTestId('book-title').map(el => el.textContent)
    expect(titles).toContain('Brave New World')
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/title/i), 'Some Book')
    await user.type(screen.getByLabelText(/author/i), 'Some Author')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
    expect(screen.getByLabelText(/author/i)).toHaveValue('')
  })

  it('does not add book when title is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/author/i), 'Some Author')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getAllByTestId('book-item')).toHaveLength(3)
  })

  it('does not add book when author is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/title/i), 'Some Title')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getAllByTestId('book-item')).toHaveLength(3)
  })

  it('deletes a book', async () => {
    const user = userEvent.setup()
    render(<App />)
    const items = screen.getAllByTestId('book-item')
    const deleteBtn = within(items[0]).getByRole('button', { name: /delete/i })
    await user.click(deleteBtn)
    expect(screen.getAllByTestId('book-item')).toHaveLength(2)
  })

  it('updates count after delete', async () => {
    const user = userEvent.setup()
    render(<App />)
    const deleteBtn = within(screen.getAllByTestId('book-item')[0]).getByRole('button', { name: /delete/i })
    await user.click(deleteBtn)
    expect(screen.getByTestId('book-count').textContent).toBe('Books: 2')
  })

  it('shows 0.0 avg when all books deleted', async () => {
    const user = userEvent.setup()
    render(<App />)
    const items = screen.getAllByTestId('book-item')
    for (const item of items) {
      await user.click(within(item).getByRole('button', { name: /delete/i }))
    }
    expect(screen.getByTestId('avg-rating').textContent).toBe('Avg Rating: 0.0')
  })

  it('ignores whitespace-only title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/title/i), '   ')
    await user.type(screen.getByLabelText(/author/i), 'Author')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getAllByTestId('book-item')).toHaveLength(3)
  })
})
