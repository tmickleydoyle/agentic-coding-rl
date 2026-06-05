// HELD-OUT generalization tests — overlaid only at eval. Fresh cross-view scenarios.
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

describe('Stakeholder Map (held-out)', () => {
  it('adding multiple stakeholders updates Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Alex', 'high')
    await addStakeholder(u, 'Blair', 'high')
    await addStakeholder(u, 'Casey', 'low')
    expect(screen.getByText('Showing: 3 stakeholders')).toBeInTheDocument()
  })

  it('filter med shows only med stakeholders and correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dana', 'med')
    await addStakeholder(u, 'Evan', 'high')
    await addStakeholder(u, 'Faye', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByText('Showing: 2 stakeholders')).toBeInTheDocument()
    expect(screen.getByText('Dana')).toBeInTheDocument()
    expect(screen.getByText('Faye')).toBeInTheDocument()
    expect(screen.queryByText('Evan')).not.toBeInTheDocument()
  })

  it('remove lowers the Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Gabe', 'low')
    await addStakeholder(u, 'Hira', 'low')
    await u.click(within(getRow('Gabe')).getByRole('button', { name: /remove gabe/i }))
    expect(screen.getByText('Showing: 1 stakeholders')).toBeInTheDocument()
  })

  it('Summary High count increases when high stakeholder added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ivan', 'high')
    await addStakeholder(u, 'Jade', 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
  })

  it('Summary Supportive reflects all supportive regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Kim', 'high')
    await addStakeholder(u, 'Leo', 'low')
    await u.click(within(getRow('Kim')).getByRole('button', { name: /toggle supportive for kim/i }))
    await u.click(within(getRow('Leo')).getByRole('button', { name: /toggle supportive for leo/i }))
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('Support rate is 0% when no stakeholders are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Mia', 'med')
    await addStakeholder(u, 'Ned', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('removing a supportive stakeholder updates Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ora', 'high')
    await addStakeholder(u, 'Pete', 'high')
    await u.click(within(getRow('Ora')).getByRole('button', { name: /toggle supportive for ora/i }))
    await u.click(within(getRow('Pete')).getByRole('button', { name: /toggle supportive for pete/i }))
    await u.click(within(getRow('Ora')).getByRole('button', { name: /remove ora/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
  })

  it('theme toggle button shows current theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('filter by low then switch to high updates Showing count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Quinn', 'low')
    await addStakeholder(u, 'Raj', 'high')
    await addStakeholder(u, 'Sara', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.getByText('Showing: 1 stakeholders')).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    expect(screen.getByText('Showing: 2 stakeholders')).toBeInTheDocument()
  })

  it('Summary Med count is correct with mixed influence stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Tara', 'med')
    await addStakeholder(u, 'Uma', 'high')
    await addStakeholder(u, 'Vera', 'med')
    await addStakeholder(u, 'Will', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('Med: 2')).toBeInTheDocument()
    expect(screen.getByText('High: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })
})
