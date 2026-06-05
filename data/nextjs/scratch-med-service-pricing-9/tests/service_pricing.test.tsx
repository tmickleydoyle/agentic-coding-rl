import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addService(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText(/service name/i))
  await u.type(screen.getByLabelText(/service name/i), name)
  await u.clear(screen.getByLabelText(/price \(\$\)/i))
  await u.type(screen.getByLabelText(/price \(\$\)/i), price)
  await u.click(screen.getByRole('button', { name: /add service/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Service Pricing Manager', () => {
  it('starts on the Services view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('shows seeded services with correct prices', () => {
    render(<App />)
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
    expect(screen.getByText('$80.00')).toBeInTheDocument()
    expect(screen.getByText('Deep conditioning')).toBeInTheDocument()
    expect(screen.getByText('$45.00')).toBeInTheDocument()
  })

  it('seeded services have correct initial active status', () => {
    render(<App />)
    const hairRow = row('Haircut')
    const deepRow = row('Deep conditioning')
    expect(within(hairRow).getByText('Active')).toBeInTheDocument()
    expect(within(deepRow).getByText('Inactive')).toBeInTheDocument()
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

  it('navigates back to Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: /services/i })).toBeInTheDocument()
  })

  it('adds a new service and heading count updates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Manicure', '35')
    expect(screen.getByText('Manicure')).toBeInTheDocument()
    expect(screen.getByText('$35.00')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /services \(4\)/i })).toBeInTheDocument()
  })

  it('new service starts as Active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Pedicure', '40')
    expect(within(row('Pedicure')).getByText('Active')).toBeInTheDocument()
  })

  it('ignores a blank service name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/price \(\$\)/i))
    await u.type(screen.getByLabelText(/price \(\$\)/i), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('ignores a zero or negative price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Ghost')
    await u.clear(screen.getByLabelText(/price \(\$\)/i))
    await u.type(screen.getByLabelText(/price \(\$\)/i), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('toggles a service inactive then active again', async () => {
    const u = userEvent.setup()
    render(<App />)
    const hairRow = row('Haircut')
    expect(within(hairRow).getByText('Active')).toBeInTheDocument()
    await u.click(within(hairRow).getByRole('button', { name: /toggle haircut/i }))
    expect(within(hairRow).getByText('Inactive')).toBeInTheDocument()
    await u.click(within(hairRow).getByRole('button', { name: /toggle haircut/i }))
    expect(within(hairRow).getByText('Active')).toBeInTheDocument()
  })

  it('Show Active filter hides inactive services and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /show active/i }))
    expect(screen.getByRole('heading', { name: /services \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Deep conditioning')).not.toBeInTheDocument()
  })

  it('Show All filter restores all services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /show active/i }))
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Deep conditioning')).toBeInTheDocument()
  })

  it('Summary shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('Summary shows correct average price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // (25 + 80 + 45) / 3 = 50.00
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
  })

  it('Summary shows correct active average for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // (25 + 80) / 2 = 52.50
    expect(screen.getByText('Active average: $52.50')).toBeInTheDocument()
  })

  it('toggling a service updates Summary active/inactive counts (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 2')).toBeInTheDocument()
  })

  it('toggling all services to inactive shows $0.00 active average', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Color treatment')).getByRole('button', { name: /toggle color treatment/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
  })

  it('adding a service updates Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Waxing', '30')
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })

  it('toggle theme persists across views', async () => {
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

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /show active/i }))
    await nav(u, 'Summary')
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: /services \(2\)/i })).toBeInTheDocument()
  })

  it('Show Active filter with toggled service reflects new active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Deep conditioning')).getByRole('button', { name: /toggle deep conditioning/i }))
    await u.click(screen.getByRole('button', { name: /show active/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })
})
