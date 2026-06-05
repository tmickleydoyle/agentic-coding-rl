// HELD-OUT generalization tests — fresh scenarios to measure generalization.
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

describe('Stakeholder Map (held-out)', () => {
  it('heading count reflects filter not total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Zara', 'high')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    // Alice + Zara visible, Bob + Carol hidden
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
  })

  it('Summary total is unaffected by filter on Stakeholders view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'high')
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('removing Carol updates Summary Low count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Carol')).getByRole('button', { name: /remove carol/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Low: 0')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('toggling Alice off then checking Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i }))
    await nav(u, 'Summary')
    // Alice off, Carol on => 1 supportive out of 3 => 33%
    expect(screen.getByText('Supportive: 1')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })

  it('new stakeholder starts as Not supportive', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Henry', 'low')
    expect(within(row('Henry')).getByRole('button', { name: /toggle supportive for henry/i })).toHaveTextContent('Not supportive')
  })

  it('double-toggle returns to original state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i }))
    await u.click(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i }))
    expect(within(row('Alice')).getByRole('button', { name: /toggle supportive for alice/i })).toHaveTextContent('Supportive')
  })

  it('Summary Med count updates after adding a med stakeholder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ivy', 'med')
    await nav(u, 'Summary')
    expect(screen.getByText('Med: 2')).toBeInTheDocument()
  })

  it('filter med shows only Bob', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'med')
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.queryByText('Carol')).not.toBeInTheDocument()
  })

  it('theme toggle changes data-theme to dark then back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('can add multiple stakeholders with same influence and filter shows all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Leo', 'low')
    await addStakeholder(u, 'Mia', 'low')
    await u.selectOptions(screen.getByLabelText('Filter by influence'), 'low')
    // Carol + Leo + Mia
    expect(screen.getByRole('heading', { name: /stakeholders \(3\)/i })).toBeInTheDocument()
  })
})
