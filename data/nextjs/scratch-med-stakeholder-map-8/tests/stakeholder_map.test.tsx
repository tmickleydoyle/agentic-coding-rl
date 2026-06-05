import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence: 'High' | 'Medium' | 'Low' = 'High') {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Influence'), influence)
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

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('adds a stakeholder and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'High')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('ignores a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('new stakeholder starts as Supportive: No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'Medium')
    expect(within(row('Bob')).getByRole('button', { name: /toggle supportive bob/i })).toHaveTextContent('Supportive: No')
  })

  it('toggling supportive changes the button label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'Low')
    await u.click(within(row('Carol')).getByRole('button', { name: /toggle supportive carol/i }))
    expect(within(row('Carol')).getByRole('button', { name: /toggle supportive carol/i })).toHaveTextContent('Supportive: Yes')
    await u.click(within(row('Carol')).getByRole('button', { name: /toggle supportive carol/i }))
    expect(within(row('Carol')).getByRole('button', { name: /toggle supportive carol/i })).toHaveTextContent('Supportive: No')
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'High')
    await u.click(within(row('Dave')).getByRole('button', { name: /remove dave/i }))
    expect(screen.queryByText('Dave')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('filter by influence shows only matching stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'High')
    await addStakeholder(u, 'Frank', 'Low')
    await addStakeholder(u, 'Grace', 'Medium')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'High')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.queryByText('Frank')).not.toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
  })

  it('filter All restores all stakeholders in heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Hank', 'High')
    await addStakeholder(u, 'Iris', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'Low')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'All')
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('Summary shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Jake', 'High')
    await addStakeholder(u, 'Kim', 'Medium')
    await addStakeholder(u, 'Leo', 'Low')
    await nav(u, 'Summary')
    expect(screen.getByText(/total stakeholders: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/high: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/medium: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/low: 1/i)).toBeInTheDocument()
  })

  it('Summary shows 0% support rate with no stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/support rate: 0%/i)).toBeInTheDocument()
  })

  it('Summary reflects supportive toggles (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Mia', 'High')
    await addStakeholder(u, 'Ned', 'Low')
    await u.click(within(row('Mia')).getByRole('button', { name: /toggle supportive mia/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/supportive: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/support rate: 50%/i)).toBeInTheDocument()
  })

  it('Support rate rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ona', 'High')
    await addStakeholder(u, 'Pat', 'Medium')
    await addStakeholder(u, 'Quinn', 'Low')
    await u.click(within(row('Ona')).getByRole('button', { name: /toggle supportive ona/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/support rate: 33%/i)).toBeInTheDocument()
  })

  it('removing a stakeholder updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Rosa', 'High')
    await addStakeholder(u, 'Sam', 'High')
    await u.click(within(row('Rosa')).getByRole('button', { name: /remove rosa/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/total stakeholders: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/high: 1/i)).toBeInTheDocument()
  })

  it('theme toggles via Settings and persists across views', async () => {
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

  it('stakeholder list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Tara', 'Medium')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Tara')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
  })

  it('multiple stakeholders with same influence counted in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Uma', 'High')
    await addStakeholder(u, 'Vic', 'High')
    await addStakeholder(u, 'Wes', 'Low')
    await nav(u, 'Summary')
    expect(screen.getByText(/total stakeholders: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/high: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/low: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/medium: 0/i)).toBeInTheDocument()
  })
})
