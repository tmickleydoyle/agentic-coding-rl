import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function subRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Subscriber MRR Tracker', () => {
  it('starts on the Subscribers view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('renders the three seed subscribers', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('shows correct seed MRR summary (Acme Pro $99 + Globex Starter $29 = $128)', () => {
    render(<App />)
    expect(screen.getByText('Active: 2 | MRR: $128')).toBeInTheDocument()
  })

  it('shows plan prices in subscriber rows', () => {
    render(<App />)
    const acmeRow = subRow('Acme Corp')
    expect(within(acmeRow).getByText('$99/mo')).toBeInTheDocument()
    const globexRow = subRow('Globex')
    expect(within(globexRow).getByText('$29/mo')).toBeInTheDocument()
    const initechRow = subRow('Initech')
    expect(within(initechRow).getByText('$299/mo')).toBeInTheDocument()
  })

  it('shows Active button for active subscribers and Inactive for inactive', () => {
    render(<App />)
    expect(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i })).toHaveTextContent('Active')
    expect(within(subRow('Initech')).getByRole('button', { name: /toggle initech/i })).toHaveTextContent('Inactive')
  })

  it('toggles a subscriber active status and updates MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    // deactivate Acme Corp (Pro $99), MRR goes from $128 to $29
    await u.click(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i }))
    expect(screen.getByText('Active: 1 | MRR: $29')).toBeInTheDocument()
    expect(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i })).toHaveTextContent('Inactive')
  })

  it('adds a new subscriber with the chosen plan', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Umbrella Ltd')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Enterprise')
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByText('Umbrella Ltd')).toBeInTheDocument()
    expect(within(subRow('Umbrella Ltd')).getByText('$299/mo')).toBeInTheDocument()
  })

  it('new subscriber is active and included in MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'NewCo')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Pro')
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    // seed active: $128 + new Pro $99 = $227, active count = 3
    expect(screen.getByText('Active: 3 | MRR: $227')).toBeInTheDocument()
  })

  it('ignores a blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    // still 3 seed rows
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('removes a subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(subRow('Globex')).getByRole('button', { name: /remove globex/i }))
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('removing an active subscriber updates MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    // remove Globex (Starter $29), MRR $128 -> $99
    await u.click(within(subRow('Globex')).getByRole('button', { name: /remove globex/i }))
    expect(screen.getByText('Active: 1 | MRR: $99')).toBeInTheDocument()
  })

  it('clears name input after adding a subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'TempCo')
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('dashboard shows correct seed totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('MRR: $128')).toBeInTheDocument()
  })

  it('dashboard shows per-plan counts from seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Starter subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Pro subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 1')).toBeInTheDocument()
  })

  it('dashboard reflects a toggle made on Subscribers view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('MRR: $29')).toBeInTheDocument()
  })

  it('dashboard updates after adding a subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Delta Inc')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Enterprise')
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 4')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('MRR: $427')).toBeInTheDocument()
  })

  it('navigates to Settings and toggles theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Subscribers')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter inactive hides inactive subscribers on Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Filter inactive'))
    await nav(u, 'Subscribers')
    expect(screen.queryByText('Initech')).not.toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('filter inactive does not affect Dashboard stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Filter inactive'))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 1')).toBeInTheDocument()
  })

  it('keeps subscriber state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'Persistent Co')
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Persistent Co')).toBeInTheDocument()
  })
})
