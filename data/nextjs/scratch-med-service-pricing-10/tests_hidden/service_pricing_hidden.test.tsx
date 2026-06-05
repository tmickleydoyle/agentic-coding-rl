import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(svcName: string): HTMLElement {
  const el = screen.getByText(svcName).closest('li')
  if (!el) throw new Error(`no row for ${svcName}`)
  return el as HTMLElement
}

async function addService(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText('Service name'))
  await u.type(screen.getByLabelText('Service name'), name)
  await u.clear(screen.getByLabelText('Price ($)'))
  await u.type(screen.getByLabelText('Price ($)'), price)
  await u.click(screen.getByRole('button', { name: /add service/i }))
}

describe('Service Pricing (held-out)', () => {
  it('seeded services all show Active toggle buttons', () => {
    render(<App />)
    expect(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Active')
    expect(within(row('Color')).getByRole('button', { name: /toggle color/i })).toHaveTextContent('Active')
    expect(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i })).toHaveTextContent('Active')
  })

  it('toggling two services updates Active summary to 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Color')).getByRole('button', { name: /toggle color/i }))
    expect(screen.getByText('Active: 1 of 3')).toBeInTheDocument()
  })

  it('Stats average (active) updates correctly after toggling', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Deactivate Haircut and Blowout, leave Color ($80) active
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price (active): $80.00')).toBeInTheDocument()
  })

  it('Stats average (all) remains stable regardless of active state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Color')).getByRole('button', { name: /toggle color/i }))
    await u.click(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i }))
    await nav(u, 'Stats')
    // All inactive, but average (all) still uses all prices
    expect(screen.getByText('Average price (all): $48.33')).toBeInTheDocument()
  })

  it('adding a service updates Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Wax', '20')
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active services: 4')).toBeInTheDocument()
  })

  it('adding a service updates the average price (all)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // (25 + 80 + 40 + 55) / 4 = 50.00
    await addService(u, 'Highlights', '55')
    await nav(u, 'Stats')
    expect(screen.getByText('Average price (all): $50.00')).toBeInTheDocument()
  })

  it('show inactive checkbox re-shows hidden services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Color')).getByRole('button', { name: /toggle color/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show inactive')) // hide inactive
    await nav(u, 'Services')
    expect(screen.queryByText('Color')).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show inactive')) // show again
    await nav(u, 'Services')
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('theme persists to Services view', async () => {
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

  it('Active summary reflects a newly added and then deactivated service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Deep Condition', '45')
    expect(screen.getByText('Active: 4 of 4')).toBeInTheDocument()
    await u.click(within(row('Deep Condition')).getByRole('button', { name: /toggle deep condition/i }))
    expect(screen.getByText('Active: 3 of 4')).toBeInTheDocument()
  })

  it('new service price is displayed with two decimals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Express Cut', '22')
    expect(within(row('Express Cut')).getByText('$22.00')).toBeInTheDocument()
  })
})
