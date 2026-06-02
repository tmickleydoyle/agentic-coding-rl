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
  await u.click(screen.getByRole('button', { name: 'Add' }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map (held-out)', () => {
  it('heading count reflects filter: med only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ava', 'high')
    await addStakeholder(u, 'Ben', 'med')
    await addStakeholder(u, 'Cleo', 'med')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.getByRole('heading', { name: 'Stakeholders (2)' })).toBeInTheDocument()
  })

  it('heading count is 0 when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Dave', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    expect(screen.getByRole('heading', { name: 'Stakeholders (0)' })).toBeInTheDocument()
  })

  it('all three influence levels counted correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'E1', 'high')
    await addStakeholder(u, 'E2', 'high')
    await addStakeholder(u, 'E3', 'med')
    await addStakeholder(u, 'E4', 'low')
    await nav(u, 'Summary')
    expect(screen.getByText('High: 2')).toBeInTheDocument()
    expect(screen.getByText('Med: 1')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('removing all supportive stakeholders sets rate to 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Finn', 'high')
    await u.click(within(row('Finn')).getByRole('button', { name: 'Supportive: No' }))
    await u.click(screen.getByRole('button', { name: 'Remove Finn' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('supportive count in Summary is unaffected by filter on Stakeholders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Gail', 'low')
    await addStakeholder(u, 'Hal', 'high')
    await u.click(within(row('Gail')).getByRole('button', { name: 'Supportive: No' }))
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('two toggles on same stakeholder leaves Summary Supportive count unchanged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Isla', 'med')
    await u.click(within(row('Isla')).getByRole('button', { name: 'Supportive: No' }))
    await u.click(within(row('Isla')).getByRole('button', { name: 'Supportive: Yes' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })

  it('removing a stakeholder updates Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Jake', 'high')
    await addStakeholder(u, 'Kara', 'low')
    await u.click(screen.getByRole('button', { name: 'Remove Jake' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('High: 0')).toBeInTheDocument()
    expect(screen.getByText('Low: 1')).toBeInTheDocument()
  })

  it('theme toggle shows dark then back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('support rate is 100% when all stakeholders are supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Lena', 'high')
    await addStakeholder(u, 'Max', 'med')
    await u.click(within(row('Lena')).getByRole('button', { name: 'Supportive: No' }))
    await u.click(within(row('Max')).getByRole('button', { name: 'Supportive: No' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Supportive: 2')).toBeInTheDocument()
  })
})
