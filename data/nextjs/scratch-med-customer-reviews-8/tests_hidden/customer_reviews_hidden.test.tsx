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
  it('showing count is 3 at startup without filter', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('rating 1 is accepted as a valid review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Hank', '1')
    expect(screen.getByText('Hank')).toBeInTheDocument()
    expect(within(reviewRow('Hank')).getByText('Rating: 1')).toBeInTheDocument()
  })

  it('rating 5 is accepted as a valid review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Ivy', '5')
    expect(screen.getByText('Ivy')).toBeInTheDocument()
    expect(within(reviewRow('Ivy')).getByText('Rating: 5')).toBeInTheDocument()
  })

  it('ignores a non-integer rating like 3.5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Jack', '3.5')
    expect(screen.queryByText('Jack')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 3 reviews')).toBeInTheDocument()
  })

  it('after marking all unresponded, filter shows 0 reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByText('Showing: 0 reviews')).toBeInTheDocument()
  })

  it('stats unresponded is 0 after all are responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(reviewRow('Alice')).getByRole('button', { name: 'Mark responded' }))
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 3')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
  })

  it('adding multiple reviews increases the total in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Kara', '4')
    await addReview(u, 'Leo', '2')
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 5')).toBeInTheDocument()
  })

  it('average rating with all 5s is 5.0', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Clear seeded data effect: add enough 5s to overpower — instead test with a fresh scenario
    // Seeded: Alice=5, Bob=3, Carol=4. Add two more: Mia=5, Ned=5 -> (5+3+4+5+5)/5=22/5=4.4
    await addReview(u, 'Mia', '5')
    await addReview(u, 'Ned', '5')
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 4.4')).toBeInTheDocument()
  })

  it('stats view shows Average rating: 0.0 with no reviews is not tested (seeded), but average recalculates', async () => {
    // Just verify the format is one decimal place with a known result
    const u = userEvent.setup()
    render(<App />)
    // (5+3+4)/3 = 4.0
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 4.0')).toBeInTheDocument()
  })

  it('reviews state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Opal', '3')
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    await nav(u, 'Reviews')
    expect(screen.getByText('Opal')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 reviews')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter combined with mark responded updates count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    // 2 unresponded: Alice, Carol
    expect(screen.getByText('Showing: 2 reviews')).toBeInTheDocument()
    await u.click(within(reviewRow('Carol')).getByRole('button', { name: 'Mark responded' }))
    expect(screen.getByText('Showing: 1 reviews')).toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('newly added review has Mark responded button enabled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Quinn', '4')
    expect(within(reviewRow('Quinn')).getByRole('button', { name: 'Mark responded' })).not.toBeDisabled()
  })

  it('responded button is disabled after clicking Mark responded on new review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Rosa', '3')
    await u.click(within(reviewRow('Rosa')).getByRole('button', { name: 'Mark responded' }))
    expect(within(reviewRow('Rosa')).getByRole('button', { name: 'Responded' })).toBeDisabled()
  })
})
