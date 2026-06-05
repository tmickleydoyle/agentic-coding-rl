// HELD-OUT generalization tests — fresh scenarios not present in the visible suite.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addEntry(u: U, name: string, value: string) {
  await u.clear(screen.getByLabelText(/metric name/i))
  await u.type(screen.getByLabelText(/metric name/i), name)
  await u.clear(screen.getByLabelText(/metric value/i))
  await u.type(screen.getByLabelText(/metric value/i), value)
  await u.click(screen.getByRole('button', { name: /add entry/i }))
}

describe('Metrics Logger (held-out)', () => {
  it('three consecutive entries for same metric show correct trends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'BP', '120')
    await addEntry(u, 'BP', '115')
    await addEntry(u, 'BP', '118')
    const li1 = screen.getByText(/\#1 BP: 120/).closest('li') as HTMLElement
    const li2 = screen.getByText(/\#2 BP: 115/).closest('li') as HTMLElement
    const li3 = screen.getByText(/\#3 BP: 118/).closest('li') as HTMLElement
    expect(within(li1).getByText('—')).toBeInTheDocument()
    expect(within(li2).getByText('▼')).toBeInTheDocument()
    expect(within(li3).getByText('▲')).toBeInTheDocument()
  })

  it('interspersed different metrics have independent trends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Alpha', '10')
    await addEntry(u, 'Beta', '20')
    await addEntry(u, 'Alpha', '5')
    await addEntry(u, 'Beta', '25')
    const liAlpha2 = screen.getByText(/\#3 Alpha: 5/).closest('li') as HTMLElement
    const liBeta2 = screen.getByText(/\#4 Beta: 25/).closest('li') as HTMLElement
    expect(within(liAlpha2).getByText('▼')).toBeInTheDocument()
    expect(within(liBeta2).getByText('▲')).toBeInTheDocument()
  })

  it('Dashboard latest value updates after multiple entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Sleep', '7')
    await addEntry(u, 'Sleep', '6')
    await addEntry(u, 'Sleep', '8')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Sleep: 8 ▲')).toBeInTheDocument()
  })

  it('Dashboard shows ▼ as latest trend when last entry decreased', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Mood', '9')
    await addEntry(u, 'Mood', '6')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Mood: 6 ▼')).toBeInTheDocument()
  })

  it('after clear all, Dashboard shows No entries yet', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Temp', '37')
    await u.click(screen.getByRole('button', { name: /clear all/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('No entries yet')).toBeInTheDocument()
  })

  it('filter low values: entries equal to 10 are not hidden', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Load', '10')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter low values/i))
    await nav(u, 'Log')
    expect(screen.getByText(/\#1 Load: 10/)).toBeInTheDocument()
  })

  it('filter low values: turning filter off restores hidden entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Rate', '3')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter low values/i))
    await nav(u, 'Log')
    expect(screen.queryByText(/\#1 Rate: 3/)).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter low values/i))
    await nav(u, 'Log')
    expect(screen.getByText(/\#1 Rate: 3/)).toBeInTheDocument()
  })

  it('multiple metrics appear on Dashboard in first-appearance order', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'Zinc', '5')
    await addEntry(u, 'Iron', '10')
    await nav(u, 'Dashboard')
    const items = screen.getAllByRole('listitem')
    const zincIdx = items.findIndex((el) => el.textContent?.includes('Zinc'))
    const ironIdx = items.findIndex((el) => el.textContent?.includes('Iron'))
    expect(zincIdx).toBeLessThan(ironIdx)
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('entry count increments correctly with multiple adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addEntry(u, 'X', '1')
    await addEntry(u, 'X', '2')
    await addEntry(u, 'Y', '3')
    expect(screen.getByText(/\#1 X: 1/)).toBeInTheDocument()
    expect(screen.getByText(/\#2 X: 2/)).toBeInTheDocument()
    expect(screen.getByText(/\#3 Y: 3/)).toBeInTheDocument()
  })
})
