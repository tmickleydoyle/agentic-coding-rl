// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('Service Pricing Manager (held-out)', () => {
  it('toggling deep conditioning active changes active count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /activate deep conditioning/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/^Active: 3$/)).toBeInTheDocument()
    expect(screen.getByText(/inactive: 0/i)).toBeInTheDocument()
  })

  it('active average updates when previously-inactive service is activated', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /activate deep conditioning/i }))
    await nav(u, 'Stats')
    // all three active: (25 + 85 + 45) / 3 = 51.67
    expect(screen.getByText(/active average: \$51\.67/i)).toBeInTheDocument()
  })

  it('adding multiple services increments count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Wax', '30')
    await addService(u, 'Eyebrow shape', '20')
    expect(screen.getByRole('heading', { name: /services \(5\)/i })).toBeInTheDocument()
  })

  it('ignores a negative price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Bad deal', '-10')
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('Active only filter shows newly added active service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Lash lift', '70')
    await u.click(screen.getByLabelText(/active only/i))
    expect(screen.getByText('Lash lift')).toBeInTheDocument()
    expect(screen.queryByText('Deep conditioning')).not.toBeInTheDocument()
  })

  it('deactivate then reactivate restores Deactivate button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate color treatment/i }))
    await u.click(screen.getByRole('button', { name: /activate color treatment/i }))
    expect(screen.getByRole('button', { name: /deactivate color treatment/i })).toBeInTheDocument()
  })

  it('Stats inactive count updates after deactivating two services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByRole('button', { name: /deactivate color treatment/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/inactive: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/^Active: 0$/)).toBeInTheDocument()
    expect(screen.getByText(/active average: \$0\.00/i)).toBeInTheDocument()
  })

  it('after reset, adding a service shows count of 1 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset services/i }))
    await nav(u, 'Services')
    await addService(u, 'Single service', '50')
    await nav(u, 'Stats')
    expect(screen.getByText(/total services: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/average price: \$50\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/active average: \$50\.00/i)).toBeInTheDocument()
  })

  it('theme persists back to Services after being set to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Services')
    expect(root()).toHaveAttribute('data-theme', 'dark')
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

  it('average price is correct with decimal-price service added', async () => {
    const u = userEvent.setup()
    render(<App />)
    // reset first then add one known service
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset services/i }))
    await nav(u, 'Services')
    await addService(u, 'Toner', '33.50')
    await nav(u, 'Stats')
    expect(screen.getByText(/average price: \$33\.50/i)).toBeInTheDocument()
  })
})
