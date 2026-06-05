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
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map app', () => {
  it('starts on the Stakeholders view with heading showing 0', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('adds a stakeholder and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('ignores a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('new stakeholder starts as Supportive: No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'med')
    expect(within(row('Bob')).getByRole('button', { name: 'Supportive: No' })).toBeInTheDocument()
  })

  it('toggling supportive changes button label to Yes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'low')
    await u.click(within(row('Carol')).getByRole('button', { name: 'Supportive: No' }))
    expect(within(row('Carol')).getByRole('button', { name: 'Supportive: Yes' })).toBeInTheDocument()
  })

  it('toggling supportive twice returns to No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dan', 'high')
    await u.click(within(row('Dan')).getByRole('button', { name: 'Supportive: No' }))
    await u.click(within(row('Dan')).getByRole('button', { name: 'Supportive: Yes' }))
    expect(within(row('Dan')).getByRole('button', { name: 'Supportive: No' })).toBeInTheDocument()
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'med')
    await u.click(screen.getByRole('button', { name: 'Remove Eve' }))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('filters by influence and updates visible count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Frank', 'high')
    await addStakeholder(u, 'Grace', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Hank', 'high')
    await addStakeholder(u, 'Iris', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByRole('heading', { name: 'Stakeholders (2)' })).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Jack', 'low')
    await addStakeholder(u, 'Kim', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
  })

  it('Summary shows Total: 0 with no stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Leo', 'high')
    await addStakeholder(u, 'Mia', 'med')
    await addStakeholder(u, 'Ned', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('Summary Supportive count updates from toggle (cross-view interaction)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ona', 'high')
    await addStakeholder(u, 'Pete', 'high')
    await u.click(within(row('Ona')).getByRole('button', { name: 'Supportive: No' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('Summary unfiltered totals ignore active filter on Stakeholders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Quinn', 'high')
    await addStakeholder(u, 'Rosa', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
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

  it('stakeholder data persists across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Sam', 'med')
    await nav(u, 'Settings')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Sam')).toBeInTheDocument()
  })

  it('Support rate rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'T1', 'high')
    await addStakeholder(u, 'T2', 'high')
    await addStakeholder(u, 'T3', 'high')
    await u.click(within(row('T1')).getByRole('button', { name: 'Supportive: No' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })
})
