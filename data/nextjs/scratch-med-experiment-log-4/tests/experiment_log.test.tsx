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
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
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
    await addExp(u, 'Homepage CTA')
    expect(screen.getByText('Homepage CTA')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('shows Mark done button for a running experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Button color')
    expect(within(expRow('Button color')).getByRole('button', { name: /mark done/i })).toBeInTheDocument()
  })

  it('clicking Mark done shows Winner A and Winner B buttons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Checkout flow')
    await u.click(within(expRow('Checkout flow')).getByRole('button', { name: /mark done/i }))
    const row = expRow('Checkout flow')
    expect(within(row).getByRole('button', { name: /winner a/i })).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: /winner b/i })).toBeInTheDocument()
  })

  it('selecting Winner A marks experiment done with winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Pricing page')
    await u.click(within(expRow('Pricing page')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Pricing page')).getByRole('button', { name: /winner a/i }))
    expect(screen.getByText(/winner: a/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /winner a/i })).not.toBeInTheDocument()
  })

  it('selecting Winner B marks experiment done with winner B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Email subject')
    await u.click(within(expRow('Email subject')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Email subject')).getByRole('button', { name: /winner b/i }))
    expect(screen.getByText(/winner: b/i)).toBeInTheDocument()
  })

  it('done experiment has no Mark done button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Hero image')
    await u.click(within(expRow('Hero image')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Hero image')).getByRole('button', { name: /winner a/i }))
    expect(within(expRow('Hero image')).queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
  })

  it('Show running only hides done experiments and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Test one')
    await addExp(u, 'Test two')
    await u.click(within(expRow('Test one')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Test one')).getByRole('button', { name: /winner b/i }))
    await u.click(screen.getByLabelText(/show running only/i))
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Test one')).not.toBeInTheDocument()
    expect(screen.getByText('Test two')).toBeInTheDocument()
  })

  it('unchecking Show running only restores all experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Alpha')
    await addExp(u, 'Beta')
    await u.click(within(expRow('Alpha')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Alpha')).getByRole('button', { name: /winner a/i }))
    await u.click(screen.getByLabelText(/show running only/i))
    await u.click(screen.getByLabelText(/show running only/i))
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('Stats shows zeros when no experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/finished: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 0%/i)).toBeInTheDocument()
  })

  it('Stats reflects added and finished experiments (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp X')
    await addExp(u, 'Exp Y')
    await u.click(within(expRow('Exp X')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Exp X')).getByRole('button', { name: /winner a/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/running: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/finished: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/winner a: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/winner b: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/win rate: 50%/i)).toBeInTheDocument()
  })

  it('Stats win rate is 100% when all experiments are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Solo test')
    await u.click(within(expRow('Solo test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Solo test')).getByRole('button', { name: /winner b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText(/win rate: 100%/i)).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('experiments state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Persist me')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })

  it('Stats ignores running-only filter — counts all experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Visible')
    await addExp(u, 'Hidden after filter')
    await u.click(within(expRow('Visible')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Visible')).getByRole('button', { name: /winner a/i }))
    await u.click(screen.getByLabelText(/show running only/i))
    // filter hides done, but stats still see all
    await nav(u, 'Stats')
    expect(screen.getByText(/total: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/finished: 1/i)).toBeInTheDocument()
  })
})
