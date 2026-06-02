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

async function addStakeholder(u: U, name: string, influence: 'high' | 'med' | 'low') {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Influence'), influence)
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

describe('Stakeholder Map app', () => {
  it('starts on the Stakeholders view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /stakeholders \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
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

  it('seeded Alice shows Supportive toggle label', () => {
    render(<App />)
    expect(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i })).toHaveTextContent('Supportive')
  })

  it('seeded Bob shows Not supportive toggle label', () => {
    render(<App />)
    expect(within(row('Bob')).getByRole('button', { name: /toggle supportive for bob/i })).toHaveTextContent('Not supportive')
  })

  it('toggles Bob to supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Bob')).getByRole('button', { name: /toggle supportive for bob/i }))
    expect(within(row('Bob')).getByRole('button', { name: /toggle supportive for bob/i })).toHaveTextContent('Supportive')
  })

  it('adds a new stakeholder and count updates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'high')
    expect(screen.getByRole('heading', { name: /stakeholders \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Dave')).toBeInTheDocument()
  })

  it('ignores a blank name when adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: /stakeholders \(3\)/i })).toBeInTheDocument()
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Bob')).getByRole('button', { name: /remove bob/i }))
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('filters by high influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('filters by med influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('filters by low influence', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('all filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByRole('heading', { name: /stakeholders \(3\)/i })).toBeInTheDocument()
  })

  it('Summary shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('Summary shows seeded supportive count and rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 67%')).toBeInTheDocument()
  })

  it('Summary shows 0% when no stakeholders exist (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Alice')).getByRole('button', { name: /remove alice/i }))
    await u.click(within(row('Bob')).getByRole('button', { name: /remove bob/i }))
    await u.click(within(row('Carol')).getByRole('button', { name: /remove carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('toggling supportive updates Summary (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Bob')).getByRole('button', { name: /toggle supportive for bob/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 3')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('adding a stakeholder updates Summary totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('High: 2')).toBeInTheDocument()
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

  it('state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Frank', 'med')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /stakeholders \(4\)/i })).toBeInTheDocument()
  })
})
