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
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
    expect(screen.getByText('Hair Color')).toBeInTheDocument()
  })

  it('displays seeded prices formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
    expect(screen.getByText('$80.00')).toBeInTheDocument()
  })

  it('shows active count of 2 on load (two seeded active)', () => {
    render(<App />)
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
  })

  it('shows Active/Inactive toggle states for seeded services', () => {
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    expect(within(haircutRow).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Active')
    const colorRow = screen.getByText('Hair Color').closest('li') as HTMLElement
    expect(within(colorRow).getByRole('button', { name: /toggle hair color/i })).toHaveTextContent('Inactive')
  })

  it('toggles a service from active to inactive and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /toggle haircut/i }))
    expect(within(haircutRow).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Inactive')
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
  })

  it('toggles a service from inactive to active', async () => {
    const u = userEvent.setup()
    render(<App />)
    const colorRow = screen.getByText('Hair Color').closest('li') as HTMLElement
    await u.click(within(colorRow).getByRole('button', { name: /toggle hair color/i }))
    expect(within(colorRow).getByRole('button', { name: /toggle hair color/i })).toHaveTextContent('Active')
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
  })

  it('adds a new service and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Shave')
    await u.type(screen.getByLabelText(/^price$/i), '20.00')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Shave')).toBeInTheDocument()
    expect(screen.getByText('$20.00')).toBeInTheDocument()
  })

  it('ignores add when name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^price$/i), '10.00')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
  })

  it('ignores add when price is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Wax')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Wax')).not.toBeInTheDocument()
  })

  it('ignores add when price is zero or negative', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Freebie')
    await u.type(screen.getByLabelText(/^price$/i), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Freebie')).not.toBeInTheDocument()
  })

  it('removes a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    const beardRow = screen.getByText('Beard Trim').closest('li') as HTMLElement
    await u.click(within(beardRow).getByRole('button', { name: /remove beard trim/i }))
    expect(screen.queryByText('Beard Trim')).not.toBeInTheDocument()
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
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
    // (25 + 15 + 80) / 3 = 40.00
    expect(screen.getByText('Average price: $40.00')).toBeInTheDocument()
  })

  it('Summary shows correct active avg for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // active: Haircut 25 + Beard Trim 15 = 40 / 2 = 20.00
    expect(screen.getByText('Active avg: $20.00')).toBeInTheDocument()
  })

  it('Summary updates after toggling a service active (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const colorRow = screen.getByText('Hair Color').closest('li') as HTMLElement
    await u.click(within(colorRow).getByRole('button', { name: /toggle hair color/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 0')).toBeInTheDocument()
    // active avg: (25+15+80)/3 = 40.00
    expect(screen.getByText('Active avg: $40.00')).toBeInTheDocument()
  })

  it('Summary updates after adding a service (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Facial')
    await u.type(screen.getByLabelText(/^price$/i), '55.00')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    // (25+15+80+55)/4 = 175/4 = 43.75
    expect(screen.getByText('Average price: $43.75')).toBeInTheDocument()
  })

  it('Summary shows $0.00 averages when all services removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    const rows = screen.getAllByRole('listitem')
    for (const row of rows) {
      const btn = within(row as HTMLElement).queryByRole('button', { name: /^remove /i })
      if (btn) await u.click(btn)
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 0')).toBeInTheDocument()
    expect(screen.getByText('Average price: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active avg: $0.00')).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('toggles theme and persists data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Services')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset services restores original seeded list', async () => {
    const u = userEvent.setup()
    render(<App />)
    const colorRow = screen.getByText('Hair Color').closest('li') as HTMLElement
    await u.click(within(colorRow).getByRole('button', { name: /toggle hair color/i }))
    await u.type(screen.getByLabelText(/service name/i), 'Extras')
    await u.type(screen.getByLabelText(/^price$/i), '10')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset services/i }))
    await nav(u, 'Services')
    expect(screen.queryByText('Extras')).not.toBeInTheDocument()
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    const restoredColorRow = screen.getByText('Hair Color').closest('li') as HTMLElement
    expect(within(restoredColorRow).getByRole('button', { name: /toggle hair color/i })).toHaveTextContent('Inactive')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Perm')
    await u.type(screen.getByLabelText(/^price$/i), '120.00')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Summary')
    await nav(u, 'Services')
    expect(screen.getByText('Perm')).toBeInTheDocument()
    expect(screen.getByText('$120.00')).toBeInTheDocument()
  })
})
