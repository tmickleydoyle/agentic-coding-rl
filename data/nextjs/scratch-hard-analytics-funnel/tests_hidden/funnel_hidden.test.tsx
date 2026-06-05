// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFunnel(u: U, name: string) {
  await u.clear(screen.getByLabelText(/funnel name/i))
  await u.type(screen.getByLabelText(/funnel name/i), name)
  await u.click(screen.getByRole('button', { name: /add funnel/i }))
}
async function addStep(u: U, funnel: string, name: string, users: string) {
  await u.selectOptions(screen.getByLabelText(/^funnel$/i), funnel)
  await u.clear(screen.getByLabelText(/step name/i))
  await u.type(screen.getByLabelText(/step name/i), name)
  await u.clear(screen.getByLabelText(/^users$/i))
  if (users) await u.type(screen.getByLabelText(/^users$/i), users)
  await u.click(screen.getByRole('button', { name: /add step/i }))
}
function group(name: string) {
  return screen.getByRole('group', { name })
}

describe('Funnel analytics (held-out)', () => {
  it('rounds drop-off to a whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'F')
    await nav(u, 'Steps')
    await addStep(u, 'F', 'S1', '3')
    await addStep(u, 'F', 'S2', '1')
    await nav(u, 'Analysis')
    // round(1/3*100)=33 retained -> 67% drop-off
    expect(within(group('F analysis')).getByText('S2: 1 users, 67% drop-off')).toBeInTheDocument()
  })

  it('overall conversion is last over first across many steps', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'F')
    await nav(u, 'Steps')
    await addStep(u, 'F', 'S1', '800')
    await addStep(u, 'F', 'S2', '600')
    await addStep(u, 'F', 'S3', '200')
    await nav(u, 'Analysis')
    expect(within(group('F analysis')).getByText('F overall conversion: 25%')).toBeInTheDocument()
  })

  it('handles a zero previous step as 0% drop-off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'F')
    await nav(u, 'Steps')
    await addStep(u, 'F', 'S1', '0')
    await addStep(u, 'F', 'S2', '0')
    await nav(u, 'Analysis')
    const g = within(group('F analysis'))
    expect(g.getByText('S1: 0 users, 0% drop-off')).toBeInTheDocument()
    expect(g.getByText('S2: 0 users, 0% drop-off')).toBeInTheDocument()
    expect(g.getByText('F overall conversion: 0%')).toBeInTheDocument()
  })

  it('keeps each funnel drop-off chain independent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'A')
    await addFunnel(u, 'B')
    await nav(u, 'Steps')
    await addStep(u, 'A', 'A1', '100')
    await addStep(u, 'A', 'A2', '50')
    await addStep(u, 'B', 'B1', '100')
    await addStep(u, 'B', 'B2', '90')
    await nav(u, 'Analysis')
    expect(within(group('A analysis')).getByText('A2: 50 users, 50% drop-off')).toBeInTheDocument()
    expect(within(group('B analysis')).getByText('B2: 90 users, 10% drop-off')).toBeInTheDocument()
  })
})
