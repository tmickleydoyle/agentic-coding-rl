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

  it('shows seed data on load', () => {
    render(<App />)
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Coloring')).toBeInTheDocument()
    expect(screen.getByText('Trim')).toBeInTheDocument()
  })

  it('displays seed prices formatted as $N.NN', () => {
    render(<App />)
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('$80.00')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
  })

  it('shows correct initial active count', () => {
    render(<App />)
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
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

  it('adds a new service and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Blowout')
    await u.type(screen.getByLabelText('Price ($)'), '45')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Blowout')).toBeInTheDocument()
    expect(screen.getByText('$45.00')).toBeInTheDocument()
  })

  it('new service defaults to active and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Blowout')
    await u.type(screen.getByLabelText('Price ($)'), '45')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active: 3 of 4')).toBeInTheDocument()
  })

  it('ignores a blank service name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Price ($)'), '10')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('ignores a non-positive price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Free thing')
    await u.type(screen.getByLabelText('Price ($)'), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Free thing')).not.toBeInTheDocument()
  })

  it('deactivating a service changes its button and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Haircut is active — click Deactivate
    const haircutLi = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutLi).getByRole('button', { name: 'Deactivate' }))
    expect(within(haircutLi).getByRole('button', { name: 'Activate' })).toBeInTheDocument()
    expect(screen.getByText('Active: 1 of 3')).toBeInTheDocument()
  })

  it('activating a service changes its button and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Trim is inactive — click Activate
    const trimLi = screen.getByText('Trim').closest('li') as HTMLElement
    await u.click(within(trimLi).getByRole('button', { name: 'Activate' }))
    expect(within(trimLi).getByRole('button', { name: 'Deactivate' })).toBeInTheDocument()
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('deletes a service from the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Trim' }))
    expect(screen.queryByText('Trim')).not.toBeInTheDocument()
    expect(screen.getByText('Active: 2 of 2')).toBeInTheDocument()
  })

  it('stats shows correct totals for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('stats shows correct average price for all seed services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 80 + 15) / 3 = 40.00
    expect(screen.getByText('Average price (all): $40.00')).toBeInTheDocument()
  })

  it('stats shows correct average price for active seed services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 80) / 2 = 52.50
    expect(screen.getByText('Average price (active): $52.50')).toBeInTheDocument()
  })

  it('stats reflects a toggle via cross-view shared state', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Activate Trim so all 3 are active
    const trimLi = screen.getByText('Trim').closest('li') as HTMLElement
    await u.click(within(trimLi).getByRole('button', { name: 'Activate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 0')).toBeInTheDocument()
    // (25 + 80 + 15) / 3 = 40.00
    expect(screen.getByText('Average price (active): $40.00')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Services')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('hide inactive hides Trim in Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive'))
    await nav(u, 'Services')
    expect(screen.queryByText('Trim')).not.toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
  })

  it('hidden inactive services still appear in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive'))
    await nav(u, 'Stats')
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
  })

  it('services state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Deep condition')
    await u.type(screen.getByLabelText('Price ($)'), '60')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Deep condition')).toBeInTheDocument()
  })
})
