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

  it('shows seed subscribers on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows correct initial MRR (Alice Pro $29 + Bob Basic $9 = $38)', () => {
    render(<App />)
    expect(screen.getByText('MRR: $38')).toBeInTheDocument()
  })

  it('shows correct initial active count (Alice + Bob = 2)', () => {
    render(<App />)
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
  })

  it('shows Active/Inactive status for seed subscribers', () => {
    render(<App />)
    const alice = subRow('Alice')
    const carol = subRow('Carol')
    expect(within(alice).getByText('Active')).toBeInTheDocument()
    expect(within(carol).getByText('Inactive')).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('adds a new subscriber and shows them in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Name'))
    await u.type(screen.getByLabelText('Name'), 'Dave')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Enterprise')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(within(subRow('Dave')).getByText('Enterprise')).toBeInTheDocument()
    expect(within(subRow('Dave')).getByText('Active')).toBeInTheDocument()
  })

  it('adding a subscriber increases MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Name'))
    await u.type(screen.getByLabelText('Name'), 'Eve')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Enterprise')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    // 38 + 99 = 137
    expect(screen.getByText('MRR: $137')).toBeInTheDocument()
  })

  it('ignores a blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.queryAllByText('Active').length).toBe(2)
  })

  it('deactivates an active subscriber and updates status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Deactivate Alice' }))
    expect(within(subRow('Alice')).getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Activate Alice' })).toBeInTheDocument()
  })

  it('deactivating a subscriber reduces MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Deactivate Bob' }))
    // 38 - 9 = 29
    expect(screen.getByText('MRR: $29')).toBeInTheDocument()
  })

  it('activates an inactive subscriber and updates MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Carol is Pro $29, inactive
    await u.click(screen.getByRole('button', { name: 'Activate Carol' }))
    // 38 + 29 = 67
    expect(screen.getByText('MRR: $67')).toBeInTheDocument()
    expect(within(subRow('Carol')).getByText('Active')).toBeInTheDocument()
  })

  it('removes a subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Bob' }))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('removing an active subscriber reduces MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Alice' }))
    // 38 - 29 = 9
    expect(screen.getByText('MRR: $9')).toBeInTheDocument()
  })

  it('dashboard shows correct total subscribers on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
  })

  it('dashboard shows correct active/inactive on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 1')).toBeInTheDocument()
  })

  it('dashboard shows correct MRR on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('MRR: $38')).toBeInTheDocument()
  })

  it('dashboard shows plan counts on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Basic subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Pro subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 0')).toBeInTheDocument()
  })

  it('dashboard reflects subscriber added on Subscribers view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Name'))
    await u.type(screen.getByLabelText('Name'), 'Frank')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Enterprise')
    await u.click(screen.getByRole('button', { name: 'Add' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 4')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 1')).toBeInTheDocument()
    // MRR: 38 + 99 = 137
    expect(screen.getByText('MRR: $137')).toBeInTheDocument()
  })

  it('dashboard reflects deactivation done on Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Deactivate Bob' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('MRR: $29')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Dashboard')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Subscribers')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })
})
