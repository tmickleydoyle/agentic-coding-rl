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

describe('Trainer scheduling app', () => {
  it('starts on Trainers', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Trainers' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Sessions')
    expect(screen.getByRole('heading', { name: 'Sessions' })).toBeInTheDocument()
    await nav(u, 'Utilization')
    expect(screen.getByRole('heading', { name: 'Utilization' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Trainers')
    expect(screen.getByRole('heading', { name: 'Trainers' })).toBeInTheDocument()
  })

  it('adds a trainer shown with cap', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '20')
    expect(screen.getByText('Dana (cap 20h)')).toBeInTheDocument()
  })

  it('ignores a blank trainer name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, '   ', '20')
    expect(screen.queryByText(/cap 20h/i)).not.toBeInTheDocument()
  })

  it('ignores a non-positive cap', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Ghost', '0')
    expect(screen.queryByText(/ghost/i)).not.toBeInTheDocument()
  })

  it('adds a session shown with trainer and hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '20')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '2')
    expect(screen.getByText('Sam with Dana (2h)')).toBeInTheDocument()
  })

  it('ignores a session with non-positive hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '20')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '0')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 0\/20h/i)).toBeInTheDocument()
  })

  it('sums booked hours per trainer on Utilization (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '20')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '2')
    await addSession(u, 'Dana', 'Lee', '4')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 6\/20h/i)).toBeInTheDocument()
    expect(within(util()).queryByText(/dana overbooked/i)).not.toBeInTheDocument()
  })

  it('flags an overbooked trainer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '5')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '6')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 6\/5h/i)).toBeInTheDocument()
    expect(within(util()).getByText(/dana overbooked/i)).toBeInTheDocument()
  })

  it('does not flag a trainer booked exactly to cap', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '5')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '5')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 5\/5h/i)).toBeInTheDocument()
    expect(within(util()).queryByText(/dana overbooked/i)).not.toBeInTheDocument()
  })

  it('computes studio utilization percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '10')
    await addTrainer(u, 'Eve', '10')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '5')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/studio utilization: 25%/i)).toBeInTheDocument()
  })

  it('reports 0% utilization with no caps', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/studio utilization: 0%/i)).toBeInTheDocument()
  })

  it('tracks two trainers independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '10')
    await addTrainer(u, 'Eve', '10')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '3')
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 3\/10h/i)).toBeInTheDocument()
    expect(within(util()).getByText(/eve: 0\/10h/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Utilization')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('shows only fully booked trainers when the setting is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '5')
    await addTrainer(u, 'Eve', '10')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '5')
    await addSession(u, 'Eve', 'Lee', '2')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show fully booked only/i))
    await nav(u, 'Utilization')
    expect(within(util()).getByText(/dana: 5\/5h/i)).toBeInTheDocument()
    expect(within(util()).queryByText(/eve:/i)).not.toBeInTheDocument()
  })

  it('keeps filtered trainers counting in the studio total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTrainer(u, 'Dana', '10')
    await addTrainer(u, 'Eve', '10')
    await nav(u, 'Sessions')
    await addSession(u, 'Dana', 'Sam', '10')
    await addSession(u, 'Eve', 'Lee', '5')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show fully booked only/i))
    await nav(u, 'Utilization')
    expect(within(util()).queryByText(/eve:/i)).not.toBeInTheDocument()
    expect(within(util()).getByText(/studio utilization: 75%/i)).toBeInTheDocument()
  })
})
