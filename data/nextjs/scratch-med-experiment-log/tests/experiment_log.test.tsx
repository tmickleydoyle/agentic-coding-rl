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
    expect(screen.getByRole('heading', { name: 'Experiments' })).toBeInTheDocument()
  })

  it('shows All (0) heading on an empty list', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'All (0)' })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Experiments')
    expect(screen.getByRole('heading', { name: 'Experiments' })).toBeInTheDocument()
  })

  it('adds an experiment and shows it as running', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Button color test')
    expect(screen.getByText('Button color test')).toBeInTheDocument()
    expect(within(expRow('Button color test')).getByText('running')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'All (1)' })).toBeInTheDocument()
  })

  it('ignores a blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: 'All (0)' })).toBeInTheDocument()
  })

  it('shows Mark done button on a running experiment', async () => {
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
    expect(within(expRow('Headline test')).getByRole('button', { name: 'Winner: A' })).toBeInTheDocument()
    expect(within(expRow('Headline test')).getByRole('button', { name: 'Winner: B' })).toBeInTheDocument()
  })

  it('choosing Winner: A marks experiment done with winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Layout test')
    await u.click(within(expRow('Layout test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Layout test')).getByRole('button', { name: 'Winner: A' }))
    expect(within(expRow('Layout test')).getByText('done')).toBeInTheDocument()
    expect(within(expRow('Layout test')).getByText('Winner: A')).toBeInTheDocument()
  })

  it('choosing Winner: B marks experiment done with winner B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Pricing test')
    await u.click(within(expRow('Pricing test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Pricing test')).getByRole('button', { name: 'Winner: B' }))
    expect(within(expRow('Pricing test')).getByText('done')).toBeInTheDocument()
    expect(within(expRow('Pricing test')).getByText('Winner: B')).toBeInTheDocument()
  })

  it('hides the winner picker after a winner is chosen', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Form test')
    await u.click(within(expRow('Form test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Form test')).getByRole('button', { name: 'Winner: A' }))
    expect(screen.queryByRole('button', { name: 'Winner: A' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Winner: B' })).not.toBeInTheDocument()
  })

  it('filter Running shows only running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Alpha')
    await addExp(u, 'Beta')
    await u.click(within(expRow('Alpha')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Alpha')).getByRole('button', { name: 'Winner: A' }))
    await u.click(screen.getByRole('button', { name: 'Running' }))
    expect(screen.getByRole('heading', { name: 'Running (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('filter Done shows only done experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Gamma')
    await addExp(u, 'Delta')
    await u.click(within(expRow('Gamma')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Gamma')).getByRole('button', { name: 'Winner: B' }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByRole('heading', { name: 'Done (1)' })).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Running' }))
    expect(screen.getByRole('button', { name: 'Running' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('filter All returns all experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'One')
    await addExp(u, 'Two')
    await u.click(within(expRow('One')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('One')).getByRole('button', { name: 'Winner: A' }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: 'All (2)' })).toBeInTheDocument()
  })

  it('Stats view shows zeros when no experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total experiments: 0')).toBeInTheDocument()
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate (A): 0%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 0%')).toBeInTheDocument()
  })

  it('Stats view reflects experiments added on Experiments view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Cross test')
    await nav(u, 'Stats')
    expect(screen.getByText('Total experiments: 1')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
  })

  it('Stats win rates update after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'X1')
    await addExp(u, 'X2')
    await u.click(within(expRow('X1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('X1')).getByRole('button', { name: 'Winner: A' }))
    await u.click(within(expRow('X2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('X2')).getByRole('button', { name: 'Winner: A' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Win rate (A): 100%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 0%')).toBeInTheDocument()
  })

  it('Stats win rate computes 50/50 split correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'E1')
    await addExp(u, 'E2')
    await u.click(within(expRow('E1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('E1')).getByRole('button', { name: 'Winner: A' }))
    await u.click(within(expRow('E2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('E2')).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate (A): 50%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 50%')).toBeInTheDocument()
  })

  it('theme starts as light and toggles to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
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

  it('experiment state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Persistent test')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByText('Persistent test')).toBeInTheDocument()
  })
})
