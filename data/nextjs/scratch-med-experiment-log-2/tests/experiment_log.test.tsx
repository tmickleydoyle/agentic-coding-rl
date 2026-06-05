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
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('adds an experiment and shows it as running', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Button color test')
    expect(screen.getByText('Button color test')).toBeInTheDocument()
    expect(within(expRow('Button color test')).getByText('running')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('ignores blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('shows Mark done button for running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'CTA test')
    expect(within(expRow('CTA test')).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
  })

  it('clicking Mark done reveals Winner: A and Winner: B buttons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Headline test')
    await u.click(within(expRow('Headline test')).getByRole('button', { name: /mark done/i }))
    expect(within(expRow('Headline test')).getByRole('button', { name: /winner: a/i })).toBeInTheDocument()
    expect(within(expRow('Headline test')).getByRole('button', { name: /winner: b/i })).toBeInTheDocument()
  })

  it('sets experiment to done with winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Layout test')
    await u.click(within(expRow('Layout test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Layout test')).getByRole('button', { name: /winner: a/i }))
    expect(within(expRow('Layout test')).getByText('done')).toBeInTheDocument()
    expect(within(expRow('Layout test')).getByText('Winner: A')).toBeInTheDocument()
  })

  it('sets experiment to done with winner B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Pricing test')
    await u.click(within(expRow('Pricing test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Pricing test')).getByRole('button', { name: /winner: b/i }))
    expect(within(expRow('Pricing test')).getByText('done')).toBeInTheDocument()
    expect(within(expRow('Pricing test')).getByText('Winner: B')).toBeInTheDocument()
  })

  it('filter Running hides done experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp1')
    await addExp(u, 'Exp2')
    await u.click(within(expRow('Exp1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Exp1')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Running')
    expect(screen.queryByText('Exp1')).not.toBeInTheDocument()
    expect(screen.getByText('Exp2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('filter Done hides running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Alpha')
    await addExp(u, 'Beta')
    await u.click(within(expRow('Alpha')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Alpha')).getByRole('button', { name: /winner: b/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Done')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('filter All shows all experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'X')
    await addExp(u, 'Y')
    await u.click(within(expRow('X')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('X')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Running')
    await u.selectOptions(screen.getByLabelText(/filter/i), 'All')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('stats show zeros with no experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 0%/i)).toBeInTheDocument()
    expect(screen.getByText(/a wins: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/b wins: 0/i)).toBeInTheDocument()
  })

  it('stats reflect added and completed experiments (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Test1')
    await addExp(u, 'Test2')
    await addExp(u, 'Test3')
    await u.click(within(expRow('Test1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Test1')).getByRole('button', { name: /winner: a/i }))
    await u.click(within(expRow('Test2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Test2')).getByRole('button', { name: /winner: b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/a wins: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/b wins: 1/i)).toBeInTheDocument()
  })

  it('win rate is done/total as percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'P')
    await addExp(u, 'Q')
    await u.click(within(expRow('P')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('P')).getByRole('button', { name: /winner: a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/win rate: 50%/i)).toBeInTheDocument()
  })

  it('stats ignore filter — shows all experiments regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Filtered1')
    await addExp(u, 'Filtered2')
    await u.click(within(expRow('Filtered1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Filtered1')).getByRole('button', { name: /winner: a/i }))
    await u.selectOptions(screen.getByLabelText(/filter/i), 'Running')
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1/i)).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Persisted')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByText('Persisted')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('toggles theme via data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Experiments')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})
