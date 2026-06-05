// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function reviewRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

async function addReview(u: U, customer: string, rating: number) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/rating \(1-5\)/i))
  await u.type(screen.getByLabelText(/rating \(1-5\)/i), String(rating))
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

describe('Customer Reviews (held-out)', () => {
  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    await nav(u, 'Stats')
    await nav(u, 'Reviews')
    // filter should still be checked
    expect(screen.getByLabelText(/filter: unresponded only/i)).toBeChecked()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('unfilter restores Bob after filter was applied', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('marking a review responded while filter is on removes it immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/filter: unresponded only/i))
    // Alice is unresponded, mark her responded
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (1)' })).toBeInTheDocument()
  })

  it('adding two reviews increments heading correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Hank', 3)
    await addReview(u, 'Iris', 5)
    expect(screen.getByRole('heading', { name: 'Reviews (5)' })).toBeInTheDocument()
  })

  it('stats unresponded count decreases when review is marked responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('average rating updates after adding a low-rated review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Jay', 1)
    await nav(u, 'Stats')
    // (5+3+4+1)/4 = 3.25 -> 3.3
    expect(screen.getByText('Average rating: 3.3')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('reviews view state persists after navigating to settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Kim', 4)
    await nav(u, 'Settings')
    await nav(u, 'Reviews')
    expect(screen.getByText('Kim')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (4)' })).toBeInTheDocument()
  })

  it('stats total reviews accounts for all added reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Leo', 2)
    await addReview(u, 'Mia', 5)
    await addReview(u, 'Ned', 3)
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 6')).toBeInTheDocument()
  })

  it('marking all reviews responded makes unresponded 0 in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 3')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
  })
})
