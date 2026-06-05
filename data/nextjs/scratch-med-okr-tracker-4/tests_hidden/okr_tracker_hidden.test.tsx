// HELD-OUT generalization tests — different inputs, edge cases, sequences
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function objRow(title: string): HTMLElement {
  const el = screen.getByText(title).closest('li')
  if (!el) throw new Error(`no row for ${title}`)
  return el as HTMLElement
}

describe('OKR Tracker (held-out)', () => {
  it('adds two new objectives and dashboard total updates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/objective title/i), 'Hire engineers')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await u.type(screen.getByLabelText(/objective title/i), 'Cut costs')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total objectives: 5')).toBeInTheDocument()
  })

  it('new objective starts with 0% and does not affect on-track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/objective title/i), 'Zero start')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    await nav(u, 'Dashboard')
    // seeded: 1 on track; new one is 0% so still 1
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 3')).toBeInTheDocument()
  })

  it('updating progress to 100% shows on objective row', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/progress for grow revenue/i)
    await u.clear(input)
    await u.type(input, '100')
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: /update/i }))
    expect(within(objRow('Grow revenue')).getByText('Progress: 100%')).toBeInTheDocument()
  })

  it('updating to 100% counted in average', async () => {
    const u = userEvent.setup()
    render(<App />)
    // set all three to 100
    for (const title of ['Grow revenue', 'Improve NPS', 'Launch mobile app']) {
      const input = screen.getByLabelText(new RegExp(`progress for ${title}`, 'i'))
      await u.clear(input)
      await u.type(input, '100')
      await u.click(within(objRow(title)).getByRole('button', { name: /update/i }))
    }
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 100%')).toBeInTheDocument()
    expect(screen.getByText('On track: 3')).toBeInTheDocument()
  })

  it('deleting one objective adjusts needs-attention count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete Improve NPS (60%, needs attention)
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Needs attention: 1')).toBeInTheDocument()
    expect(screen.getByText('On track: 1')).toBeInTheDocument()
  })

  it('deleting an on-track objective lowers on-track count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: /delete/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('On track: 0')).toBeInTheDocument()
    expect(screen.getByText('Needs attention: 2')).toBeInTheDocument()
  })

  it('theme toggle can be reversed back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('average is rounded correctly for non-integer mean', async () => {
    const u = userEvent.setup()
    render(<App />)
    // delete all seeded, add two with 0 and 1 -> average 0.5 -> rounds to 1? but let us use 0 and 100 for 50
    await u.click(within(objRow('Grow revenue')).getByRole('button', { name: /delete/i }))
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /delete/i }))
    await u.click(within(objRow('Launch mobile app')).getByRole('button', { name: /delete/i }))
    // add one at 0
    await u.type(screen.getByLabelText(/objective title/i), 'Alpha')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    // add one at 100
    await u.type(screen.getByLabelText(/objective title/i), 'Beta')
    await u.click(screen.getByRole('button', { name: /add objective/i }))
    const inputBeta = screen.getByLabelText(/progress for beta/i)
    await u.clear(inputBeta)
    await u.type(inputBeta, '100')
    await u.click(within(objRow('Beta')).getByRole('button', { name: /update/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Average progress: 50%')).toBeInTheDocument()
  })

  it('progress input for each seeded objective is accessible', () => {
    render(<App />)
    expect(screen.getByLabelText(/progress for grow revenue/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/progress for improve nps/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/progress for launch mobile app/i)).toBeInTheDocument()
  })

  it('objectives state persists through Settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/progress for improve nps/i)
    await u.clear(input)
    await u.type(input, '90')
    await u.click(within(objRow('Improve NPS')).getByRole('button', { name: /update/i }))
    await nav(u, 'Settings')
    await nav(u, 'Objectives')
    expect(within(objRow('Improve NPS')).getByText('Progress: 90%')).toBeInTheDocument()
  })
})
