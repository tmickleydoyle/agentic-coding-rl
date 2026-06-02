import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(svcName: string): HTMLElement {
  const el = screen.getByText(svcName).closest('li')
  if (!el) throw new Error(`no row for ${svcName}`)
  return el as HTMLElement
}

async function addService(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText('Service name'))
  await u.type(screen.getByLabelText('Service name'), name)
  await u.clear(screen.getByLabelText('Price ($)'))
  await u.type(screen.getByLabelText('Price ($)'), price)
  await u.click(screen.getByRole('button', { name: /add service/i }))
}

describe('Service Pricing Manager', () => {
  it('starts on the Services view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
  })

  it('shows the three seeded services', () => {
    render(<App />)
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
    expect(screen.getByText('Blowout')).toBeInTheDocument()
  })

  it('displays seeded service prices formatted correctly', () => {
    render(<App />)
    expect(within(row('Haircut')).getByText('$25.00')).toBeInTheDocument()
    expect(within(row('Color')).getByText('$80.00')).toBeInTheDocument()
    expect(within(row('Blowout')).getByText('$40.00')).toBeInTheDocument()
  })

  it('shows correct initial Active summary', () => {
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

  it('navigates back to Services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
  })

  it('adds a new service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Trim', '15')
    expect(screen.getByText('Trim')).toBeInTheDocument()
    expect(within(row('Trim')).getByText('$15.00')).toBeInTheDocument()
  })

  it('new service starts as Active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Gloss', '30')
    expect(within(row('Gloss')).getByRole('button', { name: /toggle gloss/i })).toHaveTextContent('Active')
  })

  it('ignores a blank service name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Price ($)'))
    await u.type(screen.getByLabelText('Price ($)'), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('ignores a zero price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Bad')
    await u.clear(screen.getByLabelText('Price ($)'))
    await u.type(screen.getByLabelText('Price ($)'), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Bad')).not.toBeInTheDocument()
  })

  it('toggling a service changes its button label', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = within(row('Haircut')).getByRole('button', { name: /toggle haircut/i })
    expect(btn).toHaveTextContent('Active')
    await u.click(btn)
    expect(btn).toHaveTextContent('Inactive')
  })

  it('toggling updates the Active summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Color')).getByRole('button', { name: /toggle color/i }))
    expect(screen.getByText('Active: 2 of 3')).toBeInTheDocument()
  })

  it('can toggle back to Active', async () => {
    const u = userEvent.setup()
    render(<App />)
    const btn = within(row('Blowout')).getByRole('button', { name: /toggle blowout/i })
    await u.click(btn) // -> Inactive
    await u.click(btn) // -> Active
    expect(btn).toHaveTextContent('Active')
    expect(screen.getByText('Active: 3 of 3')).toBeInTheDocument()
  })

  it('Stats shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 0')).toBeInTheDocument()
  })

  it('Stats shows correct average price for all seeded services', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 80 + 40) / 3 = 48.33...
    expect(screen.getByText('Average price (all): $48.33')).toBeInTheDocument()
  })

  it('Stats reflects toggled inactive service (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Color')).getByRole('button', { name: /toggle color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
    // average active: (25 + 40) / 2 = 32.50
    expect(screen.getByText('Average price (active): $32.50')).toBeInTheDocument()
  })

  it('Stats shows $0.00 averages when all services are toggled off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await u.click(within(row('Color')).getByRole('button', { name: /toggle color/i }))
    await u.click(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Average price (active): $0.00')).toBeInTheDocument()
  })

  it('Settings toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hiding inactive services removes them from the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Haircut')).getByRole('button', { name: /toggle haircut/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show inactive'))
    await nav(u, 'Services')
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('inactive services still counted in Stats when hidden', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Blowout')).getByRole('button', { name: /toggle blowout/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Show inactive'))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addService(u, 'Perm', '60')
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Perm')).toBeInTheDocument()
    expect(screen.getByText('Active: 4 of 4')).toBeInTheDocument()
  })
})
