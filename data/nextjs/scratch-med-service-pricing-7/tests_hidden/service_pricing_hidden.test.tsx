// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing (held-out)', () => {
  it('active count updates immediately after toggling all three seeded services inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    const beardRow = screen.getByText('Beard Trim').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(beardRow).getByRole('button', { name: /toggle beard trim/i }))
    expect(screen.getByText('Active services: 0')).toBeInTheDocument()
  })

  it('Summary inactive count is correct after deactivating one seeded service', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /toggle haircut/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Inactive: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('Summary active avg is $0.00 when all active services are removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove both active services (Haircut and Beard Trim)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /remove haircut/i }))
    const beardRow = screen.getByText('Beard Trim').closest('li') as HTMLElement
    await u.click(within(beardRow).getByRole('button', { name: /remove beard trim/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active avg: $0.00')).toBeInTheDocument()
    // Hair Color is still there but inactive
    expect(screen.getByText('Total services: 1')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
  })

  it('adding a new service makes it active by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Highlights')
    await u.type(screen.getByLabelText(/^price$/i), '90')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    const newRow = screen.getByText('Highlights').closest('li') as HTMLElement
    expect(within(newRow).getByRole('button', { name: /toggle highlights/i })).toHaveTextContent('Active')
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
  })

  it('removing a service updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    const colorRow = screen.getByText('Hair Color').closest('li') as HTMLElement
    await u.click(within(colorRow).getByRole('button', { name: /remove hair color/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 2')).toBeInTheDocument()
    // (25+15)/2 = 20.00
    expect(screen.getByText('Average price: $20.00')).toBeInTheDocument()
  })

  it('theme persists after navigating to Summary and back to Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('reset restores Summary stats to seeded values', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add and toggle to dirty state
    await u.type(screen.getByLabelText(/service name/i), 'Tint')
    await u.type(screen.getByLabelText(/^price$/i), '45')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset services/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
    expect(screen.getByText('Average price: $40.00')).toBeInTheDocument()
    expect(screen.getByText('Active avg: $20.00')).toBeInTheDocument()
  })

  it('price with decimals is stored and displayed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Trim')
    await u.type(screen.getByLabelText(/^price$/i), '12.50')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('$12.50')).toBeInTheDocument()
  })

  it('toggle button label flips back when toggled twice', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutRow = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutRow).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(haircutRow).getByRole('button', { name: /toggle haircut/i }))
    expect(within(haircutRow).getByRole('button', { name: /toggle haircut/i })).toHaveTextContent('Active')
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
  })
})
