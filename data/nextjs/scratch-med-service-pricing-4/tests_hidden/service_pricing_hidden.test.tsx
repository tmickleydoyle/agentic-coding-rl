// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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

describe('Service Pricing Manager (held-out)', () => {
  it('active count updates after adding a new service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Waxing', '45')
    // new service is active, so 3 active of 4 total
    expect(screen.getByText('Active: 3 of 4')).toBeInTheDocument()
  })

  it('adding multiple services reflects in stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Manicure', '35')
    await addService(u, 'Pedicure', '45')
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 5')).toBeInTheDocument()
  })

  it('average price recalculates after adding a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed: 25+85+40=150, /3=50. Add 50: total=200/4=50.00
    await addService(u, 'Extra', '50')
    await nav(u, 'Stats')
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
  })

  it('toggling Blowout to active changes active average', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i }))
    await nav(u, 'Stats')
    // all 3 active: (25+85+40)/3 = 50.00
    expect(screen.getByText('Active average: $50.00')).toBeInTheDocument()
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
  })

  it('double-toggling a service leaves state unchanged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
    expect(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Active')
  })

  it('unhiding inactive restores Blowout on Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i)) // hide
    await u.click(screen.getByLabelText(/hide inactive/i)) // unhide
    await nav(u, 'Services')
    expect(screen.getByText('Blowout')).toBeInTheDocument()
  })

  it('negative price is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Phantom')
    await u.type(screen.getByLabelText(/^price$/i), '-10')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Phantom')).not.toBeInTheDocument()
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('new service price displays with two decimals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Quick trim', '12.5')
    expect(within(row('Quick trim')).getByText('$12.50')).toBeInTheDocument()
  })

  it('stats inactive services count updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    // make Haircut inactive too
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Inactive services: 2')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('hide inactive does not affect active count line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Services')
    // count still shows real numbers including hidden inactive
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('all services can be made inactive and stats reflect zero active average', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Color treatment')).getByRole('button', { name: /toggle color treatment/i }))
    // Blowout already inactive
    expect(screen.getByText('Active: 0 of 3')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 0')).toBeInTheDocument()
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
    // overall average still counts all
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
  })
})
