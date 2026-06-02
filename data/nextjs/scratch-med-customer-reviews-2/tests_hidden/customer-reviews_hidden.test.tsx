// HELD-OUT generalization tests — overlaid only at eval, never seen during generation.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addReview(u: U, customer: string, rating: number) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/^rating$/i))
  await u.type(screen.getByLabelText(/^rating$/i), String(rating))
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

function reviewRow(customer: string): HTMLElement {
  const el = screen.getByText(customer).closest('li')
  if (!el) throw new Error(`no row for ${customer}`)
  return el as HTMLElement
}

describe('Customer Reviews (held-out)', () => {
  it('stats show correct responded count after multiple toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Vera', 5)
    await addReview(u, 'Walt', 4)
    await addReview(u, 'Xena', 3)
    await u.click(within(reviewRow('Vera')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Walt')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })

  it('average rating for a single review equals that rating', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Yara', 3)
    await nav(u, 'Stats')
    expect(screen.getByText('Average rating: 3.0')).toBeInTheDocument()
  })

  it('average rating computed across varied ratings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Zoe', 1)
    await addReview(u, 'Aaron', 5)
    await nav(u, 'Stats')
    // (1+5)/2 = 3.0
    expect(screen.getByText('Average rating: 3.0')).toBeInTheDocument()
  })

  it('unresponded count in stats equals zero when all responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Beth', 4)
    await addReview(u, 'Carl', 5)
    await u.click(within(reviewRow('Beth')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Carl')).getByRole('button', { name: /mark responded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
  })

  it('filter shows zero reviews heading when all are responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Dora', 5)
    await u.click(within(reviewRow('Dora')).getByRole('button', { name: /mark responded/i }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('theme toggle cycles light -> dark -> light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('rating shown per review is the value provided', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Evan', 2)
    expect(within(reviewRow('Evan')).getByText('Rating: 2')).toBeInTheDocument()
  })

  it('stats total is unaffected by the filter on reviews view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Fern', 5)
    await addReview(u, 'Gio', 4)
    await u.click(within(reviewRow('Fern')).getByRole('button', { name: /mark responded/i }))
    // turn on filter (hides Fern)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await nav(u, 'Stats')
    // still counts all 2 reviews
    expect(screen.getByText('Total reviews: 2')).toBeInTheDocument()
  })

  it('re-toggling responded in reviews updates stats again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Hana', 3)
    await u.click(within(reviewRow('Hana')).getByRole('button', { name: /mark responded/i }))
    await u.click(within(reviewRow('Hana')).getByRole('button', { name: /mark unresponded/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 0')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })
})
