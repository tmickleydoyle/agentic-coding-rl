import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('review flow', () => {
  it('lists a selected product reviews', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p1'))
    const list = screen.getByTestId('review-list')
    expect(within(list).getByTestId('review-r1')).toBeInTheDocument()
    expect(within(list).getByTestId('review-r2')).toBeInTheDocument()
    expect(within(list).queryByTestId('review-r3')).not.toBeInTheDocument()
  })

  it('shows empty-reviews for a product with no reviews', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p3'))
    expect(screen.getByTestId('empty-reviews')).toBeInTheDocument()
    expect(screen.queryByTestId('review-list')).not.toBeInTheDocument()
  })

  it('sorts reviews by rating descending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p1'))
    await user.selectOptions(screen.getByTestId('sort-select'), 'rating')
    const items = screen.getAllByTestId(/^review-r\d+$/)
    expect(items[0]).toHaveAttribute('data-testid', 'review-r1') // rating 5 first
    expect(items[1]).toHaveAttribute('data-testid', 'review-r2') // rating 3 second
  })

  it('sorts reviews by date descending (newest first)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p1'))
    await user.selectOptions(screen.getByTestId('sort-select'), 'date')
    const items = screen.getAllByTestId(/^review-r\d+$/)
    expect(items[0]).toHaveAttribute('data-testid', 'review-r2') // createdAt 2 newest
    expect(items[1]).toHaveAttribute('data-testid', 'review-r1')
  })

  it('removes a review', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p1'))
    expect(screen.getByTestId('review-r2')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-r2'))
    expect(screen.queryByTestId('review-r2')).not.toBeInTheDocument()
  })

  it('blocks a review with an out-of-range rating', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-write-review'))
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '7')
    await user.type(screen.getByTestId('text-input'), 'Too good')
    await user.click(screen.getByTestId('submit-review'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-write-review')).toBeInTheDocument()
  })

  it('blocks a review with empty text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-write-review'))
    await user.click(screen.getByTestId('submit-review'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-write-review')).toBeInTheDocument()
  })

  it('adds a review and shows it on the product reviews page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-write-review'))
    await user.selectOptions(screen.getByTestId('product-select'), 'p2')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '2')
    await user.type(screen.getByTestId('text-input'), 'Too loud')
    await user.click(screen.getByTestId('submit-review'))
    expect(screen.getByTestId('page-product-reviews')).toBeInTheDocument()
    expect(screen.getByTestId('selected-name')).toHaveTextContent('Mechanical Keyboard')
    expect(screen.getByTestId('review-r4-text')).toHaveTextContent('Too loud')
  })

  it('updates the product average after adding a review', async () => {
    const user = userEvent.setup()
    render(<App />)
    // p2 has one review of 4. Add a 2 => average 3.0
    await user.click(screen.getByTestId('nav-write-review'))
    await user.selectOptions(screen.getByTestId('product-select'), 'p2')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '2')
    await user.type(screen.getByTestId('text-input'), 'meh')
    await user.click(screen.getByTestId('submit-review'))
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('product-p2-avg')).toHaveTextContent('3.0')
    expect(screen.getByTestId('product-p2-count')).toHaveTextContent('2')
  })
})
