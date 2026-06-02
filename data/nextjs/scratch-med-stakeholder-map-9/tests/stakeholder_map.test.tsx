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
    expect(screen.getByRole('heading', { name: 'Stakeholders' })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: 'Stakeholders' })).toBeInTheDocument()
  })

  it('shows Showing: 0 stakeholders on empty list', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 stakeholders')).toBeInTheDocument()
  })

  it('adds a stakeholder and shows them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 stakeholders')).toBeInTheDocument()
  })

  it('ignores blank name on add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByText('Showing: 0 stakeholders')).toBeInTheDocument()
  })

  it('new stakeholders default to Supportive: No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'med')
    expect(within(getRow('Bob')).getByRole('button', { name: /toggle supportive for bob/i })).toHaveTextContent('Supportive: No')
  })

  it('toggles supportive from No to Yes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'low')
    await u.click(within(getRow('Carol')).getByRole('button', { name: /toggle supportive for carol/i }))
    expect(within(getRow('Carol')).getByRole('button', { name: /toggle supportive for carol/i })).toHaveTextContent('Supportive: Yes')
  })

  it('toggles supportive back from Yes to No', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dan', 'high')
    await u.click(within(getRow('Dan')).getByRole('button', { name: /toggle supportive for dan/i }))
    await u.click(within(getRow('Dan')).getByRole('button', { name: /toggle supportive for dan/i }))
    expect(within(getRow('Dan')).getByRole('button', { name: /toggle supportive for dan/i })).toHaveTextContent('Supportive: No')
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'med')
    await u.click(within(getRow('Eve')).getByRole('button', { name: /remove eve/i }))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0 stakeholders')).toBeInTheDocument()
  })

  it('filters list by influence level', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Frank', 'high')
    await addStakeholder(u, 'Grace', 'low')
    await addStakeholder(u, 'Hank', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
    expect(screen.queryByText('Hank')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 stakeholders')).toBeInTheDocument()
  })

  it('filter all shows everyone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Iris', 'high')
    await addStakeholder(u, 'Jake', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByText('Iris')).toBeInTheDocument()
    expect(screen.getByText('Jake')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 stakeholders')).toBeInTheDocument()
  })

  it('Summary shows Total: 0 and Support rate: 0% with no stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Lena', 'high')
    await addStakeholder(u, 'Mike', 'med')
    await addStakeholder(u, 'Nina', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('Summary Supportive count and Support rate update after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Omar', 'high')
    await addStakeholder(u, 'Pia', 'high')
    await u.click(within(getRow('Omar')).getByRole('button', { name: /toggle supportive for omar/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('Summary unfiltered counts ignore the Stakeholders view filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Quinn', 'high')
    await addStakeholder(u, 'Rosa', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 1 stakeholders')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('theme starts light and toggles to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
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

  it('stakeholder data persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Sam', 'med')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Sam')).toBeInTheDocument()
  })

  it('Support rate rounds correctly for non-round percentages', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'T1', 'high')
    await addStakeholder(u, 'T2', 'high')
    await addStakeholder(u, 'T3', 'high')
    await u.click(within(getRow('T1')).getByRole('button', { name: /toggle supportive for t1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })
})
