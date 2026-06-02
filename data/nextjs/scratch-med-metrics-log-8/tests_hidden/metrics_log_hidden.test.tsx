// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, name: string, value: string) {
  await u.clear(screen.getByLabelText(/metric name/i))
  await u.clear(screen.getByLabelText(/^value$/i))
  await u.type(screen.getByLabelText(/metric name/i), name)
  await u.type(screen.getByLabelText(/^value$/i), value)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Metrics Log (held-out)', () => {
  it('entry count decrements after delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'HR', '60')
    await addEntry(u, 'HR', '65')
    await addEntry(u, 'HR', '70')
    await u.click(screen.getByRole('button', { name: /delete entry 2/i }))
    expect(screen.getByRole('heading', { name: /entries \(2\)/i })).toBeInTheDocument()
  })

  it('renumbers displayed entries after a delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'BP', '120')
    await addEntry(u, 'BP', '125')
    await u.click(screen.getByRole('button', { name: /delete entry 1/i }))
    expect(screen.getByText('#1 BP: 125.00')).toBeInTheDocument()
  })

  it('decimal values are formatted to 2 decimal places', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '36.6')
    expect(screen.getByText('#1 Temp: 36.60')).toBeInTheDocument()
  })

  it('integer values are shown with .00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Steps', '10000')
    expect(screen.getByText('#1 Steps: 10000.00')).toBeInTheDocument()
  })

  it('dashboard count reflects only entries for that metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'A', '1')
    await addEntry(u, 'B', '2')
    await addEntry(u, 'A', '3')
    await nav(u, 'Dashboard')
    const sectionA = screen.getByRole('region', { name: 'Metric A' })
    expect(within(sectionA).getByText('Count: 2')).toBeInTheDocument()
    const sectionB = screen.getByRole('region', { name: 'Metric B' })
    expect(within(sectionB).getByText('Count: 1')).toBeInTheDocument()
  })

  it('dashboard latest reflects the most recently added entry for that metric', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '5')
    await addEntry(u, 'Y', '100')
    await addEntry(u, 'X', '8')
    await nav(u, 'Dashboard')
    const sectionX = screen.getByRole('region', { name: 'Metric X' })
    expect(within(sectionX).getByText('Latest: 8.00')).toBeInTheDocument()
  })

  it('dashboard trend uses most recent two entries of the same metric ignoring others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'P', '10')
    await addEntry(u, 'Q', '999')
    await addEntry(u, 'P', '5')
    await nav(u, 'Dashboard')
    const sectionP = screen.getByRole('region', { name: 'Metric P' })
    expect(within(sectionP).getByText('Trend: down')).toBeInTheDocument()
  })

  it('theme toggle button label reflects current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('clear all and re-add starts count at 1 again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sleep', '7')
    await addEntry(u, 'Sleep', '8')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    await addEntry(u, 'Sleep', '6')
    expect(screen.getByText('#1 Sleep: 6.00')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /entries \(1\)/i })).toBeInTheDocument()
  })

  it('dashboard after clear and re-add shows flat trend for single entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Mood', '7')
    await addEntry(u, 'Mood', '9')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all entries/i }))
    await nav(u, 'Log')
    await addEntry(u, 'Mood', '8')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Trend: flat')).toBeInTheDocument()
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
