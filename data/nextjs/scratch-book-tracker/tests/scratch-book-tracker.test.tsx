import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Book Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Book Tracker')).toBeInTheDocument()
  })

  it('shows 4 seed books', () => {
    expect(screen.getAllByTestId('book-item')).toHaveLength(4)
  })

  it('shows correct initial book count', () => {
    expect(screen.getByTestId('book-count').textContent).toBe('4 books')
  })

  it('shows correct avg rating from seed (4.5)', () => {
    expect(screen.getByTestId('avg-rating').textContent).toBe('Avg rating: 4.5')
  })

  it('seed books show title, author, status, and rating', () => {
    const items = screen.getAllByTestId('book-item')
    expect(items[0].textContent).toContain('The Great Gatsby')
    expect(items[0].textContent).toContain('F. Scott Fitzgerald')
    expect(items[0].textContent).toContain('Read')
    expect(items[0].textContent).toContain('4/5')
  })

  it('adds a new book', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Title$/i), 'Foundation')
    await user.type(screen.getByLabelText(/^Author$/i), 'Isaac Asimov')
    await user.selectOptions(screen.getByLabelText(/^Status$/i), 'Want to Read')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getAllByTestId('book-item')).toHaveLength(5)
  })

  it('does not add book when title is missing', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Author$/i), 'Someone')
    await user.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getAllByTestId('book-item')).toHaveLength(4)
  })

  it('removes a book', async () => {
    const user = userEvent.setup()
    const removeBtns = screen.getAllByTestId('remove-btn')
    await user.click(removeBtns[0])
    expect(screen.getAllByTestId('book-item')).toHaveLength(3)
  })

  it('filters books by status', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'Read')
    expect(screen.getAllByTestId('book-item')).toHaveLength(2)
  })

  it('filter count updates correctly', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'Reading')
    expect(screen.getByTestId('book-count').textContent).toBe('1 books')
  })

  it('avg rating excludes unrated books', async () => {
    // avg-rating should only count books with rating > 0
    expect(screen.getByTestId('avg-rating').textContent).not.toContain('N/A')
    expect(screen.getByTestId('avg-rating').textContent).toContain('4.5')
  })

  it('shows N/A avg when all rated books removed', async () => {
    const user = userEvent.setup()
    // Remove The Great Gatsby (rating 4) and Project Hail Mary (rating 5)
    // They are at indices 0 and 2 in seed
    const removeBtns = screen.getAllByTestId('remove-btn')
    await user.click(removeBtns[0]) // Removes Gatsby
    const removeBtns2 = screen.getAllByTestId('remove-btn')
    // Project Hail Mary is now at index 1
    await user.click(removeBtns2[1])
    expect(screen.getByTestId('avg-rating').textContent).toBe('Avg rating: N/A')
  })
})
