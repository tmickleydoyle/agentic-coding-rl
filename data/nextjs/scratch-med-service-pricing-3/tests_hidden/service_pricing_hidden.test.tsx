// HELD-OUT generalization tests — fresh scenarios and cross-view paths not in the visible suite.
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

describe('Service Pricing Manager (held-out)', () => {
  it('deleting an active service decrements Active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const brandRow = screen.getByText('Brand consultation').closest('li') as HTMLElement
    await u.click(within(brandRow).getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('deleting an inactive service does not change Active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const kitRow = screen.getByText('Social media kit').closest('li') as HTMLElement
    await u.click(within(kitRow).getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('Stats reflects a newly added active service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Motion graphics', '300')
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    // (120 + 200 + 85 + 300) / 4 = 176.25
    expect(screen.getByText('Average price (all): $176.25')).toBeInTheDocument()
  })

  it('Stats active average excludes inactive after deactivation', async () => {
    const u = userEvent.setup()
    render(<App />)
    // deactivate Logo design so only Brand consultation (200) is active
    const logoRow = screen.getByText('Logo design').closest('li') as HTMLElement
    await u.click(within(logoRow).getByRole('button', { name: 'Deactivate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
    expect(screen.getByText('Average price (active): $200.00')).toBeInTheDocument()
  })

  it('deactivating all services shows $0.00 active average in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    // deactivate Logo design and Brand consultation (Social media kit already inactive)
    const logoRow = screen.getByText('Logo design').closest('li') as HTMLElement
    await u.click(within(logoRow).getByRole('button', { name: 'Deactivate' }))
    const brandRow = screen.getByText('Brand consultation').closest('li') as HTMLElement
    await u.click(within(brandRow).getByRole('button', { name: 'Deactivate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price (active): $0.00')).toBeInTheDocument()
  })

  it('re-enabling Show inactive restores hidden services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show inactive/i)) // uncheck
    await u.click(screen.getByLabelText(/show inactive/i)) // re-check
    await nav(u, 'Services')
    expect(screen.getByText('Social media kit')).toBeInTheDocument()
  })

  it('newly added service is visible when Show inactive is off (because it is active)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show inactive/i))
    await nav(u, 'Services')
    await addService(u, 'Brochure design', '95')
    expect(screen.getByText('Brochure design')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats Inactive services count updates after activating a service cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    const kitRow = screen.getByText('Social media kit').closest('li') as HTMLElement
    await u.click(within(kitRow).getByRole('button', { name: 'Activate' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Inactive services: 0')).toBeInTheDocument()
  })

  it('price is formatted to two decimal places for a whole-number price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Quick edit', '50')
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('Active and Total counts update after multiple adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Service A', '10')
    await addService(u, 'Service B', '20')
    expect(screen.getByText('Active: 4')).toBeInTheDocument()
    expect(screen.getByText('Total: 5')).toBeInTheDocument()
  })
})
