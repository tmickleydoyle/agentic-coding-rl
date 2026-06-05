import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing Manager', () => {
  it('starts on the Services view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /services/i })).toBeInTheDocument()
  })

  it('seeds three services on load', () => {
    render(<App />)
    expect(screen.getByText('Consultation')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('shows seeded prices formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$50.00')).toBeInTheDocument()
    expect(screen.getByText('$120.00')).toBeInTheDocument()
    expect(screen.getByText('$30.00')).toBeInTheDocument()
  })

  it('shows correct heading count for seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Services (3)' })).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows seeded stats in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('shows correct average price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // (50 + 120 + 30) / 3 = 66.67
    expect(screen.getByText('Average price: $66.67')).toBeInTheDocument()
  })

  it('shows correct active average for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // (50 + 120) / 2 = 85.00
    expect(screen.getByText('Active average: $85.00')).toBeInTheDocument()
  })

  it('adds a new service and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Hosting')
    await u.type(screen.getByLabelText('Price'), '25')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Hosting')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (4)' })).toBeInTheDocument()
  })

  it('ignores adding a service with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Price'), '10')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: 'Services (3)' })).toBeInTheDocument()
  })

  it('ignores adding a service with an invalid price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Ghost')
    await u.type(screen.getByLabelText('Price'), 'abc')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Ghost')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (3)' })).toBeInTheDocument()
  })

  it('deletes a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete support/i }))
    expect(screen.queryByText('Support')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (2)' })).toBeInTheDocument()
  })

  it('seeded active services show Active button; inactive shows Inactive', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const consultation = items.find(li => within(li).queryByText('Consultation'))
    const support = items.find(li => within(li).queryByText('Support'))
    expect(within(consultation!).getByRole('button', { name: 'Active' })).toBeInTheDocument()
    expect(within(support!).getByRole('button', { name: 'Inactive' })).toBeInTheDocument()
  })

  it('toggles a service active state (cross-view update in Summary)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Toggle Support to active
    const items = screen.getAllByRole('listitem')
    const support = items.find(li => within(li).queryByText('Support'))!
    await u.click(within(support).getByRole('button', { name: 'Inactive' }))
    expect(within(support).getByRole('button', { name: 'Active' })).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 0')).toBeInTheDocument()
  })

  it('filter Show active only hides inactive services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show active only' }))
    expect(screen.queryByText('Support')).not.toBeInTheDocument()
    expect(screen.getByText('Consultation')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (2)' })).toBeInTheDocument()
  })

  it('filter Show all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show active only' }))
    await u.click(screen.getByRole('button', { name: 'Show all' }))
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (3)' })).toBeInTheDocument()
  })

  it('Summary stats are unaffected by active-only filter (all services counted)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show active only' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('Summary shows $0.00 averages when all services deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete consultation/i }))
    await u.click(screen.getByRole('button', { name: /delete design/i }))
    await u.click(screen.getByRole('button', { name: /delete support/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Average price: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Services')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Analytics')
    await u.type(screen.getByLabelText('Price'), '75')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Summary')
    await nav(u, 'Services')
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (4)' })).toBeInTheDocument()
  })
})
