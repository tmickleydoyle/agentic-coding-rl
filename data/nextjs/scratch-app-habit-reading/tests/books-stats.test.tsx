import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('books and stats', () => {
  it('lists seed books with their done flags and finished count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-books'))
    expect(screen.getByTestId('book-b1-title')).toHaveTextContent('Dune')
    expect(screen.getByTestId('book-b1')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('book-b2')).toHaveAttribute('data-done', 'false')
    expect(screen.getByTestId('books-finished')).toHaveTextContent('2')
  })

  it('toggling a book updates its done flag and the finished count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-books'))
    await user.click(screen.getByTestId('toggle-book-b2'))
    expect(screen.getByTestId('book-b2')).toHaveAttribute('data-done', 'true')
    expect(screen.getByTestId('books-finished')).toHaveTextContent('3')
  })

  it('un-marking a finished book lowers the count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-books'))
    await user.click(screen.getByTestId('toggle-book-b1'))
    expect(screen.getByTestId('book-b1')).toHaveAttribute('data-done', 'false')
    expect(screen.getByTestId('books-finished')).toHaveTextContent('1')
  })

  it('computes seed stats: total, streak, average, finished', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('95')
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-average-value')).toHaveTextContent('32')
    expect(screen.getByTestId('stat-finished-value')).toHaveTextContent('2')
  })

  it('logging more pages updates the total and average', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    await user.type(screen.getByTestId('pages-input'), '5')
    await user.click(screen.getByTestId('submit-pages'))
    await user.click(screen.getByTestId('nav-stats'))
    // 30 + 45 + 5 = 80 over 3 days => avg 27
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('80')
    expect(screen.getByTestId('stat-average-value')).toHaveTextContent('27')
  })

  it('book toggles are reflected in the stats finished count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-books'))
    await user.click(screen.getByTestId('toggle-book-b2'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-finished-value')).toHaveTextContent('3')
  })
})
