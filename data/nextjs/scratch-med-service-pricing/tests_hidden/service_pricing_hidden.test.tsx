// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing Manager (held-out)', () => {
  it('shows Deactivate for Haircut and Activate for Trim on load', () => {
    render(<App />)
    const haircutLi = screen.getByText('Haircut').closest('li') as HTMLElement
    const trimLi = screen.getByText('Trim').closest('li') as HTMLElement
    expect(within(haircutLi).getByRole('button', { name: 'Deactivate' })).toBeInTheDocument()
    expect(within(trimLi).getByRole('button', { name: 'Activate' })).toBeInTheDocument()
  })

  it('deleting an active service reduces both total and active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Haircut' }))
    expect(screen.getByText('Active: 1 of 2')).toBeInTheDocument()
  })

  it('deleting all services makes avg all show $0.00 in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Haircut' }))
    await u.click(screen.getByRole('button', { name: 'Delete Coloring' }))
    await u.click(screen.getByRole('button', { name: 'Delete Trim' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price (all): $0.00')).toBeInTheDocument()
    expect(screen.getByText('Average price (active): $0.00')).toBeInTheDocument()
    expect(screen.getByText('Total services: 0')).toBeInTheDocument()
  })

  it('deactivating all active services makes active avg $0.00 in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutLi = screen.getByText('Haircut').closest('li') as HTMLElement
    const coloringLi = screen.getByText('Coloring').closest('li') as HTMLElement
    await u.click(within(haircutLi).getByRole('button', { name: 'Deactivate' }))
    await u.click(within(coloringLi).getByRole('button', { name: 'Deactivate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Average price (active): $0.00')).toBeInTheDocument()
  })

  it('adding a service updates stats total and averages correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Beard trim')
    await u.type(screen.getByLabelText('Price ($)'), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    // total now 4: 25+80+15+20=140 / 4 = 35.00
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Average price (all): $35.00')).toBeInTheDocument()
    // active: haircut(25), coloring(80), beard trim(20) = 125/3 = 41.67
    expect(screen.getByText('Average price (active): $41.67')).toBeInTheDocument()
  })

  it('toggling a service active status cross-updates stats inactive count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const haircutLi = screen.getByText('Haircut').closest('li') as HTMLElement
    await u.click(within(haircutLi).getByRole('button', { name: 'Deactivate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Inactive: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('hide inactive setting persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive'))
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.queryByText('Trim')).not.toBeInTheDocument()
  })

  it('un-hiding inactive restores Trim in services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive')) // hide
    await u.click(screen.getByLabelText('Hide inactive')) // show again
    await nav(u, 'Services')
    expect(screen.getByText('Trim')).toBeInTheDocument()
  })

  it('ignores a negative price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Invalid')
    await u.type(screen.getByLabelText('Price ($)'), '-5')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Invalid')).not.toBeInTheDocument()
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('toggle theme button shows current theme label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })
})
