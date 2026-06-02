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

  it('starts with an empty list and Showing: 0', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('adds a stakeholder and shows them in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'high')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('ignores a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('new stakeholders default to Supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'med')
    expect(within(rowFor('Bob')).getByRole('button', { name: /toggle support for bob/i })).toHaveTextContent('Supportive')
  })

  it('toggles support status between Supportive and Unsupportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'low')
    const toggle = within(rowFor('Carol')).getByRole('button', { name: /toggle support for carol/i })
    expect(toggle).toHaveTextContent('Supportive')
    await u.click(toggle)
    expect(toggle).toHaveTextContent('Unsupportive')
    await u.click(toggle)
    expect(toggle).toHaveTextContent('Supportive')
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'high')
    expect(screen.getByText('Dave')).toBeInTheDocument()
    await u.click(within(rowFor('Dave')).getByRole('button', { name: /remove dave/i }))
    expect(screen.queryByText('Dave')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('filters the list by influence level', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'high')
    await addStakeholder(u, 'Frank', 'med')
    await addStakeholder(u, 'Grace', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.queryByText('Frank')).not.toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
  })

  it('filter all shows all stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'H', 'high')
    await addStakeholder(u, 'M', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'all')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('summary shows 0% support rate with no stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total stakeholders: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ivy', 'high')
    await addStakeholder(u, 'Jack', 'med')
    await nav(u, 'Summary')
    expect(screen.getByText('Total stakeholders: 2')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
    expect(screen.getByText('Unsupportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('summary counts influence groups correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'A', 'high')
    await addStakeholder(u, 'B', 'high')
    await addStakeholder(u, 'C', 'med')
    await addStakeholder(u, 'D', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('High influence: 2')).toBeInTheDocument()
    expect(screen.getByText('Med influence: 1')).toBeInTheDocument()
    expect(screen.getByText('Low influence: 1')).toBeInTheDocument()
  })

  it('summary updates support rate after toggling (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Kay', 'low')
    await addStakeholder(u, 'Leo', 'low')
    await u.click(within(rowFor('Kay')).getByRole('button', { name: /toggle support for kay/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Unsupportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('summary updates after removal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Mia', 'high')
    await addStakeholder(u, 'Ned', 'med')
    await nav(u, 'Stakeholders')
    await u.click(within(rowFor('Ned')).getByRole('button', { name: /remove ned/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total stakeholders: 1')).toBeInTheDocument()
  })

  it('theme toggles between light and dark via data-theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
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

  it('state persists when navigating away and back to Stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Olive', 'med')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Olive')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('filter by med shows only med stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'P', 'high')
    await addStakeholder(u, 'Q', 'med')
    await addStakeholder(u, 'R', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    expect(screen.queryByText('P')).not.toBeInTheDocument()
  })

  it('summary support rate rounds correctly for one of three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'X1', 'high')
    await addStakeholder(u, 'X2', 'med')
    await addStakeholder(u, 'X3', 'low')
    await u.click(within(rowFor('X2')).getByRole('button', { name: /toggle support for x2/i }))
    await u.click(within(rowFor('X3')).getByRole('button', { name: /toggle support for x3/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })
})
