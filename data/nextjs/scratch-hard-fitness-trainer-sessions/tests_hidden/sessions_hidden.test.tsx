// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const util = () => screen.getByRole('region', { name: 'Utilization view' })

async function addTrainer(u: U, name: string, cap: string) {
  await u.clear(screen.getByLabelText(/trainer name/i))
  await u.type(screen.getByLabelText(/trainer name/i), name)
  await u.clear(screen.getByLabelText(/weekly hour cap/i))
  await u.type(screen.getByLabelText(/weekly hour cap/i), cap)
  await u.click(screen.getByRole('button', { name: /add trainer/i }))
}
async function addSession(u: U, trainer: string, client: string, hours: string) {
  await u.selectOptions(screen.getByLabelText(/^trainer$/i), trainer)
  await u.clear(screen.getByLabelText(/client name/i))
  await u.type(screen.getByLabelText(/client name/i), client)
  await u.clear(screen.getByLabelText(/^hours$/i))
  await u.type(screen.getByLabelText(/^hours$/i), hours)
  await u.click(screen.getByRole('button', { name: /add session/i }))
}

describe('Trainer scheduling (held-out)', () => {
  it('rounds studio utilization to a whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '3')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '1')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/studio utilization: 33%/i)).toBeInTheDocument()
  })

  it('can exceed 100% studio utilization when overbooked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '4')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '6')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/studio utilization: 150%/i)).toBeInTheDocument()
  })

  it('treats an overbooked trainer as fully booked under the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '4')
    await addTrainer(u, 'Eve', '10')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '6')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show fully booked only/i))
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 6\/4h/i)).toBeInTheDocument()
    expect(within(util()).queryByText(/eve:/i)).not.toBeInTheDocument()
  })

  it('adds hours from multiple clients across the same trainer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '20')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '3')
    await addSession(u, 'Dana', 'Lee', '5')
    await addSession(u, 'Dana', 'Ravi', '2')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 10\/20h/i)).toBeInTheDocument()
  })
})
