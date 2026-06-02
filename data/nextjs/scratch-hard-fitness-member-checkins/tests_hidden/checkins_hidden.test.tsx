// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const progress = () => screen.getByRole('region', { name: 'Progress view' })

async function addMember(u: U, name: string, goal: string) {
  await u.clear(screen.getByLabelText(/member name/i))
  await u.type(screen.getByLabelText(/member name/i), name)
  await u.clear(screen.getByLabelText(/monthly goal/i))
  await u.type(screen.getByLabelText(/monthly goal/i), goal)
  await u.click(screen.getByRole('button', { name: /add member/i }))
}
async function checkIn(u: U, member: string, times = 1) {
  for (let i = 0; i < times; i++) {
    await u.selectOptions(screen.getByLabelText(/^member$/i), member)
    await u.click(screen.getByRole('button', { name: /check in/i }))
  }
}

describe('Gym member check-in (held-out)', () => {
  it('orders a three-way leaderboard correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '10')
    await addMember(u, 'Bob', '10')
    await addMember(u, 'Carol', '10')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Carol', 5)
    await checkIn(u, 'Alice', 2)
    await nav(u, 'Progress')
    expect(within(progress()).getByText('Rank 1: Carol (5)')).toBeInTheDocument()
    expect(within(progress()).getByText('Rank 2: Alice (2)')).toBeInTheDocument()
    expect(within(progress()).getByText('Rank 3: Bob (0)')).toBeInTheDocument()
  })

  it('treats exceeding the goal as met', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '2')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 4)
    await nav(u, 'Progress')
    expect(within(progress()).getByText(/alice: 4\/2 visits/i)).toBeInTheDocument()
    expect(within(progress()).getByText(/alice goal met/i)).toBeInTheDocument()
  })

  it('does not flag goal met one visit short', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '3')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 2)
    await nav(u, 'Progress')
    expect(within(progress()).queryByText(/alice goal met/i)).not.toBeInTheDocument()
  })

  it('unchecking the hide setting brings goal-met progress lines back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '1')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 1)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide members who met goal/i))
    await u.click(screen.getByLabelText(/hide members who met goal/i))
    await nav(u, 'Progress')
    expect(within(progress()).getByText(/alice: 1\/1 visits/i)).toBeInTheDocument()
  })
})
