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

describe('Service Pricing Manager (held-out)', () => {
  it('all three seeded services are visible on load', () => {
    render(<App />)
    expect(screen.getByText('Logo design')).toBeInTheDocument()
    expect(screen.getByText('Business card print')).toBeInTheDocument()
    expect(screen.getByText('Social media kit')).toBeInTheDocument()
  })

  it('adding two new services raises total to 5 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const [name, price] of [['Print banner', '75'], ['Video reel', '320']]) {
      await u.clear(screen.getByLabelText('Service name'))
      await u.type(screen.getByLabelText('Service name'), name)
      await u.clear(screen.getByLabelText('Price'))
      await u.type(screen.getByLabelText('Price'), price)
      await u.click(screen.getByRole('button', { name: /add service/i }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 5')).toBeInTheDocument()
    expect(screen.getByText('Active: 4')).toBeInTheDocument()
  })

  it('deactivating all three seeds makes active count 0 and Stats shows 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Logo design')).getByRole('button', { name: /deactivate logo design/i }))
    await u.click(within(row('Business card print')).getByRole('button', { name: /deactivate business card print/i }))
    // Social media kit is already inactive
    expect(screen.getByText('Active services: 0')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 3')).toBeInTheDocument()
    expect(screen.getByText('Active %: 0%')).toBeInTheDocument()
  })

  it('average price updates after removing a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    // remove Business card print (45.50); remaining: 150 + 89 = 239 / 2 = 119.50
    await u.click(within(row('Business card print')).getByRole('button', { name: /remove business card print/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price: $119.50')).toBeInTheDocument()
    expect(screen.getByText('Total services: 2')).toBeInTheDocument()
  })

  it('average price updates after adding a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    // add one more: $75; total = 150 + 45.50 + 89 + 75 = 359.50 / 4 = 89.875 => $89.88
    await u.type(screen.getByLabelText('Service name'), 'Print banner')
    await u.type(screen.getByLabelText('Price'), '75')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price: $89.88')).toBeInTheDocument()
  })

  it('toggling inactive then back to active reflects correctly in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Social media kit')).getByRole('button', { name: /activate social media kit/i }))
    await u.click(within(row('Social media kit')).getByRole('button', { name: /deactivate social media kit/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('hide inactive setting persists when navigating back to Settings', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive services'))
    await nav(u, 'Services')
    await nav(u, 'Settings')
    expect(screen.getByLabelText('Hide inactive services')).toBeChecked()
  })

  it('unhiding inactive restores Social media kit on Services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive services'))
    await u.click(screen.getByLabelText('Hide inactive services'))
    await nav(u, 'Services')
    expect(screen.getByText('Social media kit')).toBeInTheDocument()
  })

  it('new service added while hiding inactive is shown (it is active)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive services'))
    await nav(u, 'Services')
    await u.type(screen.getByLabelText('Service name'), 'Brand guide')
    await u.type(screen.getByLabelText('Price'), '120')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Brand guide')).toBeInTheDocument()
  })

  it('Stats active % is 100 when all services are active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Social media kit')).getByRole('button', { name: /activate social media kit/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active %: 100%')).toBeInTheDocument()
  })

  it('removing a service updates active count on Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Logo design')).getByRole('button', { name: /remove logo design/i }))
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
  })

  it('theme toggle button text reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })
})
