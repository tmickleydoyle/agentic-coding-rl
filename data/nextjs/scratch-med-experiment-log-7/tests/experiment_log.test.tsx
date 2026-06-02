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

describe('Experiment Log app', () => {
  it('starts on the Experiments view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Experiments view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByRole('heading', { name: /experiments/i })).toBeInTheDocument()
  })

  it('adds an experiment and shows it as running', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Button color test')
    expect(screen.getByText('Button color test')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('shows Mark done button for running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Checkout flow')
    expect(within(expRow('Checkout flow')).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
  })

  it('clicking Mark done shows Winner: A and Winner: B buttons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Hero image')
    await u.click(within(expRow('Hero image')).getByRole('button', { name: /mark done/i }))
    expect(within(expRow('Hero image')).getByRole('button', { name: 'Winner: A' })).toBeInTheDocument()
    expect(within(expRow('Hero image')).getByRole('button', { name: 'Winner: B' })).toBeInTheDocument()
  })

  it('marks experiment done with winner A and shows winner label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'CTA text')
    await u.click(within(expRow('CTA text')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('CTA text')).getByRole('button', { name: 'Winner: A' }))
    expect(within(expRow('CTA text')).getByText(/Winner: A/)).toBeInTheDocument()
    expect(within(expRow('CTA text')).queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
  })

  it('marks experiment done with winner B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Pricing page')
    await u.click(within(expRow('Pricing page')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Pricing page')).getByRole('button', { name: 'Winner: B' }))
    expect(within(expRow('Pricing page')).getByText(/Winner: B/)).toBeInTheDocument()
  })

  it('filter Running hides done experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp Alpha')
    await addExp(u, 'Exp Beta')
    await u.click(within(expRow('Exp Alpha')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Exp Alpha')).getByRole('button', { name: 'Winner: A' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Exp Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Exp Beta')).toBeInTheDocument()
  })

  it('filter Done hides running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp One')
    await addExp(u, 'Exp Two')
    await u.click(within(expRow('Exp One')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Exp One')).getByRole('button', { name: 'Winner: B' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Exp One')).toBeInTheDocument()
    expect(screen.queryByText('Exp Two')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'X1')
    await addExp(u, 'X2')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('Stats shows zeros when no experiments exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added and completed experiments (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Nav color')
    await addExp(u, 'Font size')
    await addExp(u, 'Layout shift')
    await u.click(within(expRow('Nav color')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Nav color')).getByRole('button', { name: 'Winner: A' }))
    await u.click(within(expRow('Font size')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Font size')).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Winner A: 1')).toBeInTheDocument()
    expect(screen.getByText('Winner B: 1')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 67%')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Experiments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset experiments clears all experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Temp test')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset experiments/i }))
    await nav(u, 'Experiments')
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Temp test')).not.toBeInTheDocument()
  })

  it('Reset experiments reflects in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Will be reset')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset experiments/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate: 0%')).toBeInTheDocument()
  })

  it('experiment state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Sticky test')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByText('Sticky test')).toBeInTheDocument()
  })

  it('win rate is 100% when all experiments are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Only one')
    await u.click(within(expRow('Only one')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Only one')).getByRole('button', { name: 'Winner: A' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate: 100%')).toBeInTheDocument()
  })
})
