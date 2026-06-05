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

describe('Stakeholder Map (held-out)', () => {
  it('filter by med shows only med stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('adding a high stakeholder increments High count in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Hank', 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('adding a low stakeholder increments Low count in summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ivy', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Low: 2')).toBeInTheDocument()
  })

  it('toggling Alice off changes summary supportive counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle support alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Not supportive: 2')).toBeInTheDocument()
  })

  it('support rate rounds correctly for 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle support alice/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })

  it('double-toggle returns stakeholder to original status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle support alice/i }))
    await u.click(screen.getByRole('button', { name: /toggle support alice/i }))
    expect(within(row('Alice')).getByText('Supportive')).toBeInTheDocument()
  })

  it('filter does not affect summary totals (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('removing all leaves Showing: 0 on stakeholders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove alice/i }))
    await u.click(screen.getByRole('button', { name: /remove bob/i }))
    await u.click(screen.getByRole('button', { name: /remove carol/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('added stakeholder influence shown in row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Jake', 'med')
    expect(within(row('Jake')).getByText('med')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('summary Med count increments after adding med stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Lena', 'med')
    await addStakeholder(u, 'Mike', 'med')
    await nav(u, 'Summary')
    expect(screen.getByText('Med: 3')).toBeInTheDocument()
  })
})
