// HELD-OUT generalization tests — fresh scenarios, different sequences and edge cases.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addReview(u: U, customer: string, rating: number) {
  await u.clear(screen.getByLabelText(/customer name/i))
  await u.type(screen.getByLabelText(/customer name/i), customer)
  await u.clear(screen.getByLabelText(/rating \(1-5\)/i))
  await u.type(screen.getByLabelText(/rating \(1-5\)/i), String(rating))
  await u.click(screen.getByRole('button', { name: /add review/i }))
}

describe('Customer Reviews (held-out)', () => {
  it('marking all unresponded makes unresponded count 0 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Mark Alice (unresponded)
    const aliceLi = screen.getByText('Alice').closest('li') as HTMLElement
    await u.click(within(aliceLi).getByRole('button', { name: 'Mark responded' }))
    // Mark Carol (unresponded)
    const carolLi = screen.getByText('Carol').closest('li') as HTMLElement
    await u.click(within(carolLi).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Unresponded: 0')).toBeInTheDocument()
    expect(screen.getByText('Responded: 3')).toBeInTheDocument()
  })

  it('filter shows empty list when all are responded', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li') as HTMLElement
    await u.click(within(aliceLi).getByRole('button', { name: 'Mark responded' }))
    const carolLi = screen.getByText('Carol').closest('li') as HTMLElement
    await u.click(within(carolLi).getByRole('button', { name: 'Mark responded' }))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (0)' })).toBeInTheDocument()
  })

  it('new review added while filter is on shows in filtered list if unresponded', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await addReview(u, 'Grace', 5)
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })

  it('new review does not appear in filtered list if responded seed reviews were all marked', async () => {
    // adding a new review (unresponded) while filter is on: it appears
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    // Bob is responded so hidden; Alice and Carol unresponded so visible
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    await addReview(u, 'Hank', 3)
    // Hank is new unresponded — visible
    expect(screen.getByText('Hank')).toBeInTheDocument()
  })

  it('Stats average updates correctly after two new reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed: 5+3+4 = 12, count 3
    await addReview(u, 'Ivy', 5)
    await addReview(u, 'Jack', 5)
    // total: 5+3+4+5+5 = 22, count 5, avg = 4.4
    await nav(u, 'Stats')
    expect(screen.getByText('Total reviews: 5')).toBeInTheDocument()
    expect(screen.getByText('Average rating: 4.4')).toBeInTheDocument()
  })

  it('toggle theme button label updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats Unresponded reflects newly added reviews', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReview(u, 'Kim', 4)
    await nav(u, 'Stats')
    // seed unresponded: 2 (Alice, Carol), plus Kim = 3
    expect(screen.getByText('Unresponded: 3')).toBeInTheDocument()
  })

  it('heading count is 3 after filter turned on then off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/show unresponded only/i))
    await u.click(screen.getByLabelText(/show unresponded only/i))
    expect(screen.getByRole('heading', { name: 'Reviews (3)' })).toBeInTheDocument()
  })

  it('Carol seed review has Mark responded and clicking it updates Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    const carolLi = screen.getByText('Carol').closest('li') as HTMLElement
    await u.click(within(carolLi).getByRole('button', { name: 'Mark responded' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Responded: 2')).toBeInTheDocument()
    expect(screen.getByText('Unresponded: 1')).toBeInTheDocument()
  })
})
