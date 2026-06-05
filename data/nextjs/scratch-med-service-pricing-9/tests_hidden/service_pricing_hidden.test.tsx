// HELD-OUT generalization tests — fresh scenarios not seen during generation.
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

describe('Service Pricing (held-out)', () => {
  it('each seeded service has a Toggle button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /toggle haircut/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /toggle color treatment/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /toggle deep conditioning/i })).toBeInTheDocument()
  })

  it('toggling inactive service to active is reflected under Show Active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Deep conditioning starts inactive, activate it
    await u.click(within(row('Deep conditioning')).getByRole('button', { name: /toggle deep conditioning/i }))
    await u.click(screen.getByRole('button', { name: /show active/i }))
    expect(screen.getByText('Deep conditioning')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('Summary average price updates after adding a new service', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add $50 service => (25+80+45+50)/4 = 50.00
    await addService(u, 'Scalp massage', '50')
    await nav(u, 'Summary')
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
  })

  it('Summary active average updates after toggling a service off', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Turn off Color treatment (80), only Haircut (25) active => active avg = 25.00
    await u.click(within(row('Color treatment')).getByRole('button', { name: /toggle color treatment/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active average: $25.00')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('Summary counts are unaffected by Services view filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /show active/i }))
    await nav(u, 'Summary')
    // Summary always uses full unfiltered list
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('toggling theme back to light works', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('adding multiple services updates heading count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Eyebrow tint', '20')
    await addService(u, 'Lash lift', '60')
    expect(screen.getByRole('heading', { name: /services \(5\)/i })).toBeInTheDocument()
  })

  it('Show Active count matches newly toggled state after multiple toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Toggle Haircut off, Deep conditioning on => 2 active
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Deep conditioning')).getByRole('button', { name: /toggle deep conditioning/i }))
    await u.click(screen.getByRole('button', { name: /show active/i }))
    expect(screen.getByRole('heading', { name: /services \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
    expect(screen.getByText('Deep conditioning')).toBeInTheDocument()
  })

  it('new service price is formatted to two decimals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Quick trim', '15')
    expect(screen.getByText('$15.00')).toBeInTheDocument()
  })

  it('Summary inactive count updates after activating deep conditioning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Deep conditioning')).getByRole('button', { name: /toggle deep conditioning/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Inactive: 0')).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })
})
