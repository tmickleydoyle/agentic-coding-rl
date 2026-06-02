// HELD-OUT generalization tests — overlaid only at eval.
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

describe('Subscriber MRR Tracker (held-out)', () => {
  it('activating Initech raises MRR by $299', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed MRR is $128 (Acme Pro $99 + Globex Starter $29)
    await u.click(within(subRow('Initech')).getByRole('button', { name: /toggle initech/i }))
    expect(screen.getByText('Active: 3 | MRR: $427')).toBeInTheDocument()
  })

  it('toggle twice returns to original state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i }))
    await u.click(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i }))
    expect(screen.getByText('Active: 2 | MRR: $128')).toBeInTheDocument()
    expect(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i })).toHaveTextContent('Active')
  })

  it('adding a Starter subscriber updates plan count in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Name'), 'SmallBiz')
    await u.selectOptions(screen.getByLabelText('Plan'), 'Starter')
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Starter subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Total subscribers: 4')).toBeInTheDocument()
  })

  it('removing inactive subscriber decrements inactive count in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(subRow('Initech')).getByRole('button', { name: /remove initech/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Inactive subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Total subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Enterprise subscribers: 0')).toBeInTheDocument()
  })

  it('MRR is zero when all subscribers are inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(subRow('Acme Corp')).getByRole('button', { name: /toggle acme corp/i }))
    await u.click(within(subRow('Globex')).getByRole('button', { name: /toggle globex/i }))
    expect(screen.getByText('Active: 0 | MRR: $0')).toBeInTheDocument()
    await nav(u, 'Dashboard')
    expect(screen.getByText('MRR: $0')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 3')).toBeInTheDocument()
  })

  it('filter inactive checkbox can be unchecked to show all again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText('Filter inactive')) // check — filter on
    await u.click(screen.getByLabelText('Filter inactive')) // uncheck — filter off
    await nav(u, 'Subscribers')
    expect(screen.getByText('Initech')).toBeInTheDocument()
  })

  it('default plan in dropdown is Starter for new subscriber form', () => {
    render(<App />)
    expect(screen.getByLabelText('Plan')).toHaveValue('Starter')
  })

  it('adding multiple subscribers accumulates correctly in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const [name, plan] of [['Corp A', 'Pro'], ['Corp B', 'Enterprise'], ['Corp C', 'Starter']]) {
      await u.clear(screen.getByLabelText('Name'))
      await u.type(screen.getByLabelText('Name'), name)
      await u.selectOptions(screen.getByLabelText('Plan'), plan)
      await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    }
    await nav(u, 'Dashboard')
    // seed: 3, added: 3
    expect(screen.getByText('Total subscribers: 6')).toBeInTheDocument()
    // seed Pro: 1, added Pro: 1
    expect(screen.getByText('Pro subscribers: 2')).toBeInTheDocument()
    // seed Enterprise: 1, added Enterprise: 1
    expect(screen.getByText('Enterprise subscribers: 2')).toBeInTheDocument()
    // seed Starter: 1, added Starter: 1
    expect(screen.getByText('Starter subscribers: 2')).toBeInTheDocument()
    // active MRR: seed $128 + Pro $99 + Enterprise $299 + Starter $29 = $555
    expect(screen.getByText('MRR: $555')).toBeInTheDocument()
  })

  it('dashboard active/inactive counts update after cross-view remove', async () => {
    const u = userEvent.setup()
    render(<App />)
    // remove both active seed subscribers
    await u.click(within(subRow('Acme Corp')).getByRole('button', { name: /remove acme corp/i }))
    await u.click(within(subRow('Globex')).getByRole('button', { name: /remove globex/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('MRR: $0')).toBeInTheDocument()
  })
})
