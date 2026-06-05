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

describe('Stakeholder Map app', () => {
  it('starts on the Stakeholders view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: /stakeholders/i })).toBeInTheDocument()
  })

  it('adds a stakeholder and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('ignores a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('new stakeholder defaults to Supportive: No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'med')
    expect(within(getRow('Bob')).getByRole('button', { name: /toggle supportive bob/i })).toHaveTextContent('Supportive: No')
  })

  it('toggling supportive changes button text to Yes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'low')
    await u.click(within(getRow('Carol')).getByRole('button', { name: /toggle supportive carol/i }))
    expect(within(getRow('Carol')).getByRole('button', { name: /toggle supportive carol/i })).toHaveTextContent('Supportive: Yes')
  })

  it('toggling supportive twice reverts to No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dan', 'high')
    await u.click(within(getRow('Dan')).getByRole('button', { name: /toggle supportive dan/i }))
    await u.click(within(getRow('Dan')).getByRole('button', { name: /toggle supportive dan/i }))
    expect(within(getRow('Dan')).getByRole('button', { name: /toggle supportive dan/i })).toHaveTextContent('Supportive: No')
  })

  it('filter by influence hides non-matching stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'high')
    await addStakeholder(u, 'Frank', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.queryByText('Frank')).not.toBeInTheDocument()
  })

  it('filter updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'G1', 'high')
    await addStakeholder(u, 'G2', 'high')
    await addStakeholder(u, 'G3', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'H1', 'high')
    await addStakeholder(u, 'H2', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('Summary shows zero stats when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ivy', 'high')
    await addStakeholder(u, 'Jay', 'med')
    await addStakeholder(u, 'Kay', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('Summary Supportive count updates when toggled', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Leo', 'high')
    await addStakeholder(u, 'Mia', 'med')
    await u.click(within(getRow('Leo')).getByRole('button', { name: /toggle supportive leo/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('Support rate rounds correctly for all supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ned', 'low')
    await u.click(within(getRow('Ned')).getByRole('button', { name: /toggle supportive ned/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('filter does not affect Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ora', 'high')
    await addStakeholder(u, 'Pat', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
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
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stakeholders')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('stakeholder list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Quinn', 'med')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Quinn')).toBeInTheDocument()
  })

  it('multiple stakeholders appear in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Rose', 'high')
    await addStakeholder(u, 'Sam', 'low')
    expect(screen.getByText('Rose')).toBeInTheDocument()
    expect(screen.getByText('Sam')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('low filter shows only low influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Tina', 'high')
    await addStakeholder(u, 'Uma', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.queryByText('Tina')).not.toBeInTheDocument()
    expect(screen.getByText('Uma')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
  })
})
