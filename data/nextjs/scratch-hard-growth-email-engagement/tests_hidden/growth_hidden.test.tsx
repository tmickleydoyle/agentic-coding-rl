// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const lists = () => screen.getByRole('region', { name: 'Lists view' })
const overview = () => screen.getByRole('region', { name: 'Overview view' })

async function addBlast(
  u: U,
  subject: string,
  list: string,
  sent: string,
  opens: string,
  clicks: string,
) {
  await u.clear(screen.getByLabelText(/subject/i))
  await u.type(screen.getByLabelText(/subject/i), subject)
  await u.selectOptions(screen.getByLabelText(/^list$/i), list)
  await u.clear(screen.getByLabelText(/sent/i))
  if (sent) await u.type(screen.getByLabelText(/sent/i), sent)
  await u.clear(screen.getByLabelText(/opens/i))
  if (opens) await u.type(screen.getByLabelText(/opens/i), opens)
  await u.clear(screen.getByLabelText(/clicks/i))
  if (clicks) await u.type(screen.getByLabelText(/clicks/i), clicks)
  await u.click(screen.getByRole('button', { name: /add blast/i }))
}

describe('Email engagement (held-out)', () => {
  it('rounds the per-list rates to whole percents', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'A', 'Onboarding', '3', '1', '1')
    await nav(u, 'Lists')
    // open rate 1/3 = 33% ; CTR 1/1 = 100%
    expect(within(lists()).getByText('Onboarding: open rate 33%, CTR 100%')).toBeInTheDocument()
  })

  it('shows CTR n/a but an open rate when there are sends but no opens', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Cold', 'Winback', '200', '0', '0')
    await nav(u, 'Lists')
    expect(within(lists()).getByText('Winback: open rate 0%, CTR n/a')).toBeInTheDocument()
  })

  it('keeps lists independent in the rollup', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'N', 'Newsletter', '100', '50', '25')
    await addBlast(u, 'P', 'Promotions', '200', '40', '4')
    await nav(u, 'Lists')
    expect(within(lists()).getByText('Newsletter: open rate 50%, CTR 50%')).toBeInTheDocument()
    expect(within(lists()).getByText('Promotions: open rate 20%, CTR 10%')).toBeInTheDocument()
  })

  it('computes the overall CTR off opens, not sends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'A', 'Newsletter', '1000', '250', '50')
    await nav(u, 'Overview')
    // open rate 25% ; CTR 50/250 = 20%
    expect(within(overview()).getByText('Open rate: 25%')).toBeInTheDocument()
    expect(within(overview()).getByText('Click-through rate: 20%')).toBeInTheDocument()
  })

  it('unchecking Show opened only brings zero-open blasts back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Ignored', 'Promotions', '100', '0', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show opened only/i))
    await u.click(screen.getByLabelText(/show opened only/i))
    await nav(u, 'Blasts')
    expect(
      screen.getByText('Ignored — Promotions: 100 sent, 0 opens, 0 clicks'),
    ).toBeInTheDocument()
  })
})
