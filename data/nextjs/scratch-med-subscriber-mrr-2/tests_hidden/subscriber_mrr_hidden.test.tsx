// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths
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

async function addSub(u: U, name: string, plan: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Plan'), plan)
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

describe('Subscriber MRR Tracker (held-out)', () => {
  it('removing Carol (inactive) does not change MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Carol' }))
    expect(screen.getByText('MRR: $38')).toBeInTheDocument()
    expect(screen.getByText('Active: 2')).toBeInTheDocument()
  })

  it('deactivating then reactivating Alice restores MRR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Deactivate Alice' }))
    expect(screen.getByText('MRR: $9')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Activate Alice' }))
    expect(screen.getByText('MRR: $38')).toBeInTheDocument()
  })

  it('adding a Basic subscriber increases active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Gina', 'Basic')
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })

  it('adding two Enterprise subscribers shows correct MRR on Dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Hank', 'Enterprise')
    await addSub(u, 'Iris', 'Enterprise')
    await nav(u, 'Dashboard')
    // 38 + 99 + 99 = 236
    expect(screen.getByText('MRR: $236')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 2')).toBeInTheDocument()
  })

  it('removing all subscribers drops MRR to $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Alice' }))
    await u.click(screen.getByRole('button', { name: 'Remove Bob' }))
    await u.click(screen.getByRole('button', { name: 'Remove Carol' }))
    expect(screen.getByText('MRR: $0')).toBeInTheDocument()
    expect(screen.getByText('Active: 0')).toBeInTheDocument()
  })

  it('dashboard shows 0 totals after removing all subscribers', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Alice' }))
    await u.click(screen.getByRole('button', { name: 'Remove Bob' }))
    await u.click(screen.getByRole('button', { name: 'Remove Carol' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('MRR: $0')).toBeInTheDocument()
  })

  it('activating Carol updates the Subscribers view active count to 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Activate Carol' }))
    expect(screen.getByText('Active: 3')).toBeInTheDocument()
  })

  it('subscriber list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Persistent', 'Pro')
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('dashboard Pro count updates after adding a Pro subscriber', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Jake', 'Pro')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pro subscribers: 3')).toBeInTheDocument()
  })

  it('deactivating a subscriber from list does not remove them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Deactivate Bob' }))
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(within(subRow('Bob')).getByText('Inactive')).toBeInTheDocument()
  })

  it('dashboard inactive count increments when subscriber deactivated', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Deactivate Alice' }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Inactive subscribers: 2')).toBeInTheDocument()
  })
})
