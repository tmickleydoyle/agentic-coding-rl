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

describe('Service Pricing Manager', () => {
  it('starts on the Services view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByText('Logo design')).toBeInTheDocument()
    expect(screen.getByText('Brand consultation')).toBeInTheDocument()
    expect(screen.getByText('Social media kit')).toBeInTheDocument()
  })

  it('shows seeded active and total counts', () => {
    render(<App />)
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('shows seeded prices formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$120.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
    expect(screen.getByText('$85.00')).toBeInTheDocument()
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

  it('adds a new service and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Print design', '50')
    expect(screen.getByText('Print design')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('new service is active by default and updates Active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Icon set', '75')
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('ignores add when name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/service name/i))
    await u.type(screen.getByLabelText(/price \(\$\)/i), '100')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('ignores add when price is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/service name/i), 'Ghost service')
    await u.clear(screen.getByLabelText(/price \(\$\)/i))
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('toggles an active service to inactive with Deactivate button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const logoRow = screen.getByText('Logo design').closest('li') as HTMLElement
    await u.click(within(logoRow).getByRole('button', { name: 'Deactivate' }))
    expect(within(logoRow).getByRole('button', { name: 'Activate' })).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('toggles an inactive service to active with Activate button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const kitRow = screen.getByText('Social media kit').closest('li') as HTMLElement
    await u.click(within(kitRow).getByRole('button', { name: 'Activate' }))
    expect(within(kitRow).getByRole('button', { name: 'Deactivate' })).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })

  it('deletes a service and updates totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    const logoRow = screen.getByText('Logo design').closest('li') as HTMLElement
    await u.click(within(logoRow).getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('Logo design')).not.toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
  })

  it('Stats view shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('Stats view shows correct average price for all seeded services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (120 + 200 + 85) / 3 = 135.00
    expect(screen.getByText('Average price (all): $135.00')).toBeInTheDocument()
  })

  it('Stats view shows correct average price for active seeded services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (120 + 200) / 2 = 160.00
    expect(screen.getByText('Average price (active): $160.00')).toBeInTheDocument()
  })

  it('Stats view updates after toggling a service (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const kitRow = screen.getByText('Social media kit').closest('li') as HTMLElement
    await u.click(within(kitRow).getByRole('button', { name: 'Activate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    // (120 + 200 + 85) / 3 = 135.00
    expect(screen.getByText('Average price (active): $135.00')).toBeInTheDocument()
  })

  it('Stats view shows $0.00 averages when no services exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete all three seeded services
    const rows = screen.getAllByRole('button', { name: 'Delete' })
    for (let i = rows.length - 1; i >= 0; i--) {
      await u.click(rows[i])
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Average price (all): $0.00')).toBeInTheDocument()
    expect(screen.getByText('Average price (active): $0.00')).toBeInTheDocument()
  })

  it('Show inactive checkbox hides inactive services in Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show inactive/i))
    await nav(u, 'Services')
    expect(screen.queryByText('Social media kit')).not.toBeInTheDocument()
    expect(screen.getByText('Logo design')).toBeInTheDocument()
  })

  it('hidden inactive services still counted in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show inactive/i))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Services')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('service list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Poster layout', '60')
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Poster layout')).toBeInTheDocument()
  })
})
