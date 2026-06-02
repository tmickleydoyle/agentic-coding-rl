import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing Manager (held-out)', () => {
  it('seeded services all show Deactivate buttons on load', () => {
    render(<App />)
    const deactivateBtns = screen.getAllByRole('button', { name: /deactivate/i })
    expect(deactivateBtns.length).toBe(3)
  })

  it('deactivating two services shows Active: 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    const rows = screen.getAllByRole('listitem')
    await u.click(within(rows[0]).getByRole('button', { name: /deactivate/i }))
    await u.click(within(rows[1]).getByRole('button', { name: /deactivate/i }))
    expect(screen.getByText('Active: 1 of 3')).toBeInTheDocument()
  })

  it('Stats inactive count matches number of deactivated services', async () => {
    const u = userEvent.setup()
    render(<App />)
    const colorRow = screen.getByText('Color treatment').closest('li') as HTMLElement
    const deepRow = screen.getByText('Deep condition').closest('li') as HTMLElement
    await u.click(within(colorRow).getByRole('button', { name: /deactivate/i }))
    await u.click(within(deepRow).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Inactive services: 2')).toBeInTheDocument()
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
  })

  it('average price is unaffected by active/inactive toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    const colorRow = screen.getByText('Color treatment').closest('li') as HTMLElement
    await u.click(within(colorRow).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Stats')
    // still (25+85+40)/3 = 50.00
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
  })

  it('active average is $0.00 when all deactivated', async () => {
    const u = userEvent.setup()
    render(<App />)
    const items = screen.getAllByRole('listitem')
    for (let i = 0; i < items.length; i++) {
      const btn = within(items[i]).queryByRole('button', { name: /deactivate/i })
      if (btn) await u.click(btn)
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
  })

  it('adding a service updates Stats total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Scalp massage')
    await u.type(screen.getByLabelText('Price'), '50')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active services: 4')).toBeInTheDocument()
  })

  it('adding multiple services recalculates average price correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    // clear first
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all services/i }))
    await nav(u, 'Services')
    await u.type(screen.getByLabelText('Service name'), 'Service A')
    await u.type(screen.getByLabelText('Price'), '10')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await u.type(screen.getByLabelText('Service name'), 'Service B')
    await u.type(screen.getByLabelText('Price'), '30')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    // (10+30)/2 = 20.00
    expect(screen.getByText('Average price: $20.00')).toBeInTheDocument()
  })

  it('Show active only does not change active count line', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await u.click(screen.getByRole('button', { name: /show active only/i }))
    // active count line still reflects truth
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('services list is empty after clear all and shows Active: 0 of 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all services/i }))
    await nav(u, 'Services')
    expect(screen.getByText('Active: 0 of 0')).toBeInTheDocument()
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
    expect(screen.queryByText('Color treatment')).not.toBeInTheDocument()
    expect(screen.queryByText('Deep condition')).not.toBeInTheDocument()
  })

  it('theme starts light and can toggle to dark and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('state persists when navigating away and back to Services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Keratin')
    await u.type(screen.getByLabelText('Price'), '120')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Keratin')).toBeInTheDocument()
    expect(screen.getByText('$120.00')).toBeInTheDocument()
  })

  it('Stats active average updates after new service is deactivated', async () => {
    const u = userEvent.setup()
    render(<App />)
    // deactivate Haircut ($25), active remaining: Color $85, Deep $40 => avg = 62.50
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active average: $62.50')).toBeInTheDocument()
  })
})
