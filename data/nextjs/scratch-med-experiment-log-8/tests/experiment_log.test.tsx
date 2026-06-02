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

describe('A/B Experiment Log', () => {
  it('starts on Experiments view with count 0', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Experiments (0)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Experiments (0)' })).toBeInTheDocument()
  })

  it('adds an experiment and shows it as running', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Checkout Button Color')
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
    expect(screen.getByText('Checkout Button Color')).toBeInTheDocument()
    expect(screen.getByText(/running/)).toBeInTheDocument()
  })

  it('ignores blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: 'Experiments (0)' })).toBeInTheDocument()
  })

  it('shows Mark done button for running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Hero Image Test')
    expect(screen.getByRole('button', { name: /mark done/i })).toBeInTheDocument()
  })

  it('clicking Mark done reveals Winner: A and Winner: B buttons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'CTA Text')
    await u.click(screen.getByRole('button', { name: /mark done/i }))
    expect(screen.getByRole('button', { name: 'Winner: A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Winner: B' })).toBeInTheDocument()
  })

  it('marks experiment done with winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Pricing Page Layout')
    await u.click(screen.getByRole('button', { name: /mark done/i }))
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    expect(screen.queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
    expect(screen.getByText(/winner: A/)).toBeInTheDocument()
  })

  it('marks experiment done with winner B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Sign-up Form')
    await u.click(screen.getByRole('button', { name: /mark done/i }))
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    expect(screen.getByText(/winner: B/)).toBeInTheDocument()
  })

  it('filter Running hides done experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Open Test')
    await addExp(u, 'Closed Test')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[1])
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
    expect(screen.getByText('Open Test')).toBeInTheDocument()
    expect(screen.queryByText('Closed Test')).not.toBeInTheDocument()
  })

  it('filter Done hides running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Active Exp')
    await addExp(u, 'Finished Exp')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[1])
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Active Exp')).not.toBeInTheDocument()
    expect(screen.getByText('Finished Exp')).toBeInTheDocument()
  })

  it('filter All shows every experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp One')
    await addExp(u, 'Exp Two')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    expect(screen.getByRole('heading', { name: 'Experiments (2)' })).toBeInTheDocument()
  })

  it('Stats shows zeros when no experiments added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Finished: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate A: 0%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added and finished experiments (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp X')
    await addExp(u, 'Exp Y')
    await addExp(u, 'Exp Z')
    // finish two with A, one running
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 2')).toBeInTheDocument()
    expect(screen.getByText('Win rate A: 50%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 50%')).toBeInTheDocument()
  })

  it('Win rate A is 100% when all finished chose A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Solo Test')
    await u.click(screen.getByRole('button', { name: /mark done/i }))
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate A: 100%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 0%')).toBeInTheDocument()
  })

  it('theme toggle applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view changes', async () => {
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

  it('experiments persist after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Sticky Exp')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByText('Sticky Exp')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
  })

  it('filter selection persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Persist Filter')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByRole('combobox', { name: /show/i })).toHaveValue('Running')
  })
})
