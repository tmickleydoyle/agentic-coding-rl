// HELD-OUT generalization tests — fresh scenarios not in the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, title: string, quarter: string, status: string) {
  await u.clear(screen.getByLabelText(/item title/i))
  await u.type(screen.getByLabelText(/item title/i), title)
  await u.selectOptions(screen.getByLabelText(/^Quarter$/), quarter)
  await u.selectOptions(screen.getByLabelText(/^Status$/), status)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

describe('Roadmap app (held-out)', () => {
  it('all three seeded items appear in the list by default', () => {
    render(<App />)
    const list = screen.getByRole('list')
    expect(within(list).getByText('Dark mode support')).toBeInTheDocument()
    expect(within(list).getByText('API rate limiting')).toBeInTheDocument()
    expect(within(list).getByText('CSV export')).toBeInTheDocument()
  })

  it('adding a Q4 shipped item is reflected in Stats immediately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Audit log', 'Q4', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 50%')).toBeInTheDocument()
  })

  it('shipping all items gives 100% shipped rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship dark mode support/i }))
    await u.click(screen.getByRole('button', { name: /ship api rate limiting/i }))
    // CSV export is already shipped
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
  })

  it('filter Q2 then add a Q2 item increases count to 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q2')
    await addItem(u, 'SAML SSO', 'Q2', 'planned')
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
  })

  it('newly added item with Q3 is hidden under Q1 filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Mobile app', 'Q3', 'planned')
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q1')
    expect(screen.queryByText('Mobile app')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (2)' })).toBeInTheDocument()
  })

  it('shipping a planned item decrements Planned and increments Shipped in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /ship dark mode support/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Planned: 0')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('item list state is preserved after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'GraphQL API', 'Q3', 'in-progress')
    await nav(u, 'Stats')
    await nav(u, 'Roadmap')
    expect(screen.getByText('GraphQL API')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Items (4)' })).toBeInTheDocument()
  })

  it('adding a planned item increments Planned in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Two-factor auth', 'Q2', 'planned')
    await nav(u, 'Stats')
    expect(screen.getByText('Planned: 2')).toBeInTheDocument()
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
  })

  it('Q4 filter shows no seeded items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by quarter/i), 'Q4')
    expect(screen.getByRole('heading', { name: 'Items (0)' })).toBeInTheDocument()
  })
})
