import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence?: string) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (influence) {
    await u.selectOptions(screen.getByLabelText('Influence'), influence)
  }
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map app', () => {
  it('starts on the Stakeholders view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: /stakeholders/i })).toBeInTheDocument()
  })

  it('adds a stakeholder and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank stakeholder name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('new stakeholder starts as not supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'med')
    expect(within(row('Bob')).getByRole('button', { name: /not supportive/i })).toBeInTheDocument()
  })

  it('toggles supportive state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'low')
    await u.click(within(row('Carol')).getByRole('button', { name: /not supportive/i }))
    expect(within(row('Carol')).getByRole('button', { name: /^supportive$/i })).toBeInTheDocument()
    await u.click(within(row('Carol')).getByRole('button', { name: /^supportive$/i }))
    expect(within(row('Carol')).getByRole('button', { name: /not supportive/i })).toBeInTheDocument()
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'high')
    await u.click(screen.getByRole('button', { name: /remove dave/i }))
    expect(screen.queryByText('Dave')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('filters stakeholders by influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'high')
    await addStakeholder(u, 'Frank', 'low')
    await addStakeholder(u, 'Grace', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.queryByText('Frank')).not.toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
  })

  it('filter all shows everyone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Hank', 'high')
    await addStakeholder(u, 'Ivy', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByText('Hank')).toBeInTheDocument()
    expect(screen.getByText('Ivy')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('summary shows zeros when no stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Jack', 'high')
    await addStakeholder(u, 'Kim', 'med')
    await addStakeholder(u, 'Leo', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Med influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('summary support rate updates after toggling supportive (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Mia', 'high')
    await addStakeholder(u, 'Ned', 'high')
    await u.click(within(row('Mia')).getByRole('button', { name: /not supportive/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('summary counts all stakeholders regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ora', 'high')
    await addStakeholder(u, 'Pat', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 1')).toBeInTheDocument()
  })

  it('persists stakeholder list state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Quinn', 'med')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Quinn')).toBeInTheDocument()
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
    await nav(u, 'Stakeholders')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('support rate rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ray', 'high')
    await addStakeholder(u, 'Sam', 'high')
    await addStakeholder(u, 'Tia', 'high')
    await u.click(within(row('Ray')).getByRole('button', { name: /not supportive/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })

  it('influence select defaults to high for new stakeholders', async () => {
    render(<App />)
    const select = screen.getByLabelText('Influence') as HTMLSelectElement
    expect(select.value).toBe('high')
  })
})
