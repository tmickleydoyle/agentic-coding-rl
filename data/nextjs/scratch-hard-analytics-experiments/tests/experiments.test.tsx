import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExperiment(u: U, name: string) {
  await u.clear(screen.getByLabelText(/experiment name/i))
  await u.type(screen.getByLabelText(/experiment name/i), name)
  await u.click(screen.getByRole('button', { name: /add experiment/i }))
}

async function addVariant(u: U, exp: string, name: string, visitors: string, conversions: string) {
  await u.selectOptions(screen.getByLabelText(/^experiment$/i), exp)
  await u.clear(screen.getByLabelText(/variant name/i))
  await u.type(screen.getByLabelText(/variant name/i), name)
  await u.clear(screen.getByLabelText(/^visitors$/i))
  if (visitors) await u.type(screen.getByLabelText(/^visitors$/i), visitors)
  await u.clear(screen.getByLabelText(/^conversions$/i))
  if (conversions) await u.type(screen.getByLabelText(/^conversions$/i), conversions)
  await u.click(screen.getByRole('button', { name: /add variant/i }))
}

function results() {
  return screen.getByRole('region', { name: 'Results view' })
}

describe('Experiment analytics app', () => {
  it('starts on Experiments', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Experiments' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Variants')
    expect(screen.getByRole('heading', { name: 'Variants' })).toBeInTheDocument()
    await nav(u, 'Results')
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Experiments')
    expect(screen.getByRole('heading', { name: 'Experiments' })).toBeInTheDocument()
  })

  it('adds an experiment showing zero variants', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Checkout color')
    expect(screen.getByText('Checkout color (0 variants)')).toBeInTheDocument()
  })

  it('ignores a blank experiment name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/experiment name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add experiment/i }))
    expect(screen.queryByText(/variants\)/i)).not.toBeInTheDocument()
  })

  it('adds a variant and shows its conversion rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'Blue', '200', '50')
    expect(screen.getByText('Blue: 50/200 (25%)')).toBeInTheDocument()
  })

  it('rounds the conversion rate to a whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'A', '3', '1')
    expect(screen.getByText('A: 1/3 (33%)')).toBeInTheDocument()
  })

  it('shows 0% conversion when visitors is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'Empty', '', '')
    expect(screen.getByText('Empty: 0/0 (0%)')).toBeInTheDocument()
  })

  it('ignores a variant whose conversions exceed visitors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'Bad', '10', '20')
    expect(screen.queryByText(/Bad:/)).not.toBeInTheDocument()
  })

  it('counts variants back on the Experiments view (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'A', '100', '10')
    await addVariant(u, 'Exp', 'B', '100', '20')
    await nav(u, 'Experiments')
    expect(screen.getByText('Exp (2 variants)')).toBeInTheDocument()
  })

  it('picks the variant with the highest rate as winner', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'Low', '100', '10')
    await addVariant(u, 'Exp', 'High', '100', '40')
    await nav(u, 'Results')
    expect(within(results()).getByText('Exp winner: High (40%)')).toBeInTheDocument()
  })

  it('shows winner none for an experiment with no variants', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Lonely')
    await nav(u, 'Results')
    expect(within(results()).getByText('Lonely winner: none')).toBeInTheDocument()
  })

  it('computes overall totals and blended rate across experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'E1')
    await addExperiment(u, 'E2')
    await nav(u, 'Variants')
    await addVariant(u, 'E1', 'A', '100', '10')
    await addVariant(u, 'E2', 'B', '300', '90')
    await nav(u, 'Results')
    expect(within(results()).getByText('Total visitors: 400')).toBeInTheDocument()
    expect(within(results()).getByText('Total conversions: 100')).toBeInTheDocument()
    expect(within(results()).getByText('Overall conversion rate: 25%')).toBeInTheDocument()
  })

  it('breaks a rate tie in favor of the variant added first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'First', '100', '20')
    await addVariant(u, 'Exp', 'Second', '50', '10')
    await nav(u, 'Results')
    expect(within(results()).getByText('Exp winner: First (20%)')).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Results')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides empty experiments in Results when the setting is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Full')
    await addExperiment(u, 'Empty')
    await nav(u, 'Variants')
    await addVariant(u, 'Full', 'A', '100', '50')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide empty experiments/i))
    await nav(u, 'Results')
    expect(within(results()).getByText('Full winner: A (50%)')).toBeInTheDocument()
    expect(within(results()).queryByText('Empty winner: none')).not.toBeInTheDocument()
  })

  it('keeps empty experiments visible in Results by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Empty')
    await nav(u, 'Results')
    expect(within(results()).getByText('Empty winner: none')).toBeInTheDocument()
  })

  it('treats a non-positive visitor count as zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Exp')
    await nav(u, 'Variants')
    await addVariant(u, 'Exp', 'Z', '0', '0')
    expect(screen.getByText('Z: 0/0 (0%)')).toBeInTheDocument()
  })

  it('ignores a variant when no experiment is selected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Variants')
    await u.type(screen.getByLabelText(/variant name/i), 'Orphan')
    await u.type(screen.getByLabelText(/^visitors$/i), '10')
    await u.type(screen.getByLabelText(/^conversions$/i), '5')
    await u.click(screen.getByRole('button', { name: /add variant/i }))
    expect(screen.queryByText(/Orphan:/)).not.toBeInTheDocument()
  })
})
