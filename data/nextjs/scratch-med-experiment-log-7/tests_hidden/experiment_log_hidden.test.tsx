import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExp(u: U, name: string) {
  await u.clear(screen.getByLabelText(/experiment name/i))
  await u.type(screen.getByLabelText(/experiment name/i), name)
  await u.click(screen.getByRole('button', { name: /add experiment/i }))
}

function expRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Experiment Log (held-out)', () => {
  it('heading shows correct count with two experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'AA')
    await addExp(u, 'BB')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('filter Running shows count 0 when all are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Solo')
    await u.click(within(expRow('Solo')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Solo')).getByRole('button', { name: 'Winner: B' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('winner picker disappears after selecting winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Picker test')
    await u.click(within(expRow('Picker test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Picker test')).getByRole('button', { name: 'Winner: A' }))
    expect(within(expRow('Picker test')).queryByRole('button', { name: 'Winner: A' })).not.toBeInTheDocument()
    expect(within(expRow('Picker test')).queryByRole('button', { name: 'Winner: B' })).not.toBeInTheDocument()
  })

  it('multiple experiments all shown with All filter after some done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'P1')
    await addExp(u, 'P2')
    await addExp(u, 'P3')
    await u.click(within(expRow('P1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('P1')).getByRole('button', { name: 'Winner: B' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    expect(screen.getByRole('heading', { name: /experiments \(3\)/i })).toBeInTheDocument()
  })

  it('Stats Winner A and Winner B counts update correctly for multiple completions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'E1')
    await addExp(u, 'E2')
    await addExp(u, 'E3')
    await u.click(within(expRow('E1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('E1')).getByRole('button', { name: 'Winner: A' }))
    await u.click(within(expRow('E2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('E2')).getByRole('button', { name: 'Winner: A' }))
    await u.click(within(expRow('E3')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('E3')).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Winner A: 2')).toBeInTheDocument()
    expect(screen.getByText('Winner B: 1')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('Stats Running count decreases after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'R1')
    await addExp(u, 'R2')
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 2')).toBeInTheDocument()
    await nav(u, 'Experiments')
    await u.click(within(expRow('R1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('R1')).getByRole('button', { name: 'Winner: A' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('reset then add new experiment shows count 1 in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Old')
    await addExp(u, 'Old2')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset experiments/i }))
    await nav(u, 'Experiments')
    await addExp(u, 'Fresh')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })

  it('filter does not affect Stats totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Filtered1')
    await addExp(u, 'Filtered2')
    await u.click(within(expRow('Filtered1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Filtered1')).getByRole('button', { name: 'Winner: A' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
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

  it('winner label shown for done experiment with B winner when filter is All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Label check')
    await u.click(within(expRow('Label check')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Label check')).getByRole('button', { name: 'Winner: B' }))
    expect(within(expRow('Label check')).getByText(/Winner: B/)).toBeInTheDocument()
  })
})
