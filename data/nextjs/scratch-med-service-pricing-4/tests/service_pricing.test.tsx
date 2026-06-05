import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

async function addService(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText(/service name/i))
  await u.type(screen.getByLabelText(/service name/i), name)
  await u.clear(screen.getByLabelText(/^price$/i))
  await u.type(screen.getByLabelText(/^price$/i), price)
  await u.click(screen.getByRole('button', { name: /add service/i }))
}

describe('Service Pricing Manager', () => {
  it('starts on the Services view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
  })

  it('shows the three seeded services on load', () => {
    render(<App />)
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
    expect(screen.getByText('Blowout')).toBeInTheDocument()
  })

  it('shows seeded prices formatted correctly', () => {
    render(<App />)
    expect(within(row('Haircut')).getByText('$25.00')).toBeInTheDocument()
    expect(within(row('Color treatment')).getByText('$85.00')).toBeInTheDocument()
    expect(within(row('Blowout')).getByText('$40.00')).toBeInTheDocument()
  })

  it('shows initial active count line', () => {
    render(<App />)
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('seeded Blowout starts as Inactive', () => {
    render(<App />)
    expect(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i })).toHaveTextContent('Inactive')
  })

  it('seeded Haircut starts as Active', () => {
    render(<App />)
    expect(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Active')
  })

  it('toggles a service active/inactive and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    expect(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Inactive')
    expect(screen.getByText('Active: 1 of 3')).toBeInTheDocument()
  })

  it('toggles an inactive service back to active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i }))
    expect(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i })).toHaveTextContent('Active')
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
  })

  it('adds a new service and shows it with formatted price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Deep condition', '55')
    expect(screen.getByText('Deep condition')).toBeInTheDocument()
    expect(within(row('Deep condition')).getByText('$55.00')).toBeInTheDocument()
  })

  it('new service starts as Active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Trim', '15')
    expect(within(row('Trim')).getByRole('button', { name: /toggle trim/i })).toHaveTextContent('Active')
  })

  it('ignores adding a service with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^price$/i), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('ignores adding a service with invalid price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Ghost service')
    await u.type(screen.getByLabelText(/^price$/i), 'abc')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Ghost service')).not.toBeInTheDocument()
  })

  it('ignores adding a service with zero price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Free thing')
    await u.type(screen.getByLabelText(/^price$/i), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Free thing')).not.toBeInTheDocument()
  })

  it('stats view shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('stats view shows correct average price for all services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 85 + 40) / 3 = 50.00
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
  })

  it('stats view shows correct active average price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 85) / 2 = 55.00
    expect(screen.getByText('Active average: $55.00')).toBeInTheDocument()
  })

  it('stats reflect a toggle cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 2')).toBeInTheDocument()
    // active average is just Color treatment: 85.00
    expect(screen.getByText('Active average: $85.00')).toBeInTheDocument()
  })

  it('stats show $0.00 active average when all services inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Color treatment')).getByRole('button', { name: /toggle color treatment/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
  })

  it('toggle theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Services')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hide inactive hides Blowout on Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Services')
    expect(screen.queryByText('Blowout')).not.toBeInTheDocument()
  })

  it('hide inactive still counts Blowout in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('services state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Scalp massage', '30')
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Scalp massage')).toBeInTheDocument()
  })
})
