import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing Manager', () => {
  it('starts on the Services view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
  })

  it('shows the three seeded services on load', () => {
    render(<App />)
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
    expect(screen.getByText('Deep condition')).toBeInTheDocument()
  })

  it('shows seeded prices formatted with dollar sign', () => {
    render(<App />)
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('$85.00')).toBeInTheDocument()
    expect(screen.getByText('$40.00')).toBeInTheDocument()
  })

  it('shows Active: 3 of 3 on initial load', () => {
    render(<App />)
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
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

  it('navigates back to Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
  })

  it('adds a new service and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Blowout')
    await u.type(screen.getByLabelText('Price'), '35')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Blowout')).toBeInTheDocument()
    expect(screen.getByText('$35.00')).toBeInTheDocument()
  })

  it('active count increases when a service is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Trim')
    await u.type(screen.getByLabelText('Price'), '15')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active: 4 of 4')).toBeInTheDocument()
  })

  it('ignores a blank service name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Price'), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('ignores a zero price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Freebie')
    await u.type(screen.getByLabelText('Price'), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Freebie')).not.toBeInTheDocument()
  })

  it('deactivates a service and updates active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
    expect(within(haircutRow).getByRole('button', { name: /activate/i })).toBeInTheDocument()
  })

  it('reactivates a service and restores active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await u.click(within(haircutRow).getByRole('button', { name: /activate/i }))
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('filter Show active only hides inactive services', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await u.click(screen.getByRole('button', { name: /show active only/i }))
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
    expect(screen.getByText('Color treatment')).toBeInTheDocument()
  })

  it('filter Show all restores the full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await u.click(screen.getByRole('button', { name: /show active only/i }))
    await u.click(screen.getByRole('button', { name: /show all/i }))
    expect(screen.getByText('Haircut')).toBeInTheDocument()
  })

  it('Stats view shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 0')).toBeInTheDocument()
  })

  it('Stats shows correct average price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 85 + 40) / 3 = 50.00
    expect(screen.getByText('Average price: $50.00')).toBeInTheDocument()
  })

  it('Stats updates when a service is deactivated (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('Active average excludes inactive services', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Stats')
    // active: Color treatment $85, Deep condition $40 => avg = 62.50
    expect(screen.getByText('Active average: $62.50')).toBeInTheDocument()
  })

  it('Stats shows $0.00 averages after clearing all services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all services/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Total services: 0')).toBeInTheDocument()
  })

  it('clear all services also empties the Services list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all services/i }))
    await nav(u, 'Services')
    expect(screen.getByText('Active: 0 of 0')).toBeInTheDocument()
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
  })

  it('theme toggle persists across views', async () => {
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

  it('new service shows Deactivate button initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Shampoo')
    await u.type(screen.getByLabelText('Price'), '12')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    const row = screen.getByText('Shampoo').closest('li') as HTMLElement
    expect(within(row).getByRole('button', { name: /deactivate/i })).toBeInTheDocument()
  })
})
