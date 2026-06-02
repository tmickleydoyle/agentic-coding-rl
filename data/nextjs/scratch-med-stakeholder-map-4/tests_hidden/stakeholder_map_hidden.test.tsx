// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
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

function rowFor(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map (held-out)', () => {
  it('adding multiple stakeholders updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ana', 'high')
    await addStakeholder(u, 'Ben', 'med')
    await addStakeholder(u, 'Cho', 'low')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('filter by low shows only low-influence stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Del', 'high')
    await addStakeholder(u, 'Eli', 'low')
    await addStakeholder(u, 'Fin', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.queryByText('Del')).not.toBeInTheDocument()
    expect(screen.getByText('Eli')).toBeInTheDocument()
    expect(screen.getByText('Fin')).toBeInTheDocument()
  })

  it('removing all stakeholders resets Showing to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Gio', 'high')
    await u.click(within(rowFor('Gio')).getByRole('button', { name: /remove gio/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('summary shows correct Unsupportive count after multiple toggles', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Hal', 'high')
    await addStakeholder(u, 'Ida', 'med')
    await addStakeholder(u, 'Jon', 'low')
    await u.click(within(rowFor('Hal')).getByRole('button', { name: /toggle support for hal/i }))
    await u.click(within(rowFor('Ida')).getByRole('button', { name: /toggle support for ida/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Unsupportive: 2')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('summary high/med/low counts update after removal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Kim', 'high')
    await addStakeholder(u, 'Lou', 'high')
    await addStakeholder(u, 'Mae', 'med')
    await u.click(within(rowFor('Kim')).getByRole('button', { name: /remove kim/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('High influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Med influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 0')).toBeInTheDocument()
  })

  it('100% support rate when all stakeholders are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Nia', 'high')
    await addStakeholder(u, 'Olu', 'med')
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('0% support rate when all stakeholders are unsupportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Pat', 'low')
    await addStakeholder(u, 'Qui', 'high')
    await u.click(within(rowFor('Pat')).getByRole('button', { name: /toggle support for pat/i }))
    await u.click(within(rowFor('Qui')).getByRole('button', { name: /toggle support for qui/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Unsupportive: 2')).toBeInTheDocument()
  })

  it('filter does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Rex', 'high')
    await addStakeholder(u, 'Sam', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total stakeholders: 2')).toBeInTheDocument()
  })

  it('adding a stakeholder with med influence shows med in their row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Tia', 'med')
    expect(within(rowFor('Tia')).getByText('med')).toBeInTheDocument()
  })

  it('input clears after adding a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Uma', 'high')
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })
})
