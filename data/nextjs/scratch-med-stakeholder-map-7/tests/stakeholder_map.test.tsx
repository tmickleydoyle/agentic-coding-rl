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

describe('Stakeholder Map app', () => {
  it('starts on the Stakeholders view with empty list', () => {
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

  it('navigates back to Stakeholders after visiting other views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('adds a stakeholder with High influence and shows it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alice', 'High')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
  })

  it('ignores blank name input', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('new stakeholder starts as supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Bob', 'Med')
    const li = screen.getByText('Bob').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: 'Supportive' })).toBeInTheDocument()
  })

  it('toggles a stakeholder from supportive to not supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Carol', 'Low')
    const li = screen.getByText('Carol').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Supportive' }))
    expect(within(li).getByRole('button', { name: 'Not supportive' })).toBeInTheDocument()
  })

  it('toggles a stakeholder back to supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'High')
    const li = screen.getByText('Dave').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Supportive' }))
    await u.click(within(li).getByRole('button', { name: 'Not supportive' }))
    expect(within(li).getByRole('button', { name: 'Supportive' })).toBeInTheDocument()
  })

  it('removes a stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Eve', 'Med')
    await u.click(screen.getByRole('button', { name: 'Remove Eve' }))
    expect(screen.queryByText('Eve')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('filters by influence level hides non-matching rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Frank', 'High')
    await addStakeholder(u, 'Grace', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'High')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.queryByText('Grace')).not.toBeInTheDocument()
  })

  it('filter updates the visible count in heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Hank', 'High')
    await addStakeholder(u, 'Ivy', 'Med')
    await addStakeholder(u, 'Jack', 'High')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'High')
    expect(screen.getByRole('heading', { name: 'Stakeholders (2)' })).toBeInTheDocument()
  })

  it('All filter shows everyone again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Kim', 'High')
    await addStakeholder(u, 'Lee', 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'Low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'All')
    expect(screen.getByRole('heading', { name: 'Stakeholders (2)' })).toBeInTheDocument()
    expect(screen.getByText('Kim')).toBeInTheDocument()
    expect(screen.getByText('Lee')).toBeInTheDocument()
  })

  it('Summary shows zero stats when no stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added stakeholders (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Mia', 'High')
    await addStakeholder(u, 'Ned', 'Med')
    await addStakeholder(u, 'Ora', 'Low')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('Summary support rate is 100% when all are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Pat', 'High')
    await addStakeholder(u, 'Quinn', 'Med')
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
  })

  it('Summary support rate updates after toggling a stakeholder (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Rosa', 'High')
    await addStakeholder(u, 'Sam', 'Low')
    const li = screen.getByText('Rosa').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Supportive' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 50%')).toBeInTheDocument()
  })

  it('Summary filtered stats still count hidden rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Tess', 'High')
    await addStakeholder(u, 'Uma', 'Med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'High')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
  })

  it('Settings toggles theme to dark', async () => {
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

  it('stakeholder list persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Vera', 'High')
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(screen.getByText('Vera')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stakeholders (1)' })).toBeInTheDocument()
  })
})
