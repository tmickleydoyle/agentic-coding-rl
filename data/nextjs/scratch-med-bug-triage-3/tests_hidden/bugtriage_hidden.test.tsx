import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string = 'low') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

function bugRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Bug Triage (held-out)', () => {
  it('heading count reflects filter state — closed filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'C1', 'low')
    await addBug(u, 'C2', 'medium')
    await addBug(u, 'C3', 'high')
    await u.click(screen.getByRole('button', { name: /close c1/i }))
    await u.click(screen.getByRole('button', { name: /close c3/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
  })

  it('close then reopen updates stats open count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Toggle me', 'high')
    await u.click(screen.getByRole('button', { name: /close toggle me/i }))
    await u.click(screen.getByRole('button', { name: /reopen toggle me/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed rate: 0%')).toBeInTheDocument()
  })

  it('stats open high only counts open bugs with high severity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'OpenHigh', 'high')
    await addBug(u, 'ClosedHigh', 'high')
    await u.click(screen.getByRole('button', { name: /close closedhigh/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open high: 1')).toBeInTheDocument()
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
  })

  it('closed rate rounds to nearest whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'B1', 'low')
    await addBug(u, 'B2', 'low')
    await addBug(u, 'B3', 'low')
    await u.click(screen.getByRole('button', { name: /close b1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Closed rate: 33%')).toBeInTheDocument()
  })

  it('multiple bugs added, open all shows all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug Alpha', 'low')
    await addBug(u, 'Bug Beta', 'medium')
    await addBug(u, 'Bug Gamma', 'high')
    expect(screen.getByRole('heading', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Keep1', 'low')
    await addBug(u, 'Keep2', 'low')
    await u.click(screen.getByRole('button', { name: /close keep1/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Keep1')).not.toBeInTheDocument()
  })

  it('stats open medium counts correctly after closing one', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Med1', 'medium')
    await addBug(u, 'Med2', 'medium')
    await u.click(screen.getByRole('button', { name: /close med1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open medium: 1')).toBeInTheDocument()
  })

  it('close button disabled and reopen enabled after closing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Duo', 'low')
    await u.click(screen.getByRole('button', { name: /close duo/i }))
    expect(screen.getByRole('button', { name: /close duo/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /reopen duo/i })).not.toBeDisabled()
  })

  it('theme toggle cycles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats open low is 0 when all low bugs are closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'LowBug', 'low')
    await u.click(screen.getByRole('button', { name: /close lowbug/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open low: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })
})
