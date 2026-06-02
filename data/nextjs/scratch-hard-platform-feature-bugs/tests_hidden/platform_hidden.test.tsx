// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, name: string) {
  await u.clear(screen.getByLabelText(/feature name/i))
  await u.type(screen.getByLabelText(/feature name/i), name)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

async function fileBug(u: U, feature: string, title: string, severity: string) {
  await u.selectOptions(screen.getByLabelText(/^feature$/i), feature)
  await u.clear(screen.getByLabelText(/title/i))
  await u.type(screen.getByLabelText(/title/i), title)
  await u.selectOptions(screen.getByLabelText(/severity/i), severity)
  await u.click(screen.getByRole('button', { name: /file bug/i }))
}

const quality = () => screen.getByRole('region', { name: 'Quality view' })
const bugsView = () => screen.getByRole('region', { name: 'Bugs view' })

describe('Feature quality (held-out)', () => {
  it('tracks two features independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await addFeature(u, 'Billing')
    await nav(u, 'Bugs')
    await fileBug(u, 'Billing', 'Charge fail', 'high')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/search: 0 open \/ 0 total/i)).toBeInTheDocument()
    expect(within(quality()).getByText(/billing: 1 open \/ 1 total/i)).toBeInTheDocument()
  })

  it('moves healthiest to a feature after its open bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await addFeature(u, 'Billing')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'A', 'low')
    await fileBug(u, 'Billing', 'B', 'low')
    await fileBug(u, 'Billing', 'C', 'low')
    // Search has 1 open, Billing has 2 open -> Search healthiest
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/healthiest feature: search/i)).toBeInTheDocument()
  })

  it('clears at risk once the high bug is closed but keeps total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'X', 'high')
    await fileBug(u, 'Search', 'Y', 'low')
    await u.click(within(bugsView()).getAllByRole('button', { name: /close/i })[0])
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/search: 1 open \/ 2 total/i)).toBeInTheDocument()
    expect(within(quality()).queryByText(/at risk/i)).not.toBeInTheDocument()
  })

  it('counts open bugs across multiple features in the summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'A')
    await addFeature(u, 'B')
    await nav(u, 'Bugs')
    await fileBug(u, 'A', 'a1', 'low')
    await fileBug(u, 'A', 'a2', 'high')
    await fileBug(u, 'B', 'b1', 'low')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/open bugs: 3/i)).toBeInTheDocument()
  })
})
