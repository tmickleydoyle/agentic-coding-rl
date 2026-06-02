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

  it('adds a stakeholder and updates heading count', async () => {
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

  it('new stakeholder starts as Supportive: No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'med')
    expect(within(row('Bob')).getByRole('button', { name: /toggle supportive for bob/i })).toHaveTextContent('Supportive: No')
  })

  it('toggles supportive to Yes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'low')
    await u.click(within(row('Carol')).getByRole('button', { name: /toggle supportive for carol/i }))
    expect(within(row('Carol')).getByRole('button', { name: /toggle supportive for carol/i })).toHaveTextContent('Supportive: Yes')
  })

  it('toggles supportive back to No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'high')
    await u.click(within(row('Dave')).getByRole('button', { name: /toggle supportive for dave/i }))
    await u.click(within(row('Dave')).getByRole('button', { name: /toggle supportive for dave/i }))
    expect(within(row('Dave')).getByRole('button', { name: /toggle supportive for dave/i })).toHaveTextContent('Supportive: No')
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'med')
    await u.click(screen.getByRole('button', { name: /remove eve/i }))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(0\)/i })).toBeInTheDocument()
  })

  it('filters by High influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'med')
    await addStakeholder(u, 'Carol', 'low')
    await u.click(screen.getByRole('button', { name: 'High', pressed: false }))
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('filters by Med influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'med')
    await addStakeholder(u, 'Carol', 'med')
    await u.click(screen.getByRole('button', { name: 'Med' }))
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('All filter shows everyone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'low')
    await u.click(screen.getByRole('button', { name: 'High' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'High' }))
    expect(screen.getByRole('button', { name: 'High' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('Summary shows zeros when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'med')
    await addStakeholder(u, 'Carol', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Med influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 1')).toBeInTheDocument()
  })

  it('Summary counts supportive correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'med')
    await u.click(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('Summary support rate is 100% when all are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'low')
    await u.click(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i }))
    await u.click(within(row('Bob')).getByRole('button', { name: /toggle supportive for bob/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('Summary does not apply filter (counts all)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    await addStakeholder(u, 'Bob', 'med')
    await u.click(screen.getByRole('button', { name: 'High' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
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

  it('stakeholder list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Persistent', 'high')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })
})
