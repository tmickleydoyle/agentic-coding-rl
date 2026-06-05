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

describe('A/B Experiment Log app', () => {
  it('starts on the Experiments view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Experiments')
    expect(screen.getByRole('heading', { name: /experiments/i })).toBeInTheDocument()
  })

  it('adds an experiment and shows it as running', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Button color')
    const row = expRow('Button color')
    expect(within(row).getByText('running')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('marks an experiment done with winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'CTA text')
    await u.click(within(expRow('CTA text')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('CTA text')).getByRole('button', { name: /winner: a/i }))
    const row = expRow('CTA text')
    expect(within(row).getByText('done')).toBeInTheDocument()
    expect(within(row).getByText('Winner: A')).toBeInTheDocument()
  })

  it('marks an experiment done with winner B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Hero image')
    await u.click(within(expRow('Hero image')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Hero image')).getByRole('button', { name: /winner: b/i }))
    const row = expRow('Hero image')
    expect(within(row).getByText('done')).toBeInTheDocument()
    expect(within(row).getByText('Winner: B')).toBeInTheDocument()
  })

  it('hides mark done button after resolving', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Layout test')
    await u.click(within(expRow('Layout test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Layout test')).getByRole('button', { name: /winner: a/i }))
    expect(within(expRow('Layout test')).queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
  })

  it('deletes an experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'To be removed')
    expect(screen.getByText('To be removed')).toBeInTheDocument()
    await u.click(within(expRow('To be removed')).getByRole('button', { name: /delete/i }))
    expect(screen.queryByText('To be removed')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('filters to Running only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Running exp')
    await addExp(u, 'Done exp')
    await u.click(within(expRow('Done exp')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Done exp')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Running exp')).toBeInTheDocument()
    expect(screen.queryByText('Done exp')).not.toBeInTheDocument()
  })

  it('filters to Done only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Active')
    await addExp(u, 'Finished')
    await u.click(within(expRow('Finished')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Finished')).getByRole('button', { name: /winner: b/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Finished')).toBeInTheDocument()
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })

  it('All filter shows everything', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp1')
    await addExp(u, 'Exp2')
    await u.click(within(expRow('Exp1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Exp1')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('Stats shows zeros with no experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('A wins: 0')).toBeInTheDocument()
    expect(screen.getByText('B wins: 0')).toBeInTheDocument()
  })

  it('Stats reflects running experiments (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp A')
    await addExp(u, 'Exp B')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Running: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })

  it('Stats updates when an experiment is resolved (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Checkout flow')
    await addExp(u, 'Pricing page')
    await u.click(within(expRow('Checkout flow')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Checkout flow')).getByRole('button', { name: /winner: a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('A wins: 1')).toBeInTheDocument()
    expect(screen.getByText('B wins: 0')).toBeInTheDocument()
  })

  it('Stats counts A and B wins correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Test 1')
    await addExp(u, 'Test 2')
    await addExp(u, 'Test 3')
    await u.click(within(expRow('Test 1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Test 1')).getByRole('button', { name: /winner: a/i }))
    await u.click(within(expRow('Test 2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Test 2')).getByRole('button', { name: /winner: b/i }))
    await u.click(within(expRow('Test 3')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Test 3')).getByRole('button', { name: /winner: a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('A wins: 2')).toBeInTheDocument()
    expect(screen.getByText('B wins: 1')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })

  it('Stats ignores filter — counts all experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Visible')
    await addExp(u, 'Hidden by filter')
    await u.click(within(expRow('Hidden by filter')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Hidden by filter')).getByRole('button', { name: /winner: b/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Experiments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('preserves experiment list when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Sticky exp')
    await nav(u, 'Settings')
    await nav(u, 'Experiments')
    expect(screen.getByText('Sticky exp')).toBeInTheDocument()
  })

  it('winner choice buttons disappear after picking', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Fleeting choice')
    await u.click(within(expRow('Fleeting choice')).getByRole('button', { name: /mark done/i }))
    expect(within(expRow('Fleeting choice')).getByRole('button', { name: /winner: a/i })).toBeInTheDocument()
    await u.click(within(expRow('Fleeting choice')).getByRole('button', { name: /winner: a/i }))
    expect(within(expRow('Fleeting choice')).queryByRole('button', { name: /winner: a/i })).not.toBeInTheDocument()
    expect(within(expRow('Fleeting choice')).queryByRole('button', { name: /winner: b/i })).not.toBeInTheDocument()
  })
})
