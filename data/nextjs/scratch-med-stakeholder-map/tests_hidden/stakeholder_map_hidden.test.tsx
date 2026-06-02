// HELD-OUT generalization tests — fresh scenarios used only for eval.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence: 'high' | 'med' | 'low' = 'high') {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Influence'), influence)
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

function getRow(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map (held-out)', () => {
  it('Summary High/Med/Low counts match added stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'A', 'high')
    await addStakeholder(u, 'B', 'high')
    await addStakeholder(u, 'C', 'med')
    await addStakeholder(u, 'D', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('support rate rounds to 33% for one-of-three supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'X', 'high')
    await addStakeholder(u, 'Y', 'med')
    await addStakeholder(u, 'Z', 'low')
    await u.click(within(getRow('X')).getByRole('button', { name: /toggle supportive x/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })

  it('supportive count in Summary updates after multiple toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'P', 'high')
    await addStakeholder(u, 'Q', 'low')
    await u.click(within(getRow('P')).getByRole('button', { name: /toggle supportive p/i }))
    await u.click(within(getRow('Q')).getByRole('button', { name: /toggle supportive q/i }))
    await u.click(within(getRow('P')).getByRole('button', { name: /toggle supportive p/i })) // P back to No
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('med filter count heading is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'R', 'med')
    await addStakeholder(u, 'S', 'med')
    await addStakeholder(u, 'T', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('T')).not.toBeInTheDocument()
  })

  it('filter persists when navigating back to Stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'U', 'high')
    await addStakeholder(u, 'V', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('U')).toBeInTheDocument()
    expect(screen.queryByText('V')).not.toBeInTheDocument()
  })

  it('Summary Supportive stays 0 with no toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'W', 'high')
    await addStakeholder(u, 'XX', 'med')
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
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

  it('blank-name add attempt leaves count at 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Influence'), 'low')
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('Summary total ignores active filter on Stakeholders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Y1', 'high')
    await addStakeholder(u, 'Y2', 'high')
    await addStakeholder(u, 'Y3', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })
})
