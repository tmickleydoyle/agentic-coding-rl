import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addService(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText(/service name/i))
  await u.type(screen.getByLabelText(/service name/i), name)
  await u.clear(screen.getByLabelText(/^price$/i))
  await u.type(screen.getByLabelText(/^price$/i), price)
  await u.click(screen.getByRole('button', { name: /add service/i }))
}

describe('Service Pricing Manager', () => {
  it('starts on the Services view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
    expect(screen.getByText('Deep conditioning')).toBeInTheDocument()
  })

  it('displays seeded prices formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('$85.00')).toBeInTheDocument()
    expect(screen.getByText('$45.00')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Services from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: /services/i })).toBeInTheDocument()
  })

  it('adds a new service and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Blowout', '35')
    expect(screen.getByRole('heading', { name: /services \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Blowout')).toBeInTheDocument()
    expect(screen.getByText('$35.00')).toBeInTheDocument()
  })

  it('ignores a service with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/^price$/i))
    await u.type(screen.getByLabelText(/^price$/i), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('ignores a service with a zero price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Freebie', '0')
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('new service is active by default and shows Deactivate button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Trim', '15')
    expect(screen.getByRole('button', { name: /deactivate trim/i })).toBeInTheDocument()
  })

  it('deactivates an active service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    expect(screen.getByRole('button', { name: /activate haircut/i })).toBeInTheDocument()
  })

  it('activates an inactive service', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: /activate deep conditioning/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /activate deep conditioning/i }))
    expect(screen.getByRole('button', { name: /deactivate deep conditioning/i })).toBeInTheDocument()
  })

  it('Active only filter hides inactive services but count stays the same', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/active only/i))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Deep conditioning')).not.toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
  })

  it('unchecking Active only restores all services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText(/active only/i))
    await u.click(screen.getByLabelText(/active only/i))
    expect(screen.getByText('Deep conditioning')).toBeInTheDocument()
  })

  it('Stats shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total services: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/^Active: 2$/)).toBeInTheDocument()
    expect(screen.getByText(/inactive: 1/i)).toBeInTheDocument()
  })

  it('Stats shows correct average price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 85 + 45) / 3 = 51.67
    expect(screen.getByText(/average price: \$51\.67/i)).toBeInTheDocument()
  })

  it('Stats shows correct active average for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 85) / 2 = 55.00
    expect(screen.getByText(/active average: \$55\.00/i)).toBeInTheDocument()
  })

  it('Stats updates after toggling a service (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/^Active: 1$/)).toBeInTheDocument()
    expect(screen.getByText(/inactive: 2/i)).toBeInTheDocument()
    // active average is only Color treatment = 85.00
    expect(screen.getByText(/active average: \$85\.00/i)).toBeInTheDocument()
  })

  it('Stats shows $0.00 averages after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset services/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total services: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/average price: \$0\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/active average: \$0\.00/i)).toBeInTheDocument()
  })

  it('Reset services clears the list on Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset services/i }))
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: /services \(0\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Stats updates after adding a new service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Scalp massage', '60')
    await nav(u, 'Stats')
    expect(screen.getByText(/total services: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/^Active: 3$/)).toBeInTheDocument()
  })

  it('services state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Keratin', '120')
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Keratin')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /services \(4\)/i })).toBeInTheDocument()
  })
})
