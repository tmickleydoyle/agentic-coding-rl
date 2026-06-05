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

function row(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Experiment Log app', () => {
  it('starts on the Experiments view with empty list', () => {
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
    await addExp(u, 'Homepage CTA')
    expect(screen.getByText('Homepage CTA')).toBeInTheDocument()
    expect(within(row('Homepage CTA')).getByText('running')).toBeInTheDocument()
  })

  it('ignores a blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.getByRole('heading', { name: /experiments \(0\)/i })).toBeInTheDocument()
  })

  it('heading count increments with each addition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp One')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    await addExp(u, 'Exp Two')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('shows Mark done button for running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Button colour')
    expect(within(row('Button colour')).getByRole('button', { name: /mark done button colour/i })).toBeInTheDocument()
  })

  it('clicking Mark done reveals Winner A and Winner B buttons', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Pricing page')
    await u.click(within(row('Pricing page')).getByRole('button', { name: /mark done pricing page/i }))
    expect(within(row('Pricing page')).getByRole('button', { name: /winner: a for pricing page/i })).toBeInTheDocument()
    expect(within(row('Pricing page')).getByRole('button', { name: /winner: b for pricing page/i })).toBeInTheDocument()
  })

  it('picking Winner A sets status to done and shows Winner: A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Checkout flow')
    await u.click(within(row('Checkout flow')).getByRole('button', { name: /mark done checkout flow/i }))
    await u.click(within(row('Checkout flow')).getByRole('button', { name: /winner: a for checkout flow/i }))
    expect(within(row('Checkout flow')).getByText('done')).toBeInTheDocument()
    expect(within(row('Checkout flow')).getByText('Winner: A')).toBeInTheDocument()
  })

  it('picking Winner B sets status to done and shows Winner: B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Email subject')
    await u.click(within(row('Email subject')).getByRole('button', { name: /mark done email subject/i }))
    await u.click(within(row('Email subject')).getByRole('button', { name: /winner: b for email subject/i }))
    expect(within(row('Email subject')).getByText('done')).toBeInTheDocument()
    expect(within(row('Email subject')).getByText('Winner: B')).toBeInTheDocument()
  })

  it('picker buttons disappear after selecting a winner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Onboarding')
    await u.click(within(row('Onboarding')).getByRole('button', { name: /mark done onboarding/i }))
    await u.click(within(row('Onboarding')).getByRole('button', { name: /winner: a for onboarding/i }))
    expect(within(row('Onboarding')).queryByRole('button', { name: /winner: a for onboarding/i })).not.toBeInTheDocument()
    expect(within(row('Onboarding')).queryByRole('button', { name: /winner: b for onboarding/i })).not.toBeInTheDocument()
  })

  it('filter Running hides done experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Alpha')
    await addExp(u, 'Beta')
    await u.click(within(row('Alpha')).getByRole('button', { name: /mark done alpha/i }))
    await u.click(within(row('Alpha')).getByRole('button', { name: /winner: a for alpha/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('filter Done hides running experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Gamma')
    await addExp(u, 'Delta')
    await u.click(within(row('Gamma')).getByRole('button', { name: /mark done gamma/i }))
    await u.click(within(row('Gamma')).getByRole('button', { name: /winner: b for gamma/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.queryByText('Delta')).not.toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })

  it('filter updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'One')
    await addExp(u, 'Two')
    await u.click(within(row('One')).getByRole('button', { name: /mark done one/i }))
    await u.click(within(row('One')).getByRole('button', { name: /winner: a for one/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.getByRole('heading', { name: /experiments \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('Stats shows zeros when no experiments exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Finished: 0')).toBeInTheDocument()
    expect(screen.getByText('Win rate A: 0%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 0%')).toBeInTheDocument()
  })

  it('Stats reflects experiments added in Experiments view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Search bar')
    await addExp(u, 'Footer links')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Running: 2')).toBeInTheDocument()
    expect(screen.getByText('Finished: 0')).toBeInTheDocument()
  })

  it('Stats win rates update after marking done with winners', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'X')
    await addExp(u, 'Y')
    await addExp(u, 'Z')
    await u.click(within(row('X')).getByRole('button', { name: /mark done x/i }))
    await u.click(within(row('X')).getByRole('button', { name: /winner: a for x/i }))
    await u.click(within(row('Y')).getByRole('button', { name: /mark done y/i }))
    await u.click(within(row('Y')).getByRole('button', { name: /winner: a for y/i }))
    await u.click(within(row('Z')).getByRole('button', { name: /mark done z/i }))
    await u.click(within(row('Z')).getByRole('button', { name: /winner: b for z/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Finished: 3')).toBeInTheDocument()
    expect(screen.getByText('Win rate A: 67%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 33%')).toBeInTheDocument()
  })

  it('Stats ignores the Running filter when computing totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'P')
    await addExp(u, 'Q')
    await u.click(within(row('P')).getByRole('button', { name: /mark done p/i }))
    await u.click(within(row('P')).getByRole('button', { name: /winner: b for p/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Finished: 1')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Experiments')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Persist me')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })
})
