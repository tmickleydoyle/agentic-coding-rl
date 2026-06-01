// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })
function card(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no card for ${name}`)
  return li as HTMLElement
}
async function addContact(u: U, name: string, company: string, amount: string) {
  await u.clear(screen.getByLabelText(/^name$/i))
  await u.type(screen.getByLabelText(/^name$/i), name)
  await u.clear(screen.getByLabelText(/^company$/i))
  await u.type(screen.getByLabelText(/^company$/i), company)
  await u.clear(screen.getByLabelText(/^amount$/i))
  await u.type(screen.getByLabelText(/^amount$/i), amount)
  await u.click(screen.getByRole('button', { name: /add contact/i }))
}

describe('CRM (held-out)', () => {
  it('defaults a blank amount to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/^name$/i), 'NoAmt')
    await u.type(screen.getByLabelText(/^company$/i), 'Zed')
    await u.click(screen.getByRole('button', { name: /add contact/i }))
    expect(screen.getByText('NoAmt — Zed ($0)')).toBeInTheDocument()
  })

  it('computes win rate as a rounded third with three deals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'a', 'A', '100')
    await addContact(u, 'b', 'B', '200')
    await addContact(u, 'c', 'C', '300')
    await nav(u, 'Pipeline')
    await u.click(within(card('a')).getByRole('button', { name: /advance a/i }))
    await u.click(within(card('a')).getByRole('button', { name: /advance a/i })) // a -> Won
    await nav(u, 'Reports')
    expect(screen.getByText(/total contacts: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 33%/i)).toBeInTheDocument()
    expect(screen.getByText(/pipeline value: \$600/i)).toBeInTheDocument()
    expect(screen.getByText(/won value: \$100/i)).toBeInTheDocument()
  })

  it('moves several deals and keeps column counts consistent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'p', 'A', '1')
    await addContact(u, 'q', 'B', '1')
    await nav(u, 'Pipeline')
    await u.click(within(card('p')).getByRole('button', { name: /advance p/i }))
    expect(screen.getByRole('heading', { name: /lead \(1\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /qualified \(1\)/i })).toBeInTheDocument()
    expect(within(col('Qualified')).getByText('p')).toBeInTheDocument()
    expect(within(col('Lead')).getByText('q')).toBeInTheDocument()
  })

  it('re-showing won restores hidden Won cards', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addContact(u, 'winner', 'A', '5')
    await nav(u, 'Pipeline')
    await u.click(within(card('winner')).getByRole('button', { name: /advance winner/i }))
    await u.click(within(card('winner')).getByRole('button', { name: /advance winner/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show won/i)) // hide
    await u.click(screen.getByLabelText(/show won/i)) // show
    await nav(u, 'Pipeline')
    expect(within(col('Won')).getByText('winner')).toBeInTheDocument()
  })
})
