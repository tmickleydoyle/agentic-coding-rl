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

async function addReview(u: U, customer: string, rating: string) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/^rating$/i))
  await u.type(screen.getByLabelText(/^rating$/i), rating)
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

describe('Customer Reviews (held-out)', () => {
  it('count reflects all 3 seeded reviews when filter is off', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('adding two reviews makes count 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Zara', '5')
    await addReview(u, 'Leo', '2')
    expect(screen.getByRole('heading', { name: 'Reviews (5)' })).toBeInTheDocument()
  })

  it('ignores a review with rating 5.5 (non-integer)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Nina', '5.5')
    expect(screen.queryByText('Nina')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('stats unresponded count is 2 on initial load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unresponded: 2')).toBeInTheDocument()
  })

  it('responding to all reviews makes unresponded 0 in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 3')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
  })

  it('filter with all responded shows 0 unresponded in heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('unfiltering restores full list after filter was applied', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('new review added while filter is on does not appear if already responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await addReview(u, 'Sam', '3')
    // Sam is unresponded so should appear
    expect(screen.getByText('Sam')).toBeInTheDocument()
    // mark Sam responded
    await u.click(within(reviewRow('Sam')).getByRole('button', { name: /mark responded/i }))
    // now Sam disappears from filtered view
    expect(screen.queryByText('Sam')).not.toBeInTheDocument()
  })

  it('stats average rating shows dash with no reviews — seeded so navigate and clear via filter logic', async () => {
    // We cannot clear seeded data, so we test the average with known values instead
    // (5+3+4)/3 = 4.0 exactly
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('stats total updates after adding a review and navigating back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Mia', '5')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 4')).toBeInTheDocument()
    await nav(u, 'Reviews')
    await addReview(u, 'Kai', '2')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 5')).toBeInTheDocument()
  })

  it('responds to Carol and stats shows 2 responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('adding a rating-1 review changes average correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Pam', '1')
    await nav(u, 'Stats')
    // (5+3+4+1)/4 = 3.25 -> 3.3
    expect(screen.getByText('Average rating: 3.3')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('reviews view has Add review button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /add review/i })).toBeInTheDocument()
  })

  it('Carol rating is shown correctly', () => {
    render(<App />)
    const row = reviewRow('Carol')
    expect(within(row).getByText('Rating: 4')).toBeInTheDocument()
  })
})
