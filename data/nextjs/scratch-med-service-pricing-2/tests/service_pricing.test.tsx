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

describe('Service Pricing Manager', () => {
  it('starts on the Services view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    expect(screen.getByText('Logo design')).toBeInTheDocument()
    expect(screen.getByText('Business card print')).toBeInTheDocument()
    expect(screen.getByText('Social media kit')).toBeInTheDocument()
  })

  it('shows seeded prices formatted correctly', () => {
    render(<App />)
    expect(screen.getByText('$150.00')).toBeInTheDocument()
    expect(screen.getByText('$45.50')).toBeInTheDocument()
    expect(screen.getByText('$89.00')).toBeInTheDocument()
  })

  it('shows initial active count from seeded data', () => {
    render(<App />)
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
  })

  it('seeded active services show Deactivate, inactive shows Activate', () => {
    render(<App />)
    expect(within(row('Logo design')).getByRole('button', { name: /deactivate logo design/i })).toBeInTheDocument()
    expect(within(row('Social media kit')).getByRole('button', { name: /activate social media kit/i })).toBeInTheDocument()
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

  it('adds a new service and it appears in the list as active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Web design')
    await u.type(screen.getByLabelText('Price'), '200')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Web design')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
    expect(within(row('Web design')).getByRole('button', { name: /deactivate web design/i })).toBeInTheDocument()
  })

  it('increments active count after adding a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Email campaign')
    await u.type(screen.getByLabelText('Price'), '60')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
  })

  it('ignores adding a service with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Price'), '100')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
  })

  it('ignores adding a service with a zero price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Free thing')
    await u.type(screen.getByLabelText('Price'), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Free thing')).not.toBeInTheDocument()
  })

  it('toggles an active service to inactive and updates active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Logo design')).getByRole('button', { name: /deactivate logo design/i }))
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
    expect(within(row('Logo design')).getByRole('button', { name: /activate logo design/i })).toBeInTheDocument()
  })

  it('toggles an inactive service to active and updates active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Social media kit')).getByRole('button', { name: /activate social media kit/i }))
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(within(row('Social media kit')).getByRole('button', { name: /deactivate social media kit/i })).toBeInTheDocument()
  })

  it('removes a service and it disappears', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Business card print')).getByRole('button', { name: /remove business card print/i }))
    expect(screen.queryByText('Business card print')).not.toBeInTheDocument()
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
  })

  it('stats view shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('stats view shows correct average price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (150 + 45.50 + 89) / 3 = 284.50 / 3 = 94.8333... => $94.83
    expect(screen.getByText('Average price: $94.83')).toBeInTheDocument()
  })

  it('stats view shows correct active percentage for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // 2/3 = 66.67 => 67%
    expect(screen.getByText('Active %: 67%')).toBeInTheDocument()
  })

  it('stats reflect toggling a service inactive (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Logo design')).getByRole('button', { name: /deactivate logo design/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 2')).toBeInTheDocument()
    expect(screen.getByText('Active %: 33%')).toBeInTheDocument()
  })

  it('stats reflect adding a new service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Flyer design')
    await u.type(screen.getByLabelText('Price'), '50')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })

  it('stats show $0.00 average and 0% when all services removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    const names = ['Logo design', 'Business card print', 'Social media kit']
    for (const name of names) {
      await u.click(within(row(name)).getByRole('button', { name: new RegExp(`remove ${name}`, 'i') }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 0')).toBeInTheDocument()
    expect(screen.getByText('Average price: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active %: 0%')).toBeInTheDocument()
  })

  it('theme toggles via data-theme attribute and persists across views', async () => {
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

  it('hide inactive hides Social media kit on Services view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive services'))
    await nav(u, 'Services')
    expect(screen.queryByText('Social media kit')).not.toBeInTheDocument()
    expect(screen.getByText('Logo design')).toBeInTheDocument()
  })

  it('hidden inactive services still count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Hide inactive services'))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Social media kit')).getByRole('button', { name: /activate social media kit/i }))
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(within(row('Social media kit')).getByRole('button', { name: /deactivate social media kit/i })).toBeInTheDocument()
  })
})
