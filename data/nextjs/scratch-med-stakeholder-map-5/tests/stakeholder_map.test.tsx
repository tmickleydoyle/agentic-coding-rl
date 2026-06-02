import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

async function addStakeholder(u: U, name: string, influence: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Influence'), influence)
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

describe('Stakeholder Map app', () => {
  it('starts on the Stakeholders view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Stakeholders' })).toBeInTheDocument()
  })

  it('shows seed data on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows Showing: 3 with seed data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
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

  it('navigates back to Stakeholders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: 'Stakeholders' })).toBeInTheDocument()
  })

  it('adds a new stakeholder and shows Showing: 4', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'high')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })

  it('ignores blank name when adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('new stakeholder defaults to Not supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'med')
    expect(within(row('Eve')).getByText('Not supportive')).toBeInTheDocument()
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove bob/i }))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('toggles supportive status', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(within(row('Bob')).getByText('Not supportive')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle support bob/i }))
    expect(within(row('Bob')).getByText('Supportive')).toBeInTheDocument()
  })

  it('filter by influence high shows only high stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('filter by influence low shows only low stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('summary shows correct seed totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('summary shows correct supportive counts for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
    expect(screen.getByText('Not supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 67%')).toBeInTheDocument()
  })

  it('summary updates after adding a stakeholder (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Frank', 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('High: 2')).toBeInTheDocument()
  })

  it('summary updates after toggling support (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle support bob/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 3')).toBeInTheDocument()
    expect(screen.getByText('Not supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('summary updates after removing a stakeholder (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 0')).toBeInTheDocument()
  })

  it('support rate is 0% when all stakeholders removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove alice/i }))
    await u.click(screen.getByRole('button', { name: /remove bob/i }))
    await u.click(screen.getByRole('button', { name: /remove carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Grace', 'med')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Grace')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })
})
