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

describe('Gym member check-in tracker', () => {
  it('starts on Members', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Members' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Check-ins')
    expect(screen.getByRole('heading', { name: 'Check-ins' })).toBeInTheDocument()
    await nav(u, 'Progress')
    expect(screen.getByRole('heading', { name: 'Progress' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Members')
    expect(screen.getByRole('heading', { name: 'Members' })).toBeInTheDocument()
  })

  it('adds a member shown with goal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '8')
    expect(screen.getByText('Alice (goal 8)')).toBeInTheDocument()
  })

  it('ignores a blank member name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, '   ', '5')
    expect(screen.queryByText(/goal 5/i)).not.toBeInTheDocument()
  })

  it('ignores a non-positive goal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Zed', '0')
    expect(screen.queryByText(/zed/i)).not.toBeInTheDocument()
  })

  it('records a check-in count for a member', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '8')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 2)
    expect(screen.getByText('Alice: 2 check-ins')).toBeInTheDocument()
  })

  it('does nothing when no member is selected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '8')
    await nav(u, 'Check-ins')
    await u.click(screen.getByRole('button', { name: /check in/i }))
    expect(screen.getByText('Alice: 0 check-ins')).toBeInTheDocument()
  })

  it('shows visits over goal on Progress (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '5')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 3)
    await nav(u, 'Progress')
    expect(within(progress()).getByText(/alice: 3\/5 visits/i)).toBeInTheDocument()
    expect(within(progress()).queryByText(/alice goal met/i)).not.toBeInTheDocument()
  })

  it('flags goal met when visits reach the goal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '2')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 2)
    await nav(u, 'Progress')
    expect(within(progress()).getByText(/alice: 2\/2 visits/i)).toBeInTheDocument()
    expect(within(progress()).getByText(/alice goal met/i)).toBeInTheDocument()
  })

  it('ranks members by visit count on the leaderboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '10')
    await addMember(u, 'Bob', '10')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Bob', 3)
    await checkIn(u, 'Alice', 1)
    await nav(u, 'Progress')
    expect(within(progress()).getByText('Rank 1: Bob (3)')).toBeInTheDocument()
    expect(within(progress()).getByText('Rank 2: Alice (1)')).toBeInTheDocument()
  })

  it('breaks leaderboard ties by insertion order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '10')
    await addMember(u, 'Bob', '10')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 2)
    await checkIn(u, 'Bob', 2)
    await nav(u, 'Progress')
    expect(within(progress()).getByText('Rank 1: Alice (2)')).toBeInTheDocument()
    expect(within(progress()).getByText('Rank 2: Bob (2)')).toBeInTheDocument()
  })

  it('counts two members independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '3')
    await addMember(u, 'Bob', '3')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 1)
    await nav(u, 'Progress')
    expect(within(progress()).getByText(/alice: 1\/3 visits/i)).toBeInTheDocument()
    expect(within(progress()).getByText(/bob: 0\/3 visits/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Progress')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides members who met their goal from progress lines when checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '1')
    await addMember(u, 'Bob', '5')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 1)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide members who met goal/i))
    await nav(u, 'Progress')
    expect(within(progress()).queryByText(/alice: 1\/1 visits/i)).not.toBeInTheDocument()
    expect(within(progress()).getByText(/bob: 0\/5 visits/i)).toBeInTheDocument()
  })

  it('keeps a hidden (goal-met) member on the leaderboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addMember(u, 'Alice', '1')
    await nav(u, 'Check-ins')
    await checkIn(u, 'Alice', 1)
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide members who met goal/i))
    await nav(u, 'Progress')
    expect(within(progress()).getByText('Rank 1: Alice (1)')).toBeInTheDocument()
  })
})
