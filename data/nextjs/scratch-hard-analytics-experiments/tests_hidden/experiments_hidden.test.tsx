// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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

describe('Experiment analytics (held-out)', () => {
  it('scopes variant counts to each experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'E1')
    await addExperiment(u, 'E2')
    await nav(u, 'Variants')
    await addVariant(u, 'E1', 'A', '100', '10')
    await addVariant(u, 'E1', 'B', '100', '20')
    await addVariant(u, 'E2', 'C', '100', '30')
    await nav(u, 'Experiments')
    expect(screen.getByText('E1 (2 variants)')).toBeInTheDocument()
    expect(screen.getByText('E2 (1 variants)')).toBeInTheDocument()
  })

  it('computes winner independently per experiment', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'E1')
    await addExperiment(u, 'E2')
    await nav(u, 'Variants')
    await addVariant(u, 'E1', 'A', '100', '5')
    await addVariant(u, 'E1', 'B', '100', '15')
    await addVariant(u, 'E2', 'C', '100', '90')
    await addVariant(u, 'E2', 'D', '100', '10')
    await nav(u, 'Results')
    expect(within(results()).getByText('E1 winner: B (15%)')).toBeInTheDocument()
    expect(within(results()).getByText('E2 winner: C (90%)')).toBeInTheDocument()
  })

  it('overall rate ignores experiments with no visitors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'E1')
    await nav(u, 'Variants')
    await addVariant(u, 'E1', 'A', '0', '0')
    await addVariant(u, 'E1', 'B', '50', '25')
    await nav(u, 'Results')
    expect(within(results()).getByText('Total visitors: 50')).toBeInTheDocument()
    expect(within(results()).getByText('Total conversions: 25')).toBeInTheDocument()
    expect(within(results()).getByText('Overall conversion rate: 50%')).toBeInTheDocument()
  })

  it('hides empty but keeps non-empty after toggling twice', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExperiment(u, 'Full')
    await addExperiment(u, 'Empty')
    await nav(u, 'Variants')
    await addVariant(u, 'Full', 'A', '10', '1')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide empty experiments/i))
    await u.click(screen.getByLabelText(/hide empty experiments/i))
    await nav(u, 'Results')
    expect(within(results()).getByText('Empty winner: none')).toBeInTheDocument()
  })
})
